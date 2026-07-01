import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Company } from "../models/Company.js";
import { PlacementDrive } from "../models/PlacementDrive.js";
import { Application } from "../models/Application.js";
import { Result } from "../models/Result.js";
import { StudentMaster } from "../models/StudentMaster.js";
import { User } from "../models/User.js";
import { generateExcel } from "../services/excelService.js";
import { bulkCreateNotifications } from "../services/notificationService.js";

// GET /api/v1/company/dashboard
export const getDashboard = catchAsyncErrors(async (req, res, next) => {
  const company = await Company.findById(req.user.companyRef);
  if (!company) return next(new ErrorHandler("Company profile not found.", 404));

  const drives = await PlacementDrive.find({ company: company._id });
  const driveIds = drives.map((d) => d._id);

  const [totalApplicants, selected, results] = await Promise.all([
    Application.countDocuments({ company: company._id }),
    Application.countDocuments({ company: company._id, status: "Selected" }),
    Result.find({ company: company._id }),
  ]);

  res.status(200).json({
    success: true,
    data: { company, totalDrives: drives.length, totalApplicants, totalSelected: selected, drives, results },
  });
});

// GET /api/v1/company/drives
export const getMyDrives = catchAsyncErrors(async (req, res, next) => {
  const company = await Company.findById(req.user.companyRef);
  const drives = await PlacementDrive.find({ company: company._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: drives.length, data: drives });
});

// GET /api/v1/company/drives/:driveId/roles/:roleId/applicants
export const getRoleApplicants = catchAsyncErrors(async (req, res, next) => {
  const { driveId, roleId } = req.params;
  const company = await Company.findById(req.user.companyRef);

  const drive = await PlacementDrive.findOne({ _id: driveId, company: company._id });
  if (!drive) return next(new ErrorHandler("Drive not found or access denied.", 404));

  // Company can only see applicants AFTER TPO has published (applicationStatus: Closed or drive published)
  const role = drive.roles.id(roleId);
  if (!role) return next(new ErrorHandler("Role not found.", 404));

  const { search, branch, status, page = 1, limit = 50 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build applicant query
  let query = { driveId, roleId };
  if (status) query.status = status;

  const applications = await Application.find(query)
    .populate({ path: "student", select: "fullName rollNumber branch cgpa collegeEmail contactNumber tenth twelfth activeBacklogs resumeLink" })
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ submittedAt: -1 });

  // Apply search/branch filter after population
  let filtered = applications;
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (a) => a.student?.fullName?.toLowerCase().includes(s) || a.student?.rollNumber?.toLowerCase().includes(s)
    );
  }
  if (branch) filtered = filtered.filter((a) => a.student?.branch === branch);

  const total = await Application.countDocuments(query);
  res.status(200).json({ success: true, count: filtered.length, total, data: filtered });
});

// GET /api/v1/company/drives/:driveId/roles/:roleId/export
export const exportApplicantsExcel = catchAsyncErrors(async (req, res, next) => {
  const { driveId, roleId } = req.params;
  const { columns } = req.query; // comma-separated column keys
  const company = await Company.findById(req.user.companyRef);

  const drive = await PlacementDrive.findOne({ _id: driveId, company: company._id });
  if (!drive) return next(new ErrorHandler("Drive not found or access denied.", 404));

  const applications = await Application.find({ driveId, roleId })
    .populate("student", "fullName rollNumber branch cgpa collegeEmail contactNumber tenth twelfth activeBacklogs");

  const ALLOWED_COLUMNS = {
    name: { key: "name", label: "Full Name" },
    rollNumber: { key: "rollNumber", label: "Roll Number" },
    branch: { key: "branch", label: "Branch" },
    cgpa: { key: "cgpa", label: "CGPA" },
    collegeEmail: { key: "collegeEmail", label: "College Email" },
    gender: { key: "gender", label: "Gender" },
    tenth: { key: "tenth", label: "10th %" },
    twelfth: { key: "twelfth", label: "12th %" },
    activeBacklogs: { key: "activeBacklogs", label: "Active Backlogs" },
    resumeLink: { key: "resumeLink", label: "Resume Link" },
    status: { key: "status", label: "Application Status" },
  };

  const selectedCols = columns
    ? columns.split(",").filter((c) => ALLOWED_COLUMNS[c]).map((c) => ALLOWED_COLUMNS[c])
    : Object.values(ALLOWED_COLUMNS);

  const rows = applications.map((app) => ({
    name: app.student?.fullName || "",
    rollNumber: app.student?.rollNumber || "",
    branch: app.student?.branch || "",
    cgpa: app.student?.cgpa || "",
    collegeEmail: app.student?.collegeEmail || "",
    tenth: app.student?.tenth?.percentage || "",
    twelfth: app.student?.twelfth?.percentage || "",
    activeBacklogs: app.student?.activeBacklogs || 0,
    resumeLink: app.resumeLink || "",
    status: app.status || "",
  }));

  const buffer = generateExcel(rows, selectedCols);
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename=applicants_${roleId}.xlsx`);
  res.send(buffer);
});

// POST /api/v1/company/drives/:driveId/roles/:roleId/results
// Company uploads result → directly published to students (per updated spec)
export const uploadAndPublishResult = catchAsyncErrors(async (req, res, next) => {
  const { driveId, roleId } = req.params;
  const { selectedRollNumbers } = req.body; // array of roll numbers
  const company = await Company.findById(req.user.companyRef);

  const drive = await PlacementDrive.findOne({ _id: driveId, company: company._id });
  if (!drive) return next(new ErrorHandler("Drive not found or access denied.", 404));

  const role = drive.roles.id(roleId);
  if (!role) return next(new ErrorHandler("Role not found.", 404));

  if (!Array.isArray(selectedRollNumbers) || selectedRollNumbers.length === 0)
    return next(new ErrorHandler("Provide at least one selected roll number.", 400));

  // Find selected students
  const selectedStudentDocs = await StudentMaster.find({
    rollNumber: { $in: selectedRollNumbers.map((r) => r.trim().toUpperCase()) },
  });

  const selectedStudentIds = selectedStudentDocs.map((s) => s._id);

  // Fetch all applications for this role
  const allApplications = await Application.find({ driveId, roleId });

  const selectedList = [];
  for (const app of allApplications) {
    const isSelected = selectedStudentIds.some((id) => String(id) === String(app.student));
    app.status = isSelected ? "Selected" : "Rejected";
    await app.save();
    if (isSelected) {
      selectedList.push({ applicationId: app._id, student: app.student });
    }
  }

  // Upsert Result document
  await Result.findOneAndUpdate(
    { driveId, roleId },
    {
      driveId, roleId, company: company._id,
      selectedStudents: selectedList,
      status: "Published",
      uploadedBy: req.user._id,
      publishedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  // Notify selected students
  const selectedUsers = await User.find({ studentRef: { $in: selectedStudentIds } }).select("_id");
  const allStudentUsers = await User.find({
    studentRef: { $in: allApplications.map((a) => a.student) },
  }).select("_id studentRef");

  const selectedUserIds = selectedUsers.map((u) => u._id);
  const rejectedUserIds = allStudentUsers
    .filter((u) => !selectedStudentIds.some((id) => String(id) === String(u.studentRef)))
    .map((u) => u._id);

  const companyName = drive.company?.name || company.name;
  const roleName = role.title;

  if (selectedUserIds.length > 0) {
    await bulkCreateNotifications(selectedUserIds, {
      type: "ResultPublished",
      title: `🎉 Congratulations! Selected at ${companyName}`,
      message: `You have been selected for the role of ${roleName} at ${companyName}. Check your applications for details.`,
      link: "/applications",
      metadata: { driveId, roleId, companyName, roleName },
    });
  }

  if (rejectedUserIds.length > 0) {
    await bulkCreateNotifications(rejectedUserIds, {
      type: "ResultPublished",
      title: `Result Declared — ${companyName} (${roleName})`,
      message: `The result for ${roleName} at ${companyName} has been declared. Unfortunately, you were not selected this time. Keep applying!`,
      link: "/applications",
      metadata: { driveId, roleId, companyName, roleName },
    });
  }

  res.status(200).json({
    success: true,
    message: `Results published. ${selectedList.length} student(s) selected. Students have been notified.`,
    data: { selected: selectedList.length, total: allApplications.length },
  });
});

// GET /api/v1/company/profile
export const getCompanyProfile = catchAsyncErrors(async (req, res, next) => {
  const company = await Company.findById(req.user.companyRef);
  if (!company) return next(new ErrorHandler("Company profile not found.", 404));
  res.status(200).json({ success: true, data: company });
});

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/User.js";
import { StudentMaster } from "../models/StudentMaster.js";
import { Company } from "../models/Company.js";
import { PlacementDrive } from "../models/PlacementDrive.js";
import { Application } from "../models/Application.js";
import { Result } from "../models/Result.js";
import { parseStudentExcel, generateExcel } from "../services/excelService.js";
import { bulkCreateNotifications } from "../services/notificationService.js";
import fs from "fs";

// ── EXCEL IMPORT ─────────────────────────────────────────────────────────────
// POST /api/v1/tpo/excel/import
export const importStudentExcel = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || !req.files.excel)
    return next(new ErrorHandler("Please upload an Excel file.", 400));

  const file = req.files.excel;
  const allowed = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];
  if (!allowed.includes(file.mimetype))
    return next(new ErrorHandler("Only Excel files (.xlsx, .xls) are allowed.", 400));

  const { students, errors } = parseStudentExcel(file.tempFilePath);
  if (fs.existsSync(file.tempFilePath)) fs.unlinkSync(file.tempFilePath);

  let imported = 0, updated = 0;

  for (const s of students) {
    const existing = await StudentMaster.findOne({ rollNumber: s.rollNumber });
    if (existing) {
      // Update academic fields only — preserve userId, isRegistered, applicationUnlocked
      await StudentMaster.findOneAndUpdate(
        { rollNumber: s.rollNumber },
        {
          $set: {
            collegeEmail: s.collegeEmail,
            personalEmail: s.personalEmail,
            fullName: s.fullName,
            branch: s.branch,
            dateOfBirth: s.dateOfBirth,
            gender: s.gender,
            cgpa: s.cgpa,
            contactNumber: s.contactNumber,
            nationality: s.nationality,
            permanentAddress: s.permanentAddress,
            tenth: s.tenth,
            twelfth: s.twelfth,
            activeBacklogs: s.activeBacklogs,
            eligibleForCTC: s.eligibleForCTC,
            isPWD: s.isPWD,
            graduationYear: s.graduationYear,
          },
        },
        { new: true }
      );
      updated++;
    } else {
      await StudentMaster.create(s);
      imported++;
    }
  }

  res.status(200).json({
    success: true,
    message: `Import complete. ${imported} new, ${updated} updated, ${errors.length} skipped.`,
    data: { imported, updated, errors },
  });
});

// ── STUDENT MANAGEMENT ───────────────────────────────────────────────────────
// GET /api/v1/tpo/students
export const getAllStudents = catchAsyncErrors(async (req, res, next) => {
  const { search, branch, registered, page = 1, limit = 50 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const filter = {};
  if (branch) filter.branch = branch;
  if (registered !== undefined) filter.isRegistered = registered === "true";
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { rollNumber: { $regex: search, $options: "i" } },
      { collegeEmail: { $regex: search, $options: "i" } },
    ];
  }
  const [students, total] = await Promise.all([
    StudentMaster.find(filter).skip(skip).limit(parseInt(limit)).sort({ rollNumber: 1 }),
    StudentMaster.countDocuments(filter),
  ]);
  res.status(200).json({ success: true, count: students.length, total, page: parseInt(page), data: students });
});

// GET /api/v1/tpo/students/:rollNumber
export const getStudentByRoll = catchAsyncErrors(async (req, res, next) => {
  const student = await StudentMaster.findOne({ rollNumber: req.params.rollNumber.toUpperCase() });
  if (!student) return next(new ErrorHandler("Student not found.", 404));
  const applications = await Application.find({ student: student._id }).populate("company", "name").populate("driveId", "academicYear roles");
  res.status(200).json({ success: true, data: { student, applications } });
});

// PUT /api/v1/tpo/students/:rollNumber
export const updateStudent = catchAsyncErrors(async (req, res, next) => {
  const allowed = ["cgpa", "branch", "activeBacklogs", "eligibleForCTC", "isPWD", "graduationYear", "tenth", "twelfth", "contactNumber", "permanentAddress", "personalEmail"];
  const updates = {};
  allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

  const student = await StudentMaster.findOneAndUpdate(
    { rollNumber: req.params.rollNumber.toUpperCase() },
    { $set: updates },
    { new: true, runValidators: true }
  );
  if (!student) return next(new ErrorHandler("Student not found.", 404));
  res.status(200).json({ success: true, message: "Student record updated.", data: student });
});

// PUT /api/v1/tpo/students/:rollNumber/unlock-application
// TPO unlocks application portal for a specific student
export const unlockStudentApplication = catchAsyncErrors(async (req, res, next) => {
  const { driveId, roleId } = req.body;
  const student = await StudentMaster.findOne({ rollNumber: req.params.rollNumber.toUpperCase() });
  if (!student) return next(new ErrorHandler("Student not found.", 404));

  if (driveId && roleId) {
    // Unlock a specific application (delete the lock so they can re-apply)
    await Application.findOneAndUpdate(
      { student: student._id, driveId, roleId },
      { isLocked: false }
    );
  } else {
    // General unlock flag
    student.applicationUnlocked = true;
    await student.save();
  }

  res.status(200).json({ success: true, message: "Application portal unlocked for this student." });
});

// ── COMPANY MANAGEMENT ───────────────────────────────────────────────────────
// POST /api/v1/tpo/companies
export const createCompany = catchAsyncErrors(async (req, res, next) => {
  const { name, industry, website, description, hrName, hrEmail, companyEmail, companyPassword } = req.body;
  if (!name || !companyEmail || !companyPassword)
    return next(new ErrorHandler("Company name, email, and password are required!", 400));

  const existingUser = await User.findOne({ email: companyEmail.toLowerCase() });
  if (existingUser) return next(new ErrorHandler("A user with this email already exists.", 409));

  // Create company user account
  const companyUser = await User.create({
    email: companyEmail.toLowerCase(),
    password: companyPassword,
    role: "Company",
  });

  // Create company profile
  const company = await Company.create({
    name, industry, website, description, hrName, hrEmail,
    userId: companyUser._id,
    createdBy: req.user._id,
  });

  // Link back
  companyUser.companyRef = company._id;
  await companyUser.save({ validateBeforeSave: false });

  res.status(201).json({
    success: true,
    message: `Company '${name}' created. Login: ${companyEmail} / ${companyPassword}`,
    data: { company, loginEmail: companyEmail, loginPassword: companyPassword },
  });
});

// GET /api/v1/tpo/companies
export const getAllCompanies = catchAsyncErrors(async (req, res, next) => {
  const companies = await Company.find().sort({ name: 1 });
  res.status(200).json({ success: true, count: companies.length, data: companies });
});

// PUT /api/v1/tpo/companies/:id
export const updateCompany = catchAsyncErrors(async (req, res, next) => {
  const company = await Company.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
  if (!company) return next(new ErrorHandler("Company not found.", 404));
  res.status(200).json({ success: true, message: "Company updated.", data: company });
});

// ── PLACEMENT DRIVE MANAGEMENT ───────────────────────────────────────────────
// POST /api/v1/tpo/drives
export const createDrive = catchAsyncErrors(async (req, res, next) => {
  const { company, academicYear, type, roles } = req.body;
  if (!company || !academicYear)
    return next(new ErrorHandler("Company and academic year are required!", 400));

  const companyDoc = await Company.findById(company);
  if (!companyDoc) return next(new ErrorHandler("Company not found.", 404));

  const drive = await PlacementDrive.create({
    company, academicYear, type: type || "Full-time",
    roles: roles || [],
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, message: "Placement drive created.", data: drive });
});

// GET /api/v1/tpo/drives
export const getAllDrives = catchAsyncErrors(async (req, res, next) => {
  const { company, academicYear, active } = req.query;
  const filter = {};
  if (company) filter.company = company;
  if (academicYear) filter.academicYear = academicYear;
  if (active !== undefined) filter.isActive = active === "true";

  const drives = await PlacementDrive.find(filter)
    .populate("company", "name logo industry")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: drives.length, data: drives });
});

// GET /api/v1/tpo/drives/:id
export const getDriveById = catchAsyncErrors(async (req, res, next) => {
  const drive = await PlacementDrive.findById(req.params.id).populate("company", "name logo hrEmail hrName");
  if (!drive) return next(new ErrorHandler("Drive not found.", 404));
  res.status(200).json({ success: true, data: drive });
});

// PUT /api/v1/tpo/drives/:id
export const updateDrive = catchAsyncErrors(async (req, res, next) => {
  const drive = await PlacementDrive.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
  if (!drive) return next(new ErrorHandler("Drive not found.", 404));
  res.status(200).json({ success: true, message: "Drive updated.", data: drive });
});

// POST /api/v1/tpo/drives/:id/roles — add role to existing drive
export const addRoleToDrive = catchAsyncErrors(async (req, res, next) => {
  const drive = await PlacementDrive.findById(req.params.id);
  if (!drive) return next(new ErrorHandler("Drive not found.", 404));
  drive.roles.push(req.body);
  await drive.save();
  res.status(201).json({ success: true, message: "Role added to drive.", data: drive });
});

// PUT /api/v1/tpo/drives/:driveId/roles/:roleId/status — Open/Close applications
export const updateRoleStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;
  if (!["Open", "Closed", "Draft"].includes(status))
    return next(new ErrorHandler("Status must be Open, Closed, or Draft.", 400));

  const drive = await PlacementDrive.findOneAndUpdate(
    { _id: req.params.driveId, "roles._id": req.params.roleId },
    { $set: { "roles.$.applicationStatus": status } },
    { new: true }
  );
  if (!drive) return next(new ErrorHandler("Drive or role not found.", 404));

  // If opening, notify all eligible students
  if (status === "Open") {
    const role = drive.roles.id(req.params.roleId);
    const allStudentUsers = await User.find({ role: "Student", isActive: true }).select("_id");
    await bulkCreateNotifications(allStudentUsers.map((u) => u._id), {
      type: "DriveOpened",
      title: `New Drive Open: ${role.title}`,
      message: `Applications are now open for ${role.title}. Deadline: ${role.applicationDeadline ? new Date(role.applicationDeadline).toDateString() : "TBD"}.`,
      link: `/drives/${drive._id}`,
      metadata: { driveId: drive._id, roleId: req.params.roleId },
    });
  }

  res.status(200).json({ success: true, message: `Role status set to ${status}.`, data: drive });
});

// ── APPLICATION MANAGEMENT ───────────────────────────────────────────────────
// GET /api/v1/tpo/drives/:driveId/roles/:roleId/applicants
export const getRoleApplicants = catchAsyncErrors(async (req, res, next) => {
  const { driveId, roleId } = req.params;
  const { search, branch, status } = req.query;

  let query = { driveId, roleId };
  if (status) query.status = status;

  const applications = await Application.find(query)
    .populate({ path: "student", select: "fullName rollNumber branch cgpa collegeEmail contactNumber tenth twelfth activeBacklogs isPWD eligibleForCTC" })
    .sort({ submittedAt: -1 });

  let filtered = applications;
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (a) => a.student?.fullName?.toLowerCase().includes(s) || a.student?.rollNumber?.toLowerCase().includes(s)
    );
  }
  if (branch) filtered = filtered.filter((a) => a.student?.branch === branch);

  res.status(200).json({ success: true, count: filtered.length, data: filtered });
});

// PUT /api/v1/tpo/applications/:id — override status
export const updateApplicationStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;
  if (!["Pending", "Shortlisted", "Selected", "Rejected", "OnHold"].includes(status))
    return next(new ErrorHandler("Invalid status value.", 400));

  const application = await Application.findByIdAndUpdate(
    req.params.id,
    { status, updatedBy: req.user._id },
    { new: true }
  );
  if (!application) return next(new ErrorHandler("Application not found.", 404));
  res.status(200).json({ success: true, message: "Application status updated.", data: application });
});

// ── EXPORT ───────────────────────────────────────────────────────────────────
// GET /api/v1/tpo/export
export const exportApplicants = catchAsyncErrors(async (req, res, next) => {
  const { driveId, roleId, branches, columns, status } = req.query;

  let query = {};
  if (driveId) query.driveId = driveId;
  if (roleId) query.roleId = roleId;
  if (status) query.status = status;

  const applications = await Application.find(query).populate(
    "student", "fullName rollNumber branch cgpa collegeEmail personalEmail contactNumber gender tenth twelfth activeBacklogs isPWD eligibleForCTC"
  );

  let filtered = applications;
  if (branches) {
    const branchList = branches.split(",").map((b) => b.trim().toUpperCase());
    filtered = filtered.filter((a) => branchList.includes(a.student?.branch));
  }

  const ALL_COLUMNS = [
    { key: "name", label: "Full Name" },
    { key: "rollNumber", label: "Roll Number" },
    { key: "branch", label: "Branch" },
    { key: "cgpa", label: "CGPA" },
    { key: "collegeEmail", label: "College Email" },
    { key: "personalEmail", label: "Personal Email" },
    { key: "contactNumber", label: "Contact Number" },
    { key: "gender", label: "Gender" },
    { key: "tenth", label: "10th %" },
    { key: "twelfth", label: "12th %" },
    { key: "activeBacklogs", label: "Active Backlogs" },
    { key: "resumeLink", label: "Resume Link" },
    { key: "status", label: "Status" },
    { key: "submittedAt", label: "Applied Date" },
  ];

  const selectedCols = columns
    ? columns.split(",").map((c) => ALL_COLUMNS.find((col) => col.key === c.trim())).filter(Boolean)
    : ALL_COLUMNS;

  const rows = filtered.map((app) => ({
    name: app.student?.fullName || "",
    rollNumber: app.student?.rollNumber || "",
    branch: app.student?.branch || "",
    cgpa: app.student?.cgpa || "",
    collegeEmail: app.student?.collegeEmail || "",
    personalEmail: app.student?.personalEmail || "",
    contactNumber: app.student?.contactNumber || "",
    gender: app.student?.gender || "",
    tenth: app.student?.tenth?.percentage || "",
    twelfth: app.student?.twelfth?.percentage || "",
    activeBacklogs: app.student?.activeBacklogs ?? "",
    resumeLink: app.resumeLink || "",
    status: app.status || "",
    submittedAt: app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : "",
  }));

  const buffer = generateExcel(rows, selectedCols);
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=placement_export.xlsx");
  res.send(buffer);
});

// ── ANALYTICS ────────────────────────────────────────────────────────────────
// GET /api/v1/tpo/analytics
export const getAnalytics = catchAsyncErrors(async (req, res, next) => {
  const [totalStudents, registeredStudents, totalCompanies, totalDrives, totalApplications, totalSelected] =
    await Promise.all([
      StudentMaster.countDocuments(),
      StudentMaster.countDocuments({ isRegistered: true }),
      Company.countDocuments(),
      PlacementDrive.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: "Selected" }),
    ]);

  // Branch-wise placement stats
  const branchStats = await Application.aggregate([
    { $match: { status: "Selected" } },
    { $lookup: { from: "studentmasters", localField: "student", foreignField: "_id", as: "studentData" } },
    { $unwind: "$studentData" },
    { $group: { _id: "$studentData.branch", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Top companies by placements
  const companyStats = await Application.aggregate([
    { $match: { status: "Selected" } },
    { $group: { _id: "$company", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $lookup: { from: "companies", localField: "_id", foreignField: "_id", as: "companyData" } },
    { $unwind: "$companyData" },
    { $project: { companyName: "$companyData.name", count: 1 } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: { totalStudents, registeredStudents, totalCompanies, totalDrives, totalApplications, totalSelected },
      branchStats,
      companyStats,
    },
  });
});

// ── TPO ADMIN MANAGEMENT ─────────────────────────────────────────────────────
// POST /api/v1/tpo/admins
export const createTPOAdmin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new ErrorHandler("Email and Password are required!", 400));

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return next(new ErrorHandler("User with this email already exists.", 409));

  const admin = await User.create({ email: email.toLowerCase(), password, role: "TPO" });
  res.status(201).json({ success: true, message: "TPO Admin created.", data: { email: admin.email, role: admin.role } });
});

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { StudentMaster } from "../models/StudentMaster.js";
import { PlacementDrive } from "../models/PlacementDrive.js";
import { Application } from "../models/Application.js";
import { Notification } from "../models/Notification.js";
import { evaluateEligibility } from "../services/eligibilityEngine.js";

// GET /api/v1/student/dashboard
export const getDashboard = catchAsyncErrors(async (req, res, next) => {
  const student = await StudentMaster.findById(req.user.studentRef);
  if (!student) return next(new ErrorHandler("Student profile not found.", 404));

  const [applied, selected, rejected, shortlisted, unreadNotifs] = await Promise.all([
    Application.countDocuments({ student: student._id }),
    Application.countDocuments({ student: student._id, status: "Selected" }),
    Application.countDocuments({ student: student._id, status: "Rejected" }),
    Application.countDocuments({ student: student._id, status: "Shortlisted" }),
    Notification.countDocuments({ recipient: req.user._id, isRead: false }),
  ]);

  const upcomingDrives = await PlacementDrive.find({
    isActive: true,
    "roles.applicationStatus": "Open",
  })
    .populate("company", "name logo industry")
    .limit(5)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: { stats: { applied, selected, rejected, shortlisted, unreadNotifs }, upcomingDrives, student },
  });
});

// GET /api/v1/student/drives
export const getAllDrives = catchAsyncErrors(async (req, res, next) => {
  const student = await StudentMaster.findById(req.user.studentRef);
  if (!student) return next(new ErrorHandler("Student profile not found.", 404));

  const drives = await PlacementDrive.find({ isActive: true }).populate(
    "company", "name logo industry website"
  );

  const studentApps = await Application.find({ student: student._id }).select("driveId roleId status");
  const appliedMap = {};
  studentApps.forEach((a) => { appliedMap[`${a.driveId}_${a.roleId}`] = a.status; });

  const result = drives.map((drive) => {
    const openRoles = drive.roles
      .filter((r) => r.applicationStatus === "Open")
      .map((role) => ({
        ...role.toObject(),
        eligibility: evaluateEligibility(student, role.eligibilityCriteria),
        applied: !!appliedMap[`${drive._id}_${role._id}`],
        appliedStatus: appliedMap[`${drive._id}_${role._id}`] || null,
      }));
    return { ...drive.toObject(), roles: openRoles };
  }).filter((d) => d.roles.length > 0);

  res.status(200).json({ success: true, count: result.length, data: result });
});

// GET /api/v1/student/drives/:driveId
export const getDriveDetail = catchAsyncErrors(async (req, res, next) => {
  const student = await StudentMaster.findById(req.user.studentRef);
  const drive = await PlacementDrive.findById(req.params.driveId).populate(
    "company", "name logo industry website description hrName hrEmail"
  );
  if (!drive) return next(new ErrorHandler("Drive not found.", 404));

  const studentApps = await Application.find({ student: student._id, driveId: drive._id }).select("roleId status");
  const appliedMap = {};
  studentApps.forEach((a) => { appliedMap[String(a.roleId)] = a.status; });

  const rolesWithEligibility = drive.roles.map((role) => ({
    ...role.toObject(),
    eligibility: evaluateEligibility(student, role.eligibilityCriteria),
    applied: !!appliedMap[String(role._id)],
    appliedStatus: appliedMap[String(role._id)] || null,
  }));

  res.status(200).json({ success: true, data: { ...drive.toObject(), roles: rolesWithEligibility } });
});

// POST /api/v1/student/apply
export const applyToDrive = catchAsyncErrors(async (req, res, next) => {
  const { driveId, roleId, resumeLink } = req.body;
  if (!driveId || !roleId || !resumeLink)
    return next(new ErrorHandler("Drive ID, Role ID, and Resume Google Drive Link are required!", 400));

  // Validate Google Drive link format
  if (!resumeLink.startsWith("http"))
    return next(new ErrorHandler("Provide a valid Google Drive link for your resume.", 400));

  const student = await StudentMaster.findById(req.user.studentRef);
  if (!student) return next(new ErrorHandler("Student profile not found.", 404));

  // Duplicate check
  const existing = await Application.findOne({ student: student._id, driveId, roleId });
  if (existing) {
    if (existing.isLocked)
      return next(new ErrorHandler("You have already applied for this role. Contact TPO to reopen.", 409));
    // If TPO unlocked, allow re-application by deleting old and creating new
    await existing.deleteOne();
  }

  const drive = await PlacementDrive.findById(driveId).populate("company", "name");
  if (!drive || !drive.isActive)
    return next(new ErrorHandler("Placement drive not found or inactive.", 404));

  const role = drive.roles.id(roleId);
  if (!role) return next(new ErrorHandler("Role not found in this drive.", 404));
  if (role.applicationStatus !== "Open")
    return next(new ErrorHandler("Applications for this role are currently closed.", 400));
  if (role.applicationDeadline && new Date() > new Date(role.applicationDeadline))
    return next(new ErrorHandler("Application deadline has passed.", 400));

  const eligibility = evaluateEligibility(student, role.eligibilityCriteria);
  if (!eligibility.isEligible) {
    const reasons = eligibility.ruleResults.filter((r) => !r.passed).map((r) => r.reason).join("; ");
    return next(new ErrorHandler(`Not eligible: ${reasons}`, 403));
  }

  const application = await Application.create({
    student: student._id,
    driveId,
    roleId,
    company: drive.company._id,
    resumeLink,
    eligibilitySnapshot: { ...eligibility },
    isLocked: true,
  });

  // Increment applicant count
  await PlacementDrive.findOneAndUpdate(
    { _id: driveId, "roles._id": roleId },
    { $inc: { "roles.$.totalApplicants": 1 } }
  );

  res.status(201).json({ success: true, message: "Application submitted successfully!", data: application });
});

// GET /api/v1/student/applications
export const getMyApplications = catchAsyncErrors(async (req, res, next) => {
  const student = await StudentMaster.findById(req.user.studentRef);
  const applications = await Application.find({ student: student._id })
    .populate("company", "name logo")
    .populate("driveId", "academicYear type roles")
    .sort({ submittedAt: -1 });

  res.status(200).json({ success: true, count: applications.length, data: applications });
});

// GET /api/v1/student/applications/:id
export const getApplicationDetail = catchAsyncErrors(async (req, res, next) => {
  const student = await StudentMaster.findById(req.user.studentRef);
  const application = await Application.findOne({ _id: req.params.id, student: student._id })
    .populate("company", "name logo")
    .populate("driveId", "academicYear type roles");
  if (!application) return next(new ErrorHandler("Application not found.", 404));
  res.status(200).json({ success: true, data: application });
});

// GET /api/v1/student/profile
export const getProfile = catchAsyncErrors(async (req, res, next) => {
  const student = await StudentMaster.findById(req.user.studentRef);
  if (!student) return next(new ErrorHandler("Profile not found.", 404));
  res.status(200).json({ success: true, data: student });
});

// GET /api/v1/student/notifications
export const getNotifications = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const [notifications, total, unread] = await Promise.all([
    Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments({ recipient: req.user._id }),
    Notification.countDocuments({ recipient: req.user._id, isRead: false }),
  ]);
  res.status(200).json({ success: true, data: notifications, total, unread, page, pages: Math.ceil(total / limit) });
});

// PUT /api/v1/student/notifications/:id/read
export const markNotificationRead = catchAsyncErrors(async (req, res, next) => {
  await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user._id }, { isRead: true });
  res.status(200).json({ success: true, message: "Marked as read." });
});

// PUT /api/v1/student/notifications/read-all
export const markAllRead = catchAsyncErrors(async (req, res, next) => {
  await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
  res.status(200).json({ success: true, message: "All notifications marked as read." });
});

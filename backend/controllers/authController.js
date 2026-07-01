import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/User.js";
import { StudentMaster } from "../models/StudentMaster.js";
import { Company } from "../models/Company.js";
import { generateToken } from "../utils/jwtToken.js";

const COOKIE_MAP = { Student: "studentToken", Company: "companyToken", TPO: "tpoToken" };

// POST /api/v1/auth/student/register
export const studentRegister = catchAsyncErrors(async (req, res, next) => {
  const { rollNumber, collegeEmail, password } = req.body;
  if (!rollNumber || !collegeEmail || !password)
    return next(new ErrorHandler("Roll Number, College Email, and Password are required!", 400));

  const master = await StudentMaster.findOne({
    rollNumber: rollNumber.trim().toUpperCase(),
    collegeEmail: collegeEmail.trim().toLowerCase(),
  });
  if (!master)
    return next(new ErrorHandler("You are not in the eligible student database. Contact TPO.", 400));
  if (master.isRegistered)
    return next(new ErrorHandler("Account already exists with this Roll Number. Please login.", 409));

  const user = await User.create({
    email: collegeEmail.trim().toLowerCase(),
    password,
    role: "Student",
    studentRef: master._id,
  });

  master.userId = user._id;
  master.isRegistered = true;
  await master.save();

  generateToken(user, "Registration successful! Welcome to NIT Delhi Placement Portal.", 201, res);
});

// POST /api/v1/auth/login
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role)
    return next(new ErrorHandler("Email, Password, and Role are required!", 400));

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid email or password!", 401));

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new ErrorHandler("Invalid email or password!", 401));

  if (user.role !== role)
    return next(new ErrorHandler(`No ${role} account found with this email.`, 403));
  if (!user.isActive)
    return next(new ErrorHandler("Account is deactivated. Contact TPO.", 403));

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  generateToken(user, "Login successful!", 200, res);
});

// POST /api/v1/auth/logout
export const logout = catchAsyncErrors(async (req, res, next) => {
  const cookieName = COOKIE_MAP[req.user.role];
  res
    .status(200)
    .cookie(cookieName, "", { httpOnly: true, expires: new Date(Date.now()) })
    .json({ success: true, message: "Logged out successfully." });
});

// GET /api/v1/auth/me
export const getMe = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  let profile = null;
  if (user.role === "Student") profile = await StudentMaster.findById(user.studentRef);
  else if (user.role === "Company") profile = await Company.findById(user.companyRef);
  res.status(200).json({ success: true, user, profile });
});

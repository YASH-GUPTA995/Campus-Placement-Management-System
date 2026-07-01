import { User } from "../models/User.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

const COOKIE_MAP = {
  Student: "studentToken",
  Company: "companyToken",
  TPO: "tpoToken",
};

export const isAuthenticated = (...allowedRoles) =>
  catchAsyncErrors(async (req, res, next) => {
    let token;
    for (const role of allowedRoles) {
      if (req.cookies[COOKIE_MAP[role]]) {
        token = req.cookies[COOKIE_MAP[role]];
        break;
      }
    }

    if (!token) {
      return next(new ErrorHandler("Please login to access this resource.", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) return next(new ErrorHandler("User not found.", 401));
    if (!user.isActive)
      return next(new ErrorHandler("Account is deactivated. Contact TPO.", 403));
    if (!allowedRoles.includes(user.role)) {
      return next(
        new ErrorHandler(`Role '${user.role}' is not allowed here.`, 403)
      );
    }

    req.user = user;
    next();
  });

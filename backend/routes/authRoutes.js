import express from "express";
import { studentRegister, login, logout, getMe } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/student/register", studentRegister);
router.post("/login", login);
router.post("/logout", isAuthenticated("Student", "Company", "TPO"), logout);
router.get("/me", isAuthenticated("Student", "Company", "TPO"), getMe);

export default router;

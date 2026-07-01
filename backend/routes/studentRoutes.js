import express from "express";
import {
  getDashboard, getAllDrives, getDriveDetail, applyToDrive,
  getMyApplications, getApplicationDetail, getProfile,
  getNotifications, markNotificationRead, markAllRead,
} from "../controllers/studentController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();
const auth = isAuthenticated("Student");

router.get("/dashboard", auth, getDashboard);
router.get("/drives", auth, getAllDrives);
router.get("/drives/:driveId", auth, getDriveDetail);
router.post("/apply", auth, applyToDrive);
router.get("/applications", auth, getMyApplications);
router.get("/applications/:id", auth, getApplicationDetail);
router.get("/profile", auth, getProfile);
router.get("/notifications", auth, getNotifications);
router.put("/notifications/read-all", auth, markAllRead);
router.put("/notifications/:id/read", auth, markNotificationRead);

export default router;

import express from "express";
import {
  getDashboard, getMyDrives, getRoleApplicants,
  exportApplicantsExcel, uploadAndPublishResult, getCompanyProfile,
} from "../controllers/companyController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();
const auth = isAuthenticated("Company");

router.get("/dashboard", auth, getDashboard);
router.get("/profile", auth, getCompanyProfile);
router.get("/drives", auth, getMyDrives);
router.get("/drives/:driveId/roles/:roleId/applicants", auth, getRoleApplicants);
router.get("/drives/:driveId/roles/:roleId/export", auth, exportApplicantsExcel);
router.post("/drives/:driveId/roles/:roleId/results", auth, uploadAndPublishResult);

export default router;

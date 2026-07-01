import express from "express";
import {
  importStudentExcel, getAllStudents, getStudentByRoll, updateStudent, unlockStudentApplication,
  createCompany, getAllCompanies, updateCompany,
  createDrive, getAllDrives, getDriveById, updateDrive, addRoleToDrive, updateRoleStatus,
  getRoleApplicants, updateApplicationStatus,
  exportApplicants, getAnalytics, createTPOAdmin,
} from "../controllers/tpoController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();
const auth = isAuthenticated("TPO");

// Excel import
router.post("/excel/import", auth, importStudentExcel);

// Students
router.get("/students", auth, getAllStudents);
router.get("/students/:rollNumber", auth, getStudentByRoll);
router.put("/students/:rollNumber", auth, updateStudent);
router.put("/students/:rollNumber/unlock-application", auth, unlockStudentApplication);

// Companies
router.post("/companies", auth, createCompany);
router.get("/companies", auth, getAllCompanies);
router.put("/companies/:id", auth, updateCompany);

// Drives
router.post("/drives", auth, createDrive);
router.get("/drives", auth, getAllDrives);
router.get("/drives/:id", auth, getDriveById);
router.put("/drives/:id", auth, updateDrive);
router.post("/drives/:id/roles", auth, addRoleToDrive);
router.put("/drives/:driveId/roles/:roleId/status", auth, updateRoleStatus);

// Applications
router.get("/drives/:driveId/roles/:roleId/applicants", auth, getRoleApplicants);
router.put("/applications/:id", auth, updateApplicationStatus);

// Export
router.get("/export", auth, exportApplicants);

// Analytics
router.get("/analytics", auth, getAnalytics);

// TPO Admins
router.post("/admins", auth, createTPOAdmin);

export default router;

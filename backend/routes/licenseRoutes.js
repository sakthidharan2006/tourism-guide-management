import express from "express";

import {
  applyLicense,
  getApplications,
  getMyApplications,
  getLicenseById,
  getApplicationStats,
  approveApplication,
  rejectApplication,
} from "../controllers/licenseController.js";

const router = express.Router();

// ========================================
// LICENSE APPLICATION
// ========================================

// Submit new license application
router.post("/apply", applyLicense);

// ========================================
// ADMIN APPLICATION MANAGEMENT
// ========================================

// Get all applications
router.get("/applications", getApplications);

// Get application statistics
router.get("/stats", getApplicationStats);

// ========================================
// USER APPLICATIONS
// ========================================

// Get applications by applicant email
router.get("/my-applications/:email", getMyApplications);

// ========================================
// SINGLE APPLICATION
// ========================================

// Get single application
router.get("/:id", getLicenseById);

// ========================================
// ADMIN ACTIONS
// ========================================

// Approve application
router.put("/approve/:id", approveApplication);

// Reject application
router.put("/reject/:id", rejectApplication);

export default router;
import express from "express";

import {
  submitComplaint,
  getComplaints,
  getMyComplaints,
  updateComplaintStatus,
  complaintStats,
} from "../controllers/complaintController.js";

const router = express.Router();


// Submit complaint
router.post(
  "/submit",
  submitComplaint
);


// Get all complaints - Admin
router.get(
  "/all",
  getComplaints
);


// Get complaints of logged-in user
router.get(
  "/my-complaints/:email",
  getMyComplaints
);


// Get complaint statistics - Admin
router.get(
  "/stats",
  complaintStats
);


// Update complaint status - Admin
router.put(
  "/update-status/:id",
  updateComplaintStatus
);

export default router;
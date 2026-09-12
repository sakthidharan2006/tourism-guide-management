import express from "express";

import {
  submitRenewal,
  getRenewals,
  getMyRenewals,
  approveRenewal,
  rejectRenewal,
} from "../controllers/renewalController.js";

const router = express.Router();

router.post("/apply", submitRenewal);

router.get("/all", getRenewals);

router.get("/my-renewals/:email",getMyRenewals);

router.put("/approve/:id",approveRenewal);

router.put("/reject/:id",rejectRenewal);

export default router;
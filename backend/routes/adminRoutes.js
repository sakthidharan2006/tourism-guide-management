import express from "express";

import {
  applyRenewal,
  getRenewals,
} from "../controllers/renewalController.js";

const router = express.Router();

router.post("/apply", applyRenewal);

router.get("/all", getRenewals);

export default router;
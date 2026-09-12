import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword
} from "../controllers/authController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", auth, getProfile);

router.put("/profile/:id", updateProfile);

router.put("/change-password/:id", changePassword);

export default router;
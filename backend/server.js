import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import licenseRoutes from "./routes/licenseRoutes.js";
import renewalRoutes from "./routes/renewalRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Tourism Guide Management Portal Backend is Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/license", licenseRoutes);
app.use("/api/renewal", renewalRoutes);
app.use("/api/complaint", complaintRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
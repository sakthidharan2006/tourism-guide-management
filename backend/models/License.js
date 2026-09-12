import mongoose from "mongoose";

const licenseSchema = new mongoose.Schema(
  {
    // ========================================
    // APPLICANT DETAILS
    // ========================================

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    aadhaar: {
      type: String,
      required: true,
      trim: true,
    },

    qualification: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    touristRegion: {
      type: String,
      required: true,
      trim: true,
    },

    // ========================================
    // APPLICATION STATUS
    // ========================================

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    // ========================================
    // LICENSE DETAILS
    // ========================================

    licenseId: {
      type: String,
      default: "",
      trim: true,
    },

    // ========================================
    // ADMIN REMARK
    // ========================================

    adminRemark: {
      type: String,
      default: "",
      trim: true,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("License", licenseSchema);
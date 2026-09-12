import mongoose from "mongoose";

const renewalSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    licenseId: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    currentRegion: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      default: "License Renewal",
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    adminRemark: {
      type: String,
      default: "",
    },

    renewalDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Renewal", renewalSchema);
import Renewal from "../models/Renewal.js";
import License from "../models/License.js";

// ============================
// SUBMIT RENEWAL
// ============================

export const submitRenewal = async (req, res) => {
  try {
    const {
      fullName,
      email,
      licenseId,
      phone,
      currentRegion,
      reason,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !licenseId ||
      !phone ||
      !currentRegion
    ) {
      return res.status(400).json({
        message: "Please provide all required details.",
      });
    }

    // Check existing approved license

    const license = await License.findOne({
      licenseId,
      email,
      status: "Approved",
    });

    if (!license) {
      return res.status(404).json({
        message:
          "Approved license not found for the provided License ID and email.",
      });
    }

    // Check whether renewal is already pending

    const existingRenewal = await Renewal.findOne({
      licenseId,
      email,
      status: "Pending",
    });

    if (existingRenewal) {
      return res.status(400).json({
        message:
          "A renewal request for this license is already pending.",
      });
    }

    const renewal = new Renewal({
      fullName,
      email,
      licenseId,
      phone,
      currentRegion,
      reason: reason || "License Renewal",
    });

    await renewal.save();

    res.status(201).json({
      message: "License renewal request submitted successfully.",
      renewal,
    });

  } catch (error) {
    console.error("Submit renewal error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ============================
// GET ALL RENEWALS
// ============================

export const getRenewals = async (req, res) => {
  try {
    const renewals = await Renewal.find().sort({
      createdAt: -1,
    });

    res.status(200).json(renewals);

  } catch (error) {
    console.error("Get renewals error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ============================
// GET MY RENEWALS
// ============================

export const getMyRenewals = async (req, res) => {
  try {
    const { email } = req.params;

    const renewals = await Renewal.find({
      email,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(renewals);

  } catch (error) {
    console.error("Get my renewals error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ============================
// APPROVE RENEWAL
// ============================

export const approveRenewal = async (req, res) => {
  try {
    const renewal = await Renewal.findById(
      req.params.id
    );

    if (!renewal) {
      return res.status(404).json({
        message: "Renewal request not found.",
      });
    }

    renewal.status = "Approved";
    renewal.renewalDate = new Date();
    renewal.adminRemark =
      "License renewal approved successfully.";

    await renewal.save();

    res.status(200).json({
      message: "Renewal approved successfully.",
      renewal,
    });

  } catch (error) {
    console.error("Approve renewal error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ============================
// REJECT RENEWAL
// ============================

export const rejectRenewal = async (req, res) => {
  try {
    const renewal = await Renewal.findByIdAndUpdate(
      req.params.id,
      {
        status: "Rejected",
        adminRemark:
          req.body.adminRemark ||
          "Renewal request rejected by administrator.",
      },
      {
        new: true,
      }
    );

    if (!renewal) {
      return res.status(404).json({
        message: "Renewal request not found.",
      });
    }

    res.status(200).json({
      message: "Renewal rejected successfully.",
      renewal,
    });

  } catch (error) {
    console.error("Reject renewal error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
import License from "../models/License.js";

// ========================================
// APPLY LICENSE
// ========================================

export const applyLicense = async (req, res) => {
  try {
    const license = new License(req.body);

    await license.save();

    res.status(201).json({
      message: "License Application Submitted Successfully",
      license,
    });
  } catch (error) {
    console.error("Apply License Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ========================================
// GET ALL APPLICATIONS
// ========================================

export const getApplications = async (req, res) => {
  try {
    const applications = await License.find()
      .sort({ createdAt: -1 });

    res.status(200).json(applications);

  } catch (error) {
    console.error("Get Applications Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ========================================
// GET APPLICATIONS BY EMAIL
// ========================================

export const getMyApplications = async (req, res) => {
  try {
    const { email } = req.params;

    const applications = await License.find({
      email,
    }).sort({ createdAt: -1 });

    res.status(200).json(applications);

  } catch (error) {
    console.error("Get My Applications Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ========================================
// GET SINGLE APPLICATION
// ========================================

export const getLicenseById = async (req, res) => {
  try {
    const license = await License.findById(req.params.id);

    if (!license) {
      return res.status(404).json({
        message: "License application not found",
      });
    }

    res.status(200).json(license);

  } catch (error) {
    console.error("Get License Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ========================================
// GET APPLICATION STATISTICS
// ========================================

export const getApplicationStats = async (req, res) => {
  try {
    const total = await License.countDocuments();

    const pending = await License.countDocuments({
      status: "Pending",
    });

    const approved = await License.countDocuments({
      status: "Approved",
    });

    const rejected = await License.countDocuments({
      status: "Rejected",
    });

    res.status(200).json({
      total,
      pending,
      approved,
      rejected,
    });

  } catch (error) {
    console.error("Get Application Stats Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ========================================
// APPROVE APPLICATION
// ========================================

export const approveApplication = async (req, res) => {
  try {
    const application = await License.findById(
      req.params.id
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    application.status = "Approved";

    // Generate License ID only once
    if (!application.licenseId) {
      application.licenseId =
        "TG-" +
        new Date().getFullYear() +
        "-" +
        Math.floor(
          1000 + Math.random() * 9000
        );
    }

    // Clear previous rejection remark
    application.adminRemark = "";

    await application.save();

    res.status(200).json({
      message: "Application Approved Successfully",
      application,
    });

  } catch (error) {
    console.error("Approve Application Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ========================================
// REJECT APPLICATION
// ========================================

export const rejectApplication = async (req, res) => {
  try {
    const { adminRemark } = req.body;

    const application = await License.findById(
      req.params.id
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    application.status = "Rejected";

    application.adminRemark =
      adminRemark || "Application rejected by administrator.";

    await application.save();

    res.status(200).json({
      message: "Application Rejected Successfully",
      application,
    });

  } catch (error) {
    console.error("Reject Application Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
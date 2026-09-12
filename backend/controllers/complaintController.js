import Complaint from "../models/Complaint.js";

// ============================
// SUBMIT COMPLAINT
// ============================

export const submitComplaint = async (req, res) => {
  try {
    const {
      fullName,
      email,
      licenseId,
      subject,
      description,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !licenseId ||
      !subject ||
      !description
    ) {
      return res.status(400).json({
        message: "Please provide all required details.",
      });
    }

    const complaint = new Complaint({
      fullName,
      email,
      licenseId,
      subject,
      description,
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint Submitted Successfully",
      complaint,
    });
  } catch (error) {
    console.error("Submit complaint error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ============================
// GET ALL COMPLAINTS
// ============================

export const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({
      createdAt: -1,
    });

    res.status(200).json(complaints);
  } catch (error) {
    console.error("Get complaints error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ============================
// GET MY COMPLAINTS
// ============================

export const getMyComplaints = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const complaints = await Complaint.find({
      email,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(complaints);
  } catch (error) {
    console.error("Get my complaints error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ============================
// UPDATE COMPLAINT STATUS
// ============================

export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemark } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Complaint status is required.",
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      {
        status,
        adminRemark:
          adminRemark || "",
      },
      {
        new: true,
      }
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found.",
      });
    }

    res.status(200).json({
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    console.error("Update complaint error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ============================
// COMPLAINT STATISTICS
// ============================

export const complaintStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();

    const pending = await Complaint.countDocuments({
      status: "Pending",
    });

    const progress = await Complaint.countDocuments({
      status: "In Progress",
    });

    const resolved = await Complaint.countDocuments({
      status: "Resolved",
    });

    res.status(200).json({
      total,
      pending,
      progress,
      resolved,
    });
  } catch (error) {
    console.error(
      "Complaint statistics error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};
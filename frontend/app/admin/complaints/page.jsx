"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaExclamationCircle,
  FaClock,
  FaCheckCircle,
  FaTasks,
  FaSearch,
  FaEye,
  FaTimes,
} from "react-icons/fa";

const API_URL = "http://127.0.0.1:5000/api";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    resolved: 0,
  });

  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      fetchComplaints(),
      fetchStats(),
    ]);

    setLoading(false);
  };

  // =========================
  // GET ALL COMPLAINTS
  // =========================
  const fetchComplaints = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/complaint/all`
      );

      setComplaints(response.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  // =========================
  // GET STATISTICS
  // =========================
  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/complaint/stats`
      );

      setStats(response.data);
    } catch (error) {
      console.error("Error fetching complaint statistics:", error);
    }
  };

  // =========================
  // UPDATE STATUS
  // =========================
 const updateComplaint = async (id, status) => {
  try {
    const adminRemark =
      status === "In Progress"
        ? "Complaint is currently being reviewed by the administrator."
        : "Complaint has been resolved successfully.";

    console.log("Updating complaint:", {
      id,
      status,
      adminRemark,
    });

    const response = await axios.put(
  `${API_URL}/complaint/update-status/${id}`,
  {
    status,
    adminRemark,
  }
);

    console.log(
      "Complaint update response:",
      response.data
    );

    alert(
      response.data?.message ||
        "Complaint status updated successfully."
    );

    await loadData();

    if (selectedComplaint?._id === id) {
      setSelectedComplaint(null);
    }
  } catch (error) {
    console.error(
      "Update complaint error:",
      error.response?.data || error
    );

    alert(
      error.response?.data?.message ||
        "Failed to update complaint."
    );
  }
};

  // =========================
  // SEARCH
  // =========================
  const filteredComplaints = complaints.filter((item) => {
    const searchText = search.toLowerCase();

    return (
      item.fullName?.toLowerCase().includes(searchText) ||
      item.email?.toLowerCase().includes(searchText) ||
      item.licenseId?.toLowerCase().includes(searchText) ||
      item.subject?.toLowerCase().includes(searchText) ||
      item.status?.toLowerCase().includes(searchText)
    );
  });

  // =========================
  // STATUS BADGE
  // =========================
  const statusBadge = (status) => {
    if (status === "Resolved") {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
          <FaCheckCircle />
          Resolved
        </span>
      );
    }

    if (status === "In Progress") {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">
          <FaTasks />
          In Progress
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
        <FaClock />
        Pending
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">

      {/* ================= HEADER ================= */}
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-2xl shadow-sm">
              <FaExclamationCircle />
            </div>

            <div>
              <p className="text-sm font-semibold text-teal-700 uppercase tracking-wider">
                Administration
              </p>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Complaint Management
              </h1>

              <p className="text-slate-500 mt-1">
                Review, manage and resolve tourism guide complaints.
              </p>
            </div>

          </div>

        </div>

        {/* ================= STATISTICS ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {/* Total */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Complaints
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  {stats.total}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <FaExclamationCircle />
              </div>

            </div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pending
                </p>

                <h2 className="text-3xl font-bold text-yellow-600 mt-2">
                  {stats.pending}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center">
                <FaClock />
              </div>

            </div>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  In Progress
                </p>

                <h2 className="text-3xl font-bold text-orange-600 mt-2">
                  {stats.progress}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <FaTasks />
              </div>

            </div>
          </div>

          {/* Resolved */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Resolved
                </p>

                <h2 className="text-3xl font-bold text-emerald-600 mt-2">
                  {stats.resolved}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <FaCheckCircle />
              </div>

            </div>
          </div>

        </div>

        {/* ================= TABLE CARD ================= */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

          {/* Search Header */}

          <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Complaint Requests
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Manage submitted complaints.
              </p>
            </div>

            <div className="relative w-full md:w-80">

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search complaints..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
              />

            </div>

          </div>

          {/* ================= TABLE ================= */}

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-slate-50 border-b border-slate-200">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                    Applicant
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                    License ID
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                    Subject
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {loading ? (

                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      Loading complaints...
                    </td>
                  </tr>

                ) : filteredComplaints.length === 0 ? (

                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center"
                    >
                      <FaExclamationCircle className="mx-auto text-4xl text-slate-300 mb-3" />

                      <p className="text-slate-600 font-semibold">
                        No complaints found
                      </p>

                      <p className="text-slate-400 text-sm mt-1">
                        Submitted complaints will appear here.
                      </p>
                    </td>
                  </tr>

                ) : (

                  filteredComplaints.map((item) => (

                    <tr
                      key={item._id}
                      className="hover:bg-slate-50 transition"
                    >

                      {/* Applicant */}

                      <td className="px-6 py-5">

                        <p className="font-semibold text-slate-900">
                          {item.fullName}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          {item.email}
                        </p>

                      </td>

                      {/* License */}

                      <td className="px-6 py-5">

                        <span className="font-semibold text-slate-700">
                          {item.licenseId}
                        </span>

                      </td>

                      {/* Subject */}

                      <td className="px-6 py-5 max-w-xs">

                        <p className="font-medium text-slate-800 truncate">
                          {item.subject}
                        </p>

                        <p className="text-sm text-slate-500 truncate mt-1">
                          {item.description}
                        </p>

                      </td>

                      {/* Status */}

                      <td className="px-6 py-5">
                        {statusBadge(item.status)}
                      </td>

                      {/* Action */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2">

                          <button
                            onClick={() =>
                              setSelectedComplaint(item)
                            }
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition"
                          >
                            <FaEye />
                            View
                          </button>

                          {item.status !== "Resolved" && (
                            <>

                              {item.status === "Pending" && (
                                <button
                                  onClick={() =>
                                    updateComplaint(
                                      item._id,
                                      "In Progress"
                                    )
                                  }
                                  className="px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition"
                                >
                                  Progress
                                </button>
                              )}

                              {item.status === "In Progress" && (
                                <button
                                  onClick={() =>
                                    updateComplaint(
                                      item._id,
                                      "Resolved"
                                    )
                                  }
                                  className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition"
                                >
                                  Resolve
                                </button>
                              )}

                            </>
                          )}

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* ================= VIEW MODAL ================= */}

      {selectedComplaint && (

        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-5">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Complaint Details
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Review submitted complaint information.
                </p>

              </div>

              <button
                onClick={() => setSelectedComplaint(null)}
                className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <FaTimes />
              </button>

            </div>

            {/* Modal Body */}

            <div className="p-6 space-y-5">

              <Detail
                label="Full Name"
                value={selectedComplaint.fullName}
              />

              <Detail
                label="Email"
                value={selectedComplaint.email}
              />

              <Detail
                label="License ID"
                value={selectedComplaint.licenseId}
              />

              <Detail
                label="Subject"
                value={selectedComplaint.subject}
              />

              <div>
                <p className="text-sm font-semibold text-slate-500 mb-2">
                  Description
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 leading-7">
                  {selectedComplaint.description}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500 mb-2">
                  Current Status
                </p>

                {statusBadge(selectedComplaint.status)}
              </div>

              {selectedComplaint.adminRemark && (
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-2">
                    Admin Remark
                  </p>

                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-teal-900">
                    {selectedComplaint.adminRemark}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}

            <div className="px-6 py-5 border-t border-slate-200 flex justify-end gap-3">

              {selectedComplaint.status === "Pending" && (
                <button
                  onClick={() =>
                    updateComplaint(
                      selectedComplaint._id,
                      "In Progress"
                    )
                  }
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                >
                  Mark In Progress
                </button>
              )}

              {selectedComplaint.status === "In Progress" && (
                <button
                  onClick={() =>
                    updateComplaint(
                      selectedComplaint._id,
                      "Resolved"
                    )
                  }
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Mark Resolved
                </button>
              )}

              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

// =========================
// DETAIL COMPONENT
// =========================

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-500 mb-1">
        {label}
      </p>

      <p className="text-slate-900 font-medium">
        {value || "Not provided"}
      </p>
    </div>
  );
}
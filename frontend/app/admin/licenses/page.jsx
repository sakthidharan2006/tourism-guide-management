"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFileAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
} from "react-icons/fa";

export default function AdminLicensesPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://127.0.0.1:5000/api/license/applications"
      );

      setApplications(res.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      alert("Unable to load license applications.");
    } finally {
      setLoading(false);
    }
  };

  const approveApplication = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this application?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);

      const res = await axios.put(
        `http://127.0.0.1:5000/api/license/approve/${id}`
      );

      alert(
        `Application approved successfully!\n\nLicense ID: ${res.data.application.licenseId}`
      );

      setSelectedApplication(null);

      await fetchApplications();
    } catch (error) {
      console.error("Approval error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to approve the application."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const rejectApplication = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this application?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);

      await axios.put(
        `http://127.0.0.1:5000/api/license/reject/${id}`
      );

      alert("Application rejected successfully.");

      setSelectedApplication(null);

      await fetchApplications();
    } catch (error) {
      console.error("Rejection error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to reject the application."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = applications.filter(
    (item) => !item.status || item.status === "Pending"
  ).length;

  const approvedCount = applications.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedCount = applications.filter(
    (item) => item.status === "Rejected"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 md:px-8">

      {/* Header */}
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-900 mb-4"
            >
              <FaArrowLeft />
              Back to Dashboard
            </Link>

            <h1 className="text-4xl font-bold text-slate-900">
              License Applications
            </h1>

            <p className="text-slate-600 mt-2">
              Review and manage Tourism Guide License applications.
            </p>
          </div>

          <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">
              Total Applications
            </p>

            <p className="text-3xl font-bold text-slate-900">
              {applications.length}
            </p>
          </div>

        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <StatCard
            title="Total Applications"
            value={applications.length}
            icon={<FaFileAlt />}
            className="bg-blue-600"
          />

          <StatCard
            title="Pending"
            value={pendingCount}
            icon={<FaClock />}
            className="bg-amber-500"
          />

          <StatCard
            title="Approved"
            value={approvedCount}
            icon={<FaCheckCircle />}
            className="bg-emerald-600"
          />

          <StatCard
            title="Rejected"
            value={rejectedCount}
            icon={<FaTimesCircle />}
            className="bg-red-600"
          />

        </div>

        {/* Applications */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-200">

            <h2 className="text-xl font-bold text-slate-900">
              All Applications
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Review applicant information and update application status.
            </p>

          </div>

          {loading ? (

            <div className="py-20 text-center">

              <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-700 rounded-full animate-spin mx-auto"></div>

              <p className="text-slate-500 mt-4">
                Loading applications...
              </p>

            </div>

          ) : applications.length === 0 ? (

            <div className="py-20 text-center">

              <FaFileAlt className="text-5xl text-slate-300 mx-auto" />

              <h3 className="text-xl font-bold text-slate-700 mt-5">
                No Applications Found
              </h3>

              <p className="text-slate-500 mt-2">
                There are currently no license applications.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-900 text-white">

                  <tr>

                    <th className="px-6 py-4 text-left">
                      Applicant
                    </th>

                    <th className="px-6 py-4 text-left">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left">
                      Region
                    </th>

                    <th className="px-6 py-4 text-left">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left">
                      License ID
                    </th>

                    <th className="px-6 py-4 text-left">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {applications.map((application) => (

                    <tr
                      key={application._id}
                      className="border-b border-slate-200 hover:bg-slate-50 transition"
                    >

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                            <FaUser />
                          </div>

                          <div>

                            <p className="font-semibold text-slate-900">
                              {application.fullName}
                            </p>

                            <p className="text-xs text-slate-500">
                              {application.phone}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {application.email}
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {application.touristRegion || "N/A"}
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge status={application.status} />
                      </td>

                      <td className="px-6 py-5">

                        {application.licenseId ? (

                          <span className="font-semibold text-teal-700">
                            {application.licenseId}
                          </span>

                        ) : (

                          <span className="text-slate-400">
                            Not generated
                          </span>

                        )}

                      </td>

                      <td className="px-6 py-5">

                        <button
                          onClick={() =>
                            setSelectedApplication(application)
                          }
                          className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-700 transition"
                        >
                          View Details
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* Details Modal */}
      {selectedApplication && (

        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-700 to-emerald-600 text-white p-6">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-teal-100 text-sm">
                    Tourism Guide License Application
                  </p>

                  <h2 className="text-3xl font-bold mt-1">
                    {selectedApplication.fullName}
                  </h2>

                </div>

                <button
                  onClick={() => setSelectedApplication(null)}
                  className="w-10 h-10 rounded-full bg-white/20 text-white text-xl hover:bg-white/30"
                >
                  ×
                </button>

              </div>

            </div>

            {/* Modal Body */}
            <div className="p-6">

              <div className="grid md:grid-cols-2 gap-5">

                <InfoItem
                  icon={<FaUser />}
                  label="Full Name"
                  value={selectedApplication.fullName}
                />

                <InfoItem
                  icon={<FaEnvelope />}
                  label="Email"
                  value={selectedApplication.email}
                />

                <InfoItem
                  icon={<FaPhone />}
                  label="Phone"
                  value={selectedApplication.phone}
                />

                <InfoItem
                  icon={<FaGraduationCap />}
                  label="Qualification"
                  value={selectedApplication.qualification}
                />

                <InfoItem
                  icon={<FaBriefcase />}
                  label="Experience"
                  value={
                    selectedApplication.experience
                      ? `${selectedApplication.experience} years`
                      : "N/A"
                  }
                />

                <InfoItem
                  icon={<FaMapMarkerAlt />}
                  label="Tourist Region"
                  value={selectedApplication.touristRegion}
                />

                <InfoItem
                  icon={<FaFileAlt />}
                  label="Application ID"
                  value={selectedApplication._id}
                />

                <InfoItem
                  icon={<FaCheckCircle />}
                  label="License ID"
                  value={
                    selectedApplication.licenseId ||
                    "Not generated yet"
                  }
                />

              </div>

              {/* Address */}
              {selectedApplication.address && (

                <div className="mt-5 bg-slate-50 rounded-xl border border-slate-200 p-5">

                  <p className="text-sm font-medium text-slate-500">
                    Address
                  </p>

                  <p className="text-slate-900 font-semibold mt-1">
                    {selectedApplication.address}
                  </p>

                </div>

              )}

              {/* Current Status */}
              <div className="mt-6">

                <p className="text-sm font-medium text-slate-500 mb-2">
                  Current Status
                </p>

                <StatusBadge status={selectedApplication.status} />

              </div>

              {/* Actions */}
              {(!selectedApplication.status ||
                selectedApplication.status === "Pending") && (

                <div className="mt-8 flex flex-col sm:flex-row gap-4">

                  <button
                    onClick={() =>
                      approveApplication(
                        selectedApplication._id
                      )
                    }
                    disabled={
                      processingId === selectedApplication._id
                    }
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-emerald-700 transition disabled:opacity-50"
                  >

                    <FaCheckCircle />

                    {processingId === selectedApplication._id
                      ? "Processing..."
                      : "Approve Application"}

                  </button>

                  <button
                    onClick={() =>
                      rejectApplication(
                        selectedApplication._id
                      )
                    }
                    disabled={
                      processingId === selectedApplication._id
                    }
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50"
                  >

                    <FaTimesCircle />

                    {processingId === selectedApplication._id
                      ? "Processing..."
                      : "Reject Application"}

                  </button>

                </div>

              )}

              {/* Already processed */}
              {selectedApplication.status === "Approved" && (

                <div className="mt-8 rounded-2xl bg-emerald-50 border border-emerald-200 p-5">

                  <div className="flex items-center gap-3 text-emerald-700">

                    <FaCheckCircle className="text-2xl" />

                    <div>

                      <p className="font-bold">
                        Application Approved
                      </p>

                      <p className="text-sm mt-1">
                        License ID:{" "}
                        <strong>
                          {selectedApplication.licenseId}
                        </strong>
                      </p>

                    </div>

                  </div>

                </div>

              )}

              {selectedApplication.status === "Rejected" && (

                <div className="mt-8 rounded-2xl bg-red-50 border border-red-200 p-5">

                  <div className="flex items-center gap-3 text-red-700">

                    <FaTimesCircle className="text-2xl" />

                    <div>

                      <p className="font-bold">
                        Application Rejected
                      </p>

                      <p className="text-sm mt-1">
                        This application has been rejected.
                      </p>

                    </div>

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

/* =========================
   Statistics Card
========================= */

function StatCard({ title, value, icon, className }) {
  return (
    <div
      className={`${className} text-white rounded-2xl p-6 shadow-lg`}
    >

      <div className="flex items-center justify-between">

        <div>

          <p className="text-white/80 font-medium">
            {title}
          </p>

          <p className="text-3xl font-bold mt-2">
            {value}
          </p>

        </div>

        <div className="text-3xl opacity-90">
          {icon}
        </div>

      </div>

    </div>
  );
}

/* =========================
   Status Badge
========================= */

function StatusBadge({ status }) {

  const currentStatus = status || "Pending";

  if (currentStatus === "Approved") {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm">
        <FaCheckCircle />
        Approved
      </span>
    );
  }

  if (currentStatus === "Rejected") {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-red-700 font-semibold text-sm">
        <FaTimesCircle />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 font-semibold text-sm">
      <FaClock />
      Pending
    </span>
  );
}

/* =========================
   Info Item
========================= */

function InfoItem({ icon, label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">

      <div className="flex items-center gap-2 text-teal-700 mb-1">

        {icon}

        <span className="text-sm font-medium text-slate-500">
          {label}
        </span>

      </div>

      <p className="font-semibold text-slate-900 break-words">
        {value || "Not provided"}
      </p>

    </div>
  );
}
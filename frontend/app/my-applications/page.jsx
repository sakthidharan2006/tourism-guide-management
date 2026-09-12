"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaIdCard,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import API from "../../services/api";

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        toast.error("Please login to view your applications");
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);

      if (!user.email) {
        toast.error("User email not found");
        setLoading(false);
        return;
      }

      const response = await API.get(
        `/license/my-applications/${encodeURIComponent(
          user.email
        )}`
      );

      setApplications(response.data || []);
    } catch (error) {
      console.error("Fetch applications error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load your applications"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "Approved") {
      return (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm">
          <FaCheckCircle />
          Approved
        </span>
      );
    }

    if (status === "Rejected") {
      return (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 font-semibold text-sm">
          <FaTimesCircle />
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-semibold text-sm">
        <FaClock />
        Pending
      </span>
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-600 font-semibold">
            Loading your applications...
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">

      {/* ================= HEADER ================= */}

      <header className="bg-white border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-6 py-7">

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-900 transition"
          >
            <FaArrowLeft />
            Back to Dashboard
          </Link>

          <div className="mt-6">

            <p className="text-sm font-bold text-teal-700 uppercase tracking-wider">
              License Services
            </p>

            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
              My Applications
            </h1>

            <p className="text-slate-500 mt-2">
              View and track all your Tourism Guide License applications.
            </p>

          </div>

        </div>

      </header>

      {/* ================= CONTENT ================= */}

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* SUMMARY */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <SummaryCard
            title="Total Applications"
            value={applications.length}
            icon={<FaFileAlt />}
            bg="bg-blue-100"
            color="text-blue-600"
          />

          <SummaryCard
            title="Pending"
            value={
              applications.filter(
                (item) =>
                  !item.status ||
                  item.status === "Pending"
              ).length
            }
            icon={<FaClock />}
            bg="bg-amber-100"
            color="text-amber-600"
          />

          <SummaryCard
            title="Approved"
            value={
              applications.filter(
                (item) =>
                  item.status === "Approved"
              ).length
            }
            icon={<FaCheckCircle />}
            bg="bg-emerald-100"
            color="text-emerald-600"
          />

        </div>

        {/* ================= EMPTY STATE ================= */}

        {applications.length === 0 ? (

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">

            <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-2xl mx-auto">
              <FaFileAlt />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-5">
              No Applications Yet
            </h2>

            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              You have not submitted any Tourism Guide License applications yet.
            </p>

            <Link
              href="/apply-license"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white rounded-xl font-semibold transition"
            >
              <FaFileAlt />
              Apply for License
            </Link>

          </div>

        ) : (

          /* ================= APPLICATION LIST ================= */

          <div className="space-y-6">

            {applications.map((application) => (

              <div
                key={application._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >

                {/* CARD HEADER */}

                <div className="bg-gradient-to-r from-teal-700 to-emerald-600 px-6 py-5">

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                      <p className="text-teal-100 text-sm">
                        Tourism Guide License Application
                      </p>

                      <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                        {application.fullName}
                      </h2>

                    </div>

                    {getStatusBadge(application.status)}

                  </div>

                </div>

                {/* DETAILS */}

                <div className="p-6">

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                    <Info
                      icon={<FaIdCard />}
                      label="Application ID"
                      value={application._id}
                    />

                    <Info
                      icon={<FaIdCard />}
                      label="License ID"
                      value={
                        application.licenseId ||
                        "Not generated yet"
                      }
                    />

                    <Info
                      icon={<FaMapMarkerAlt />}
                      label="Tourist Region"
                      value={application.touristRegion}
                    />

                    <Info
                      icon={<FaCalendarAlt />}
                      label="Submitted On"
                      value={
                        application.createdAt
                          ? new Date(
                              application.createdAt
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })
                          : "Not available"
                      }
                    />

                    <Info
                      icon={<FaFileAlt />}
                      label="Qualification"
                      value={application.qualification}
                    />

                    <Info
                      icon={<FaClock />}
                      label="Experience"
                      value={
                        application.experience
                          ? `${application.experience} years`
                          : "Not provided"
                      }
                    />

                  </div>

                  {/* APPROVED */}

                  {application.status === "Approved" && (
                    <div className="mt-6 p-5 bg-emerald-50 border border-emerald-200 rounded-xl">

                      <div className="flex items-start gap-3">

                        <FaCheckCircle className="text-emerald-600 text-xl mt-1" />

                        <div>

                          <p className="font-bold text-emerald-800">
                            License Approved
                          </p>

                          <p className="text-emerald-700 mt-1">
                            Your tourism guide license has been approved.
                          </p>

                          <p className="text-emerald-800 mt-2">
                            License ID:{" "}
                            <strong>
                              {application.licenseId}
                            </strong>
                          </p>

                        </div>

                      </div>

                    </div>
                  )}

                  {/* PENDING */}

                  {(!application.status ||
                    application.status === "Pending") && (
                    <div className="mt-6 p-5 bg-amber-50 border border-amber-200 rounded-xl">

                      <div className="flex items-start gap-3">

                        <FaClock className="text-amber-600 text-xl mt-1" />

                        <div>

                          <p className="font-bold text-amber-800">
                            Application Under Review
                          </p>

                          <p className="text-amber-700 mt-1">
                            Your application has been submitted successfully and is currently being reviewed by the administrator.
                          </p>

                        </div>

                      </div>

                    </div>
                  )}

                  {/* REJECTED */}

                  {application.status === "Rejected" && (
                    <div className="mt-6 p-5 bg-red-50 border border-red-200 rounded-xl">

                      <div className="flex items-start gap-3">

                        <FaTimesCircle className="text-red-600 text-xl mt-1" />

                        <div>

                          <p className="font-bold text-red-800">
                            Application Rejected
                          </p>

                          <p className="text-red-700 mt-1">
                            Your application has been rejected by the administrator.
                          </p>

                        </div>

                      </div>

                    </div>
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}


/* =====================================================
   SUMMARY CARD
===================================================== */

function SummaryCard({
  title,
  value,
  icon,
  bg,
  color,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
            {value}
          </h2>

        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${bg} ${color}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}


/* =====================================================
   INFORMATION BOX
===================================================== */

function Info({
  icon,
  label,
  value,
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">

      <div className="flex items-start gap-3">

        <div className="text-teal-700 mt-1">
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {label}
          </p>

          <p className="text-sm font-bold text-slate-900 mt-1 break-words">
            {value || "Not provided"}
          </p>

        </div>

      </div>

    </div>
  );
}
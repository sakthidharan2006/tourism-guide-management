"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaFileAlt,
  FaIdCard,
  FaSyncAlt,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaArrowRight,
  FaUserCircle,
  FaShieldAlt,
} from "react-icons/fa";
import API from "../../services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  const [applications, setApplications] = useState([]);
  const [renewals, setRenewals] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================================
  // LOAD DASHBOARD
  // =========================================

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setLoading(false);
        return;
      }

      const loggedUser = JSON.parse(storedUser);

      setUser(loggedUser);

      const email = loggedUser.email;

      // =========================================
      // APPLICATIONS
      // =========================================

      try {
        const applicationsRes = await API.get(
          `/license/my-applications/${encodeURIComponent(email)}`
        );

        setApplications(applicationsRes.data || []);
      } catch (error) {
        console.error(
          "Applications loading error:",
          error
        );

        setApplications([]);
      }

      // =========================================
      // RENEWALS
      // =========================================

      try {
        const renewalsRes = await API.get(
          `/renewal/my-renewals/${encodeURIComponent(email)}`
        );

        setRenewals(renewalsRes.data || []);
      } catch (error) {
        console.error(
          "Renewals loading error:",
          error
        );

        setRenewals([]);
      }

      // =========================================
      // COMPLAINTS
      // =========================================

      try {
        const complaintsRes = await API.get(
          `/complaint/my-complaints/${encodeURIComponent(email)}`
        );

        setComplaints(complaintsRes.data || []);
      } catch (error) {
        console.error(
          "Complaints loading error:",
          error
        );

        setComplaints([]);
      }
    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // STATUS STYLE
  // =========================================

  const getStatusStyle = (status) => {
    if (
      status === "Approved" ||
      status === "Resolved"
    ) {
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    }

    if (status === "Rejected") {
      return "bg-red-50 text-red-700 border border-red-200";
    }

    if (status === "In Progress") {
      return "bg-blue-50 text-blue-700 border border-blue-200";
    }

    return "bg-amber-50 text-amber-700 border border-amber-200";
  };

  // =========================================
  // STATUS ICON
  // =========================================

  const getStatusIcon = (status) => {
    if (
      status === "Approved" ||
      status === "Resolved"
    ) {
      return <FaCheckCircle />;
    }

    if (status === "Rejected") {
      return <FaTimesCircle />;
    }

    if (status === "In Progress") {
      return <FaSyncAlt />;
    }

    return <FaClock />;
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">

          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-600 font-medium">
            Loading your dashboard...
          </p>

        </div>
      </main>
    );
  }

  const displayName =
    user?.name ||
    user?.fullName ||
    "Tourism Guide";

  const approvedApplications =
    applications.filter(
      (item) => item.status === "Approved"
    ).length;

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =========================================
          TOP NAVIGATION
      ========================================= */}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

          <div className="flex items-center justify-between gap-4">

            {/* BRAND */}

            <Link
              href="/dashboard"
              className="flex items-center gap-3"
            >

              <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center shadow-sm">

                <FaIdCard className="text-white" />

              </div>

              <div className="hidden sm:block">

                <h2 className="font-bold text-slate-900 leading-tight">
                  GuideConnect
                </h2>

                <p className="text-xs text-slate-500">
                  Tourism Guide Portal
                </p>

              </div>

            </Link>

            {/* ACTIONS */}

            <div className="flex items-center gap-2 sm:gap-3">

              <Link
                href="/profile"
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold transition"
              >

                <FaUserCircle />

                <span className="hidden sm:inline">
                  Profile
                </span>

              </Link>

            </div>

          </div>

        </div>

      </header>

      {/* =========================================
          WELCOME HERO
      ========================================= */}

      <section className="relative overflow-hidden bg-gradient-to-r from-[#0f3d56] via-[#0f5c68] to-[#0f766e] text-white">

        {/* Decorative shapes */}

        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full" />

        <div className="absolute -bottom-32 right-32 w-80 h-80 bg-emerald-300/10 rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-teal-50 text-xs sm:text-sm font-semibold">

              <FaShieldAlt />

              Official Tourism Guide Portal

            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-5 tracking-tight">

              Welcome, {displayName} 👋

            </h1>

            <p className="text-teal-50 mt-4 text-sm sm:text-base lg:text-lg leading-7 max-w-2xl">

              Manage your tourism guide license,
              applications, renewals and complaints
              from one secure platform.

            </p>

          </div>

        </div>

      </section>

      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* =========================================
            STATISTICS
        ========================================= */}

        <section className="mb-10">

          <div className="mb-5">

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Overview
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              A quick summary of your tourism guide activities.
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

            <StatCard
              title="Applications"
              value={applications.length}
              icon={<FaFileAlt />}
              iconClass="bg-blue-50 text-blue-600"
            />

            <StatCard
              title="Approved"
              value={approvedApplications}
              icon={<FaCheckCircle />}
              iconClass="bg-emerald-50 text-emerald-600"
              valueClass="text-emerald-600"
            />

            <StatCard
              title="Renewals"
              value={renewals.length}
              icon={<FaSyncAlt />}
              iconClass="bg-amber-50 text-amber-600"
              valueClass="text-amber-600"
            />

            <StatCard
              title="Complaints"
              value={complaints.length}
              icon={<FaExclamationCircle />}
              iconClass="bg-red-50 text-red-600"
              valueClass="text-red-600"
            />

          </div>

        </section>

        {/* =========================================
            QUICK SERVICES
        ========================================= */}

        <section className="mb-10">

          <div className="mb-5">

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Quick Services
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Access your most frequently used services.
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

            <ServiceCard
              href="/apply-license"
              icon={<FaFileAlt />}
              iconClass="bg-teal-50 text-teal-700"
              title="Apply License"
              description="Submit a new tourism guide license application."
              action="Apply Now"
            />

            <ServiceCard
              href="/renew-license"
              icon={<FaSyncAlt />}
              iconClass="bg-amber-50 text-amber-700"
              title="Renew License"
              description="Renew your existing tourism guide license."
              action="Renew Now"
            />

            <ServiceCard
              href="/track-status"
              icon={<FaIdCard />}
              iconClass="bg-blue-50 text-blue-700"
              title="Track Status"
              description="Track the progress of your submitted application."
              action="Track Now"
            />

            <ServiceCard
              href="/complaints"
              icon={<FaExclamationCircle />}
              iconClass="bg-red-50 text-red-700"
              title="Complaints"
              description="Submit and track your tourism-related complaints."
              action="Manage"
            />

          </div>

        </section>

        {/* =========================================
            APPLICATIONS
        ========================================= */}

        <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="px-5 sm:px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                My License Applications
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                View the latest status of your submitted applications.
              </p>

            </div>

            {applications.length > 0 && (
              <Link
                href="/track-status"
                className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900"
              >
                View All
                <FaArrowRight />
              </Link>
            )}

          </div>

          {applications.length === 0 ? (

            <EmptyState
              icon={<FaFileAlt />}
              title="No applications yet"
              description="You have not submitted a tourism guide license application."
              href="/apply-license"
              buttonText="Apply for License"
            />

          ) : (

            <div className="divide-y divide-slate-100">

              {applications.slice(0, 5).map(
                (application) => (

                  <div
                    key={application._id}
                    className="p-5 sm:p-6 hover:bg-slate-50/70 transition"
                  >

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                      <div className="min-w-0">

                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Application ID
                        </p>

                        <p className="font-semibold text-slate-900 mt-1 break-all">
                          {application._id}
                        </p>

                        <div className="mt-4">

                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Tourist Region
                          </p>

                          <p className="font-semibold text-slate-800 mt-1">
                            {application.touristRegion ||
                              "Not specified"}
                          </p>

                        </div>

                      </div>

                      <div className="lg:text-right">

                        <span
                          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                            application.status
                          )}`}
                        >

                          {getStatusIcon(
                            application.status
                          )}

                          {application.status ||
                            "Pending"}

                        </span>

                        {application.licenseId && (
                          <div className="mt-3">

                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                              License ID
                            </p>

                            <p className="font-bold text-teal-700 mt-1">
                              {application.licenseId}
                            </p>

                          </div>
                        )}

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* =========================================
            RECENT RENEWALS
        ========================================= */}

        {renewals.length > 0 && (

          <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm mt-6 overflow-hidden">

            <div className="px-5 sm:px-6 py-5 border-b border-slate-200">

              <h2 className="text-xl font-bold text-slate-900">
                Recent Renewals
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Track the status of your recent license renewals.
              </p>

            </div>

            <div className="divide-y divide-slate-100">

              {renewals.slice(0, 5).map(
                (renewal) => (

                  <div
                    key={renewal._id}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/70 transition"
                  >

                    <div className="min-w-0">

                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        License ID
                      </p>

                      <p className="font-semibold text-slate-900 mt-1 break-all">
                        {renewal.licenseId ||
                          "Not available"}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {renewal.currentRegion ||
                          "Region not specified"}
                      </p>

                    </div>

                    <span
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold w-fit ${getStatusStyle(
                        renewal.status
                      )}`}
                    >

                      {getStatusIcon(
                        renewal.status
                      )}

                      {renewal.status ||
                        "Pending"}

                    </span>

                  </div>

                )
              )}

            </div>

          </section>

        )}

        {/* =========================================
            RECENT COMPLAINTS
        ========================================= */}

        {complaints.length > 0 && (

          <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm mt-6 overflow-hidden">

            <div className="px-5 sm:px-6 py-5 border-b border-slate-200">

              <h2 className="text-xl font-bold text-slate-900">
                Recent Complaints
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Track the progress of your submitted complaints.
              </p>

            </div>

            <div className="divide-y divide-slate-100">

              {complaints.slice(0, 5).map(
                (complaint) => (

                  <div
                    key={complaint._id}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/70 transition"
                  >

                    <div className="min-w-0">

                      <p className="font-semibold text-slate-900 break-words">
                        {complaint.subject ||
                          "Complaint"}
                      </p>

                      <p className="text-sm text-slate-500 mt-1 break-all">
                        License ID:{" "}
                        {complaint.licenseId ||
                          "Not specified"}
                      </p>

                    </div>

                    <span
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold w-fit ${getStatusStyle(
                        complaint.status
                      )}`}
                    >

                      {getStatusIcon(
                        complaint.status
                      )}

                      {complaint.status ||
                        "Pending"}

                    </span>

                  </div>

                )
              )}

            </div>

          </section>

        )}

      </div>

    </main>
  );
}

// =========================================
// STAT CARD
// =========================================

function StatCard({
  title,
  value,
  icon,
  iconClass,
  valueClass = "text-slate-900",
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 hover:shadow-md hover:-translate-y-0.5 transition">

      <div className="flex items-center justify-between gap-4">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2
            className={`text-3xl font-extrabold mt-2 ${valueClass}`}
          >
            {value}
          </h2>

        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg shrink-0 ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

// =========================================
// SERVICE CARD
// =========================================

function ServiceCard({
  href,
  icon,
  iconClass,
  title,
  description,
  action,
}) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 hover:shadow-lg hover:-translate-y-1 hover:border-slate-300 transition duration-300"
    >

      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${iconClass}`}
      >
        {icon}
      </div>

      <h3 className="text-lg font-bold text-slate-900 mt-5 group-hover:text-teal-700 transition">
        {title}
      </h3>

      <p className="text-slate-500 text-sm mt-2 leading-6">
        {description}
      </p>

      <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm mt-5">

        {action}

        <FaArrowRight className="group-hover:translate-x-1 transition" />

      </div>

    </Link>
  );
}

// =========================================
// EMPTY STATE
// =========================================

function EmptyState({
  icon,
  title,
  description,
  href,
  buttonText,
}) {
  return (
    <div className="p-10 sm:p-14 text-center">

      <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">

        {icon}

      </div>

      <p className="font-bold text-slate-800 mt-5">
        {title}
      </p>

      <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
        {description}
      </p>

      <Link
        href={href}
        className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-teal-700 text-white font-semibold hover:bg-teal-800 transition"
      >
        {buttonText}
        <FaArrowRight />
      </Link>

    </div>
  );
}
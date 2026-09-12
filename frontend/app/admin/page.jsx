"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSyncAlt,
  FaExclamationCircle,
  FaUsers,
  FaArrowRight,
  FaChartLine,
  FaClipboardList,
} from "react-icons/fa";
import { toast } from "react-toastify";
import API from "../../services/api";

export default function AdminDashboard() {
  const router = useRouter();

  const [applications, setApplications] = useState([]);
  const [renewals, setRenewals] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);

  // ============================
  // FETCH DASHBOARD DATA
  // ============================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [applicationsRes, renewalsRes, complaintsRes] =
        await Promise.all([
          API.get("/license/applications"),
          API.get("/renewal/all"),
          API.get("/complaint/all"),
        ]);

      setApplications(applicationsRes.data || []);
      setRenewals(renewalsRes.data || []);
      setComplaints(complaintsRes.data || []);
    } catch (error) {
      console.error("Dashboard error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ============================
  // STATISTICS
  // ============================

  const pendingApplications = applications.filter(
    (item) =>
      !item.status || item.status === "Pending"
  ).length;

  const approvedApplications = applications.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedApplications = applications.filter(
    (item) => item.status === "Rejected"
  ).length;

  const pendingRenewals = renewals.filter(
    (item) =>
      !item.status || item.status === "Pending"
  ).length;

  const approvedRenewals = renewals.filter(
    (item) => item.status === "Approved"
  ).length;

  const pendingComplaints = complaints.filter(
    (item) =>
      !item.status || item.status === "Pending"
  ).length;

  const inProgressComplaints = complaints.filter(
    (item) => item.status === "In Progress"
  ).length;

  // ============================
  // RECENT DATA
  // ============================

  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  const recentRenewals = [...renewals]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  const recentComplaints = [...complaints]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  // ============================
  // STATUS BADGE
  // ============================

  const statusBadge = (status) => {
    if (status === "Approved") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
          <FaCheckCircle />
          Approved
        </span>
      );
    }

    if (status === "Rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
          <FaTimesCircle />
          Rejected
        </span>
      );
    }

    if (status === "In Progress") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
          <FaSyncAlt />
          In Progress
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
        <FaClock />
        Pending
      </span>
    );
  };

  // ============================
  // LOADING
  // ============================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-5 text-slate-600 font-semibold">
            Loading Admin Dashboard...
          </p>
        </div>
      </main>
    );
  }

  // ============================
  // DASHBOARD
  // ============================

  return (
    <main className="min-h-screen bg-slate-100">

      {/* ================= HEADER ================= */}

      <section className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-900 text-white">

        <div className="max-w-7xl mx-auto px-6 py-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <p className="text-teal-300 text-sm font-bold uppercase tracking-widest">
                Administration
              </p>

              <h1 className="text-4xl md:text-5xl font-extrabold mt-2">
                Admin Dashboard
              </h1>

              <p className="text-teal-100 mt-3 max-w-2xl">
                Manage tourism guide licenses, renewals,
                applications and complaints from one central
                administration panel.
              </p>

            </div>

            <button
              onClick={fetchDashboardData}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-semibold transition"
            >
              <FaSyncAlt />
              Refresh Dashboard
            </button>

          </div>

        </div>

      </section>

      {/* ================= CONTENT ================= */}

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ================= STATISTICS ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <StatCard
            title="Total Applications"
            value={applications.length}
            icon={<FaFileAlt />}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />

          <StatCard
            title="Pending Applications"
            value={pendingApplications}
            icon={<FaClock />}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
          />

          <StatCard
            title="Approved Licenses"
            value={approvedApplications}
            icon={<FaCheckCircle />}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
          />

          <StatCard
            title="Rejected Applications"
            value={rejectedApplications}
            icon={<FaTimesCircle />}
            iconBg="bg-red-100"
            iconColor="text-red-600"
          />

        </div>

        {/* ================= SECOND STATS ================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">

          <StatCard
            title="Pending Renewals"
            value={pendingRenewals}
            icon={<FaSyncAlt />}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />

          <StatCard
            title="Pending Complaints"
            value={pendingComplaints}
            icon={<FaExclamationCircle />}
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
          />

          <StatCard
            title="Complaints In Progress"
            value={inProgressComplaints}
            icon={<FaClipboardList />}
            iconBg="bg-cyan-100"
            iconColor="text-cyan-600"
          />

        </div>

        {/* ================= QUICK ACTIONS ================= */}

        <section className="mt-8">

          <div className="flex items-center justify-between mb-5">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Quick Actions
              </h2>

              <p className="text-slate-500 mt-1">
                Quickly access administrative modules.
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <QuickAction
              title="License Applications"
              description="Review and process new tourism guide license applications."
              icon={<FaFileAlt />}
              onClick={() =>
                router.push("/admin/applications")
              }
            />

            <QuickAction
              title="Renewal Applications"
              description="Review and manage existing license renewal requests."
              icon={<FaSyncAlt />}
              onClick={() =>
                router.push("/admin/renewals")
              }
            />

            <QuickAction
              title="Complaint Management"
              description="Review complaints and update their resolution status."
              icon={<FaExclamationCircle />}
              onClick={() =>
                router.push("/admin/complaint")
              }
            />

          </div>

        </section>

        {/* ================= RECENT APPLICATIONS ================= */}

        <section className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <SectionHeader
            title="Recent License Applications"
            description="Latest tourism guide license applications."
            onClick={() =>
              router.push("/admin/applications")
            }
          />

          {recentApplications.length === 0 ? (

            <EmptyState message="No license applications found." />

          ) : (

            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="bg-slate-50 border-y border-slate-200">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                      Applicant
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                      Region
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {recentApplications.map((item) => (

                    <tr
                      key={item._id}
                      className="hover:bg-slate-50 transition"
                    >

                      <td className="px-6 py-4">

                        <p className="font-semibold text-slate-900">
                          {item.fullName}
                        </p>

                        <p className="text-sm text-slate-500">
                          {item.email}
                        </p>

                      </td>

                      <td className="px-6 py-4 text-slate-700">
                        {item.touristRegion || "Not provided"}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {formatDate(item.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        {statusBadge(item.status)}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* ================= RENEWALS + COMPLAINTS ================= */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          {/* RENEWALS */}

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <SectionHeader
              title="Recent Renewals"
              description="Latest renewal requests."
              onClick={() =>
                router.push("/admin/renewals")
              }
            />

            {recentRenewals.length === 0 ? (

              <EmptyState message="No renewal applications found." />

            ) : (

              <div className="divide-y divide-slate-100">

                {recentRenewals.map((item) => (

                  <div
                    key={item._id}
                    className="p-5 hover:bg-slate-50 transition"
                  >

                    <div className="flex items-center justify-between gap-4">

                      <div>

                        <p className="font-semibold text-slate-900">
                          {item.fullName || item.name || "Applicant"}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          License ID:{" "}
                          {item.licenseId || "Not provided"}
                        </p>

                      </div>

                      {statusBadge(item.status)}

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

          {/* COMPLAINTS */}

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <SectionHeader
              title="Recent Complaints"
              description="Latest submitted complaints."
              onClick={() =>
                router.push("/admin/complaint")
              }
            />

            {recentComplaints.length === 0 ? (

              <EmptyState message="No complaints found." />

            ) : (

              <div className="divide-y divide-slate-100">

                {recentComplaints.map((item) => (

                  <div
                    key={item._id}
                    className="p-5 hover:bg-slate-50 transition"
                  >

                    <div className="flex items-center justify-between gap-4">

                      <div className="min-w-0">

                        <p className="font-semibold text-slate-900 truncate">
                          {item.subject}
                        </p>

                        <p className="text-sm text-slate-500 mt-1 truncate">
                          {item.fullName} • {item.email}
                        </p>

                      </div>

                      {statusBadge(item.status)}

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

        </div>

        {/* ================= SYSTEM OVERVIEW ================= */}

        <section className="mt-8 bg-gradient-to-r from-teal-900 to-emerald-800 rounded-2xl p-8 text-white">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <FaChartLine />
                </div>

                <h2 className="text-2xl font-bold">
                  Tourism Management Overview
                </h2>

              </div>

              <p className="text-teal-100 mt-3 max-w-2xl">
                The administration portal provides centralized
                management of tourism guide licensing, renewals,
                application processing and citizen complaints.
              </p>

            </div>

            <div className="text-center md:text-right">

              <p className="text-teal-200 text-sm">
                Total Records Managed
              </p>

              <p className="text-4xl font-extrabold mt-1">
                {applications.length +
                  renewals.length +
                  complaints.length}
              </p>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  title,
  value,
  icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-semibold text-slate-500">
            {title}
          </p>

          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {value}
          </p>

        </div>

        <div
          className={`w-12 h-12 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center text-lg`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

// =====================================================
// QUICK ACTION
// =====================================================

function QuickAction({
  title,
  description,
  icon,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="text-left bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
    >

      <div className="flex items-start justify-between">

        <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center text-lg">
          {icon}
        </div>

        <FaArrowRight className="text-slate-300 group-hover:text-teal-600 transition" />

      </div>

      <h3 className="text-xl font-bold text-slate-900 mt-5">
        {title}
      </h3>

      <p className="text-slate-500 mt-2 leading-6">
        {description}
      </p>

    </button>
  );
}

// =====================================================
// SECTION HEADER
// =====================================================

function SectionHeader({
  title,
  description,
  onClick,
}) {
  return (
    <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-4">

      <div>

        <h2 className="text-xl font-bold text-slate-900">
          {title}
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          {description}
        </p>

      </div>

      <button
        onClick={onClick}
        className="hidden sm:flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900"
      >
        View All
        <FaArrowRight />
      </button>

    </div>
  );
}

// =====================================================
// EMPTY STATE
// =====================================================

function EmptyState({ message }) {
  return (
    <div className="p-10 text-center">

      <FaClipboardList className="mx-auto text-3xl text-slate-300" />

      <p className="text-slate-500 mt-3">
        {message}
      </p>

    </div>
  );
}

// =====================================================
// DATE FORMAT
// =====================================================

function formatDate(date) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
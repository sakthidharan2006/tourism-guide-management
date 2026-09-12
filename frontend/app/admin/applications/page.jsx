"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaEye,
  FaTimes,
  FaSyncAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
  FaCalendarAlt,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../services/api";

export default function AdminApplicationsPage() {
  const router = useRouter();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  const [rejectingApplication, setRejectingApplication] =
    useState(null);

  const [adminRemark, setAdminRemark] = useState("");

  // ========================================
  // FETCH APPLICATIONS
  // ========================================

  const fetchApplications = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await API.get("/license/applications");

      setApplications(res.data || []);
    } catch (error) {
      console.error("Fetch applications error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load applications"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // ========================================
  // STATISTICS
  // ========================================

  const statistics = useMemo(() => {
    return {
      total: applications.length,

      pending: applications.filter(
        (app) =>
          !app.status ||
          app.status === "Pending"
      ).length,

      approved: applications.filter(
        (app) => app.status === "Approved"
      ).length,

      rejected: applications.filter(
        (app) => app.status === "Rejected"
      ).length,
    };
  }, [applications]);

  // ========================================
  // SEARCH + FILTER
  // ========================================

  const filteredApplications = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    return applications.filter((application) => {
      const matchesSearch =
        !search ||
        application.fullName
          ?.toLowerCase()
          .includes(search) ||
        application.email
          ?.toLowerCase()
          .includes(search) ||
        application.phone
          ?.toLowerCase()
          .includes(search) ||
        application.licenseId
          ?.toLowerCase()
          .includes(search) ||
        application._id
          ?.toLowerCase()
          .includes(search);

      const applicationStatus =
        application.status || "Pending";

      const matchesStatus =
        statusFilter === "All" ||
        applicationStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    applications,
    searchTerm,
    statusFilter,
  ]);

  // ========================================
  // APPROVE APPLICATION
  // ========================================

  const handleApprove = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this application?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);

      const res = await API.put(
        `/license/approve/${id}`
      );

      toast.success(
        res.data?.message ||
          "Application approved successfully"
      );

      setSelectedApplication(null);

      await fetchApplications(true);
    } catch (error) {
      console.error("Approve error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to approve application"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ========================================
  // OPEN REJECT MODAL
  // ========================================

  const openRejectModal = (application) => {
    setRejectingApplication(application);

    setAdminRemark(
      application.adminRemark || ""
    );
  };

  // ========================================
  // REJECT APPLICATION
  // ========================================

  const handleReject = async () => {
    if (!rejectingApplication) return;

    if (!adminRemark.trim()) {
      toast.error(
        "Please enter a reason for rejection."
      );

      return;
    }

    try {
      setProcessingId(
        rejectingApplication._id
      );

      const res = await API.put(
        `/license/reject/${rejectingApplication._id}`,
        {
          adminRemark: adminRemark.trim(),
        }
      );

      toast.success(
        res.data?.message ||
          "Application rejected successfully"
      );

      setRejectingApplication(null);
      setAdminRemark("");
      setSelectedApplication(null);

      await fetchApplications(true);
    } catch (error) {
      console.error("Reject error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to reject application"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">

          <div className="w-14 h-14 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-5 text-slate-600 font-semibold">
            Loading license applications...
          </p>

        </div>
      </main>
    );
  }

  // ========================================
  // PAGE
  // ========================================

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <header className="bg-white border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">

          <button
            onClick={() =>
              router.push("/admin")
            }
            className="inline-flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-900 transition mb-5"
          >
            <FaArrowLeft />

            Back to Admin Dashboard
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>

              <div className="flex items-center gap-2 text-teal-700 text-sm font-bold uppercase tracking-wider">

                <FaIdCard />

                License Management

              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
                Tourism Guide Applications
              </h1>

              <p className="text-slate-500 mt-2 max-w-2xl">
                Review, verify and manage tourism
                guide license applications.
              </p>

            </div>

            <button
              onClick={() =>
                fetchApplications(true)
              }
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-800 transition disabled:opacity-60"
            >

              <FaSyncAlt
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}

            </button>

          </div>

        </div>

      </header>


      {/* ================================= */}
      {/* CONTENT */}
      {/* ================================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* ================================= */}
        {/* STATISTICS */}
        {/* ================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <StatCard
            title="Total Applications"
            value={statistics.total}
            icon={<FaIdCard />}
            iconClass="bg-teal-100 text-teal-700"
          />

          <StatCard
            title="Pending Review"
            value={statistics.pending}
            icon={<FaFilter />}
            iconClass="bg-amber-100 text-amber-700"
          />

          <StatCard
            title="Approved"
            value={statistics.approved}
            icon={<FaCheckCircle />}
            iconClass="bg-emerald-100 text-emerald-700"
          />

          <StatCard
            title="Rejected"
            value={statistics.rejected}
            icon={<FaTimesCircle />}
            iconClass="bg-red-100 text-red-700"
          />

        </div>


        {/* ================================= */}
        {/* SEARCH + FILTER */}
        {/* ================================= */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-7">

          <div className="flex flex-col lg:flex-row gap-4">

            {/* SEARCH */}

            <div className="relative flex-1">

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search by name, email, phone, application ID or license ID..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />

            </div>


            {/* STATUS */}

            <div className="relative lg:w-56">

              <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full appearance-none pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >

                <option value="All">
                  All Status
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Approved">
                  Approved
                </option>

                <option value="Rejected">
                  Rejected
                </option>

              </select>

            </div>

          </div>

          <div className="flex items-center justify-between mt-4 text-sm">

            <p className="text-slate-500">

              Showing{" "}

              <span className="font-bold text-slate-800">
                {filteredApplications.length}
              </span>{" "}

              of{" "}

              <span className="font-bold text-slate-800">
                {applications.length}
              </span>{" "}

              applications

            </p>

            {(searchTerm ||
              statusFilter !== "All") && (

              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="text-teal-700 font-semibold hover:text-teal-900"
              >
                Clear Filters
              </button>

            )}

          </div>

        </div>


        {/* ================================= */}
        {/* APPLICATION LIST */}
        {/* ================================= */}

        {filteredApplications.length === 0 ? (

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">

            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-2xl">
              <FaSearch />
            </div>

            <h2 className="text-xl font-bold text-slate-800 mt-5">
              No Applications Found
            </h2>

            <p className="text-slate-500 mt-2">
              Try changing your search or filter.
            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {filteredApplications.map(
              (application) => (

                <ApplicationCard
                  key={application._id}
                  application={application}
                  processingId={processingId}
                  onApprove={handleApprove}
                  onReject={openRejectModal}
                  onView={setSelectedApplication}
                />

              )
            )}

          </div>

        )}

      </div>


      {/* ================================= */}
      {/* APPLICATION DETAILS MODAL */}
      {/* ================================= */}

      {selectedApplication && (

        <ApplicationDetailsModal
          application={selectedApplication}
          processingId={processingId}
          onClose={() =>
            setSelectedApplication(null)
          }
          onApprove={handleApprove}
          onReject={openRejectModal}
        />

      )}


      {/* ================================= */}
      {/* REJECTION MODAL */}
      {/* ================================= */}

      {rejectingApplication && (

        <RejectModal
          application={rejectingApplication}
          remark={adminRemark}
          setRemark={setAdminRemark}
          processing={
            processingId ===
            rejectingApplication._id
          }
          onClose={() => {
            setRejectingApplication(null);
            setAdminRemark("");
          }}
          onSubmit={handleReject}
        />

      )}

    </main>
  );
}


// ========================================
// STAT CARD
// ========================================

function StatCard({
  title,
  value,
  icon,
  iconClass,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            {value}
          </p>

        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}


// ========================================
// APPLICATION CARD
// ========================================

function ApplicationCard({
  application,
  processingId,
  onApprove,
  onReject,
  onView,
}) {
  const status =
    application.status || "Pending";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">

      {/* CARD HEADER */}

      <div className="px-5 sm:px-6 py-5 border-b border-slate-100">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <div className="flex items-center gap-2 text-sm text-slate-500">

              <FaIdCard />

              Application ID

            </div>

            <p className="font-semibold text-slate-900 mt-1 break-all">
              {application._id}
            </p>

          </div>

          <StatusBadge status={status} />

        </div>

      </div>


      {/* DETAILS */}

      <div className="p-5 sm:p-6">

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

          <div className="flex-1">

            <h2 className="text-xl font-bold text-slate-900">
              {application.fullName}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Tourism Guide License Applicant
            </p>


            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">

              <MiniDetail
                icon={<FaEnvelope />}
                label="Email"
                value={application.email}
              />

              <MiniDetail
                icon={<FaPhone />}
                label="Phone"
                value={application.phone}
              />

              <MiniDetail
                icon={<FaMapMarkerAlt />}
                label="Tourist Region"
                value={application.touristRegion}
              />

              <MiniDetail
                icon={<FaGraduationCap />}
                label="Qualification"
                value={application.qualification}
              />

              <MiniDetail
                icon={<FaBriefcase />}
                label="Experience"
                value={
                  application.experience !==
                  undefined
                    ? `${application.experience} years`
                    : "Not provided"
                }
              />

              <MiniDetail
                icon={<FaCalendarAlt />}
                label="Submitted"
                value={
                  application.createdAt
                    ? new Date(
                        application.createdAt
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : "Not available"
                }
              />

            </div>

          </div>

        </div>


        {/* ACTIONS */}

        <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-slate-100">

          <button
            onClick={() =>
              onView(application)
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
          >
            <FaEye />
            View Details
          </button>


          {status === "Pending" && (

            <>
              <button
                onClick={() =>
                  onApprove(application._id)
                }
                disabled={
                  processingId ===
                  application._id
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
              >

                <FaCheckCircle />

                {processingId ===
                application._id
                  ? "Processing..."
                  : "Approve"}

              </button>

              <button
                onClick={() =>
                  onReject(application)
                }
                disabled={
                  processingId ===
                  application._id
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >

                <FaTimesCircle />

                Reject

              </button>
            </>

          )}

        </div>


        {/* REJECTION REMARK */}

        {status === "Rejected" &&
          application.adminRemark && (

            <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl">

              <p className="text-sm font-bold text-red-800">
                Admin Remark
              </p>

              <p className="text-sm text-red-700 mt-1">
                {application.adminRemark}
              </p>

            </div>

          )}

        {/* LICENSE */}

        {status === "Approved" &&
          application.licenseId && (

            <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">

              <p className="text-sm font-semibold text-emerald-800">
                License ID
              </p>

              <p className="text-lg font-bold text-emerald-700 mt-1">
                {application.licenseId}
              </p>

            </div>

          )}

      </div>

    </div>
  );
}


// ========================================
// MINI DETAIL
// ========================================

function MiniDetail({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="mt-1 text-teal-600">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-xs text-slate-400 uppercase tracking-wide">
          {label}
        </p>

        <p className="text-sm font-semibold text-slate-800 break-words mt-0.5">
          {value || "Not provided"}
        </p>

      </div>

    </div>
  );
}


// ========================================
// STATUS BADGE
// ========================================

function StatusBadge({ status }) {
  if (status === "Approved") {
    return (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-sm">
        <FaCheckCircle />
        Approved
      </span>
    );
  }

  if (status === "Rejected") {
    return (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-700 border border-red-200 font-semibold text-sm">
        <FaTimesCircle />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-sm">
      <span className="w-2 h-2 rounded-full bg-amber-500" />
      Pending
    </span>
  );
}


// ========================================
// APPLICATION DETAILS MODAL
// ========================================

function ApplicationDetailsModal({
  application,
  processingId,
  onClose,
  onApprove,
  onReject,
}) {
  const status =
    application.status || "Pending";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">

        {/* HEADER */}

        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">

          <div>

            <p className="text-sm font-semibold text-teal-700 uppercase tracking-wide">
              Application Details
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              {application.fullName}
            </h2>

          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
          >
            <FaTimes />
          </button>

        </div>


        {/* BODY */}

        <div className="p-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Detail
              label="Application ID"
              value={application._id}
            />

            <Detail
              label="License ID"
              value={
                application.licenseId ||
                "Not generated"
              }
            />

            <Detail
              label="Full Name"
              value={application.fullName}
            />

            <Detail
              label="Email"
              value={application.email}
            />

            <Detail
              label="Phone"
              value={application.phone}
            />

            <Detail
              label="Aadhaar"
              value={application.aadhaar}
            />

            <Detail
              label="Qualification"
              value={application.qualification}
            />

            <Detail
              label="Experience"
              value={
                application.experience !==
                undefined
                  ? `${application.experience} years`
                  : "Not provided"
              }
            />

            <Detail
              label="Tourist Region"
              value={application.touristRegion}
            />

            <Detail
              label="Submitted On"
              value={
                application.createdAt
                  ? new Date(
                      application.createdAt
                    ).toLocaleString(
                      "en-IN"
                    )
                  : "Not available"
              }
            />

          </div>


          <div className="mt-4">

            <Detail
              label="Address"
              value={application.address}
            />

          </div>


          {application.adminRemark && (

            <div className="mt-5 p-5 bg-red-50 border border-red-200 rounded-xl">

              <p className="text-sm font-bold text-red-800">
                Admin Remark
              </p>

              <p className="text-red-700 mt-1">
                {application.adminRemark}
              </p>

            </div>

          )}


          {/* ACTIONS */}

          {status === "Pending" && (

            <div className="flex flex-wrap gap-3 mt-7 pt-6 border-t border-slate-200">

              <button
                onClick={() =>
                  onApprove(application._id)
                }
                disabled={
                  processingId ===
                  application._id
                }
                className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50"
              >

                <FaCheckCircle />

                Approve Application

              </button>

              <button
                onClick={() =>
                  onReject(application)
                }
                disabled={
                  processingId ===
                  application._id
                }
                className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-5 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50"
              >

                <FaTimesCircle />

                Reject Application

              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}


// ========================================
// REJECT MODAL
// ========================================

function RejectModal({
  application,
  remark,
  setRemark,
  processing,
  onClose,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl">

        {/* HEADER */}

        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

          <div>

            <p className="text-sm font-semibold text-red-600 uppercase tracking-wide">
              Application Review
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Reject Application
            </h2>

          </div>

          <button
            onClick={onClose}
            disabled={processing}
            className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center disabled:opacity-50"
          >
            <FaTimes />
          </button>

        </div>


        {/* BODY */}

        <div className="p-6">

          <div className="bg-slate-50 rounded-xl p-4 mb-5">

            <p className="text-sm text-slate-500">
              Applicant
            </p>

            <p className="font-bold text-slate-900 mt-1">
              {application.fullName}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              {application.email}
            </p>

          </div>


          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Reason for Rejection
          </label>

          <textarea
            value={remark}
            onChange={(e) =>
              setRemark(e.target.value)
            }
            rows={5}
            placeholder="Enter the reason for rejecting this application..."
            disabled={processing}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-slate-100"
          />

          <p className="text-xs text-slate-400 mt-2">
            This remark will be stored with the
            application and can be viewed by the
            administrator.
          </p>


          <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">

            <button
              onClick={onClose}
              disabled={processing}
              className="flex-1 px-5 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={onSubmit}
              disabled={
                processing ||
                !remark.trim()
              }
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50"
            >

              <FaTimesCircle />

              {processing
                ? "Rejecting..."
                : "Reject Application"}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}


// ========================================
// DETAIL
// ========================================

function Detail({
  label,
  value,
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">

      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
        {label}
      </p>

      <p className="font-semibold text-slate-900 break-words">
        {value || "Not provided"}
      </p>

    </div>
  );
}
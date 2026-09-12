"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaSyncAlt,
  FaPaperPlane,
  FaClipboardList,
  FaClock,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEnvelope,
} from "react-icons/fa";
import { toast } from "react-toastify";
import API from "../../services/api";
export default function ComplaintsPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [formData, setFormData] = useState({
    licenseId: "",
    subject: "",
    description: "",
  });


  // ========================================
  // GET USER
  // ========================================

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        router.push("/login");
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);

      fetchComplaints(parsedUser.email);
    } catch (error) {
      console.error("User error:", error);

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      router.push("/login");
    }
  }, []);


  // ========================================
  // FETCH COMPLAINTS
  // ========================================

  const fetchComplaints = async (
    email,
    showRefresh = false
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await API.get(
  `/complaint/my-complaints/${encodeURIComponent(email)}`
);
      setComplaints(res.data || []);
    } catch (error) {
      console.error(
        "Fetch complaints error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load complaints"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  // ========================================
  // HANDLE INPUT
  // ========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // ========================================
  // SUBMIT COMPLAINT
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.licenseId.trim()) {
      toast.error("Please enter your License ID");
      return;
    }

    if (!formData.subject.trim()) {
      toast.error("Please enter the complaint subject");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please describe your complaint");
      return;
    }

    if (!user) {
      toast.error("Please login again");
      router.push("/login");
      return;
    }

    try {
      setSubmitting(true);

      const res = await API.post("/complaint", {
        fullName:
          user.name ||
          user.fullName ||
          "",
        email: user.email,
        licenseId: formData.licenseId.trim(),
        subject: formData.subject.trim(),
        description: formData.description.trim(),
      });

      toast.success(
        res.data?.message ||
          "Complaint submitted successfully"
      );

      setFormData({
        licenseId: "",
        subject: "",
        description: "",
      });

      await fetchComplaints(user.email);

    } catch (error) {
      console.error(
        "Submit complaint error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to submit complaint"
      );
    } finally {
      setSubmitting(false);
    }
  };


  // ========================================
  // REFRESH
  // ========================================

  const handleRefresh = () => {
    if (user?.email) {
      fetchComplaints(user.email, true);
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
            Loading complaints...
          </p>

        </div>

      </main>
    );
  }


  // ========================================
  // STATISTICS
  // ========================================

  const total = complaints.length;

  const pending = complaints.filter(
    (item) => item.status === "Pending"
  ).length;

  const progress = complaints.filter(
    (item) => item.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;


  return (
    <main className="min-h-screen bg-slate-50">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <header className="bg-white border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-6 py-7">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>

              <button
                onClick={() =>
                  router.push("/dashboard")
                }
                className="flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-900 transition mb-5"
              >
                <FaArrowLeft />

                Back to Dashboard
              </button>

              <p className="text-sm font-bold text-teal-700 uppercase tracking-wider">
                Support & Feedback
              </p>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                Complaints
              </h1>

              <p className="text-slate-500 mt-2">
                Submit and track your tourism service
                complaints.
              </p>

            </div>


            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="self-start lg:self-auto inline-flex items-center gap-2 px-5 py-3 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-800 transition disabled:opacity-60"
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

      <div className="max-w-7xl mx-auto px-6 py-8">


        {/* ================================= */}
        {/* STATISTICS */}
        {/* ================================= */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <StatCard
            title="Total"
            value={total}
            icon={<FaClipboardList />}
            iconStyle="bg-teal-50 text-teal-700"
          />

          <StatCard
            title="Pending"
            value={pending}
            icon={<FaClock />}
            iconStyle="bg-amber-50 text-amber-700"
          />

          <StatCard
            title="In Progress"
            value={progress}
            icon={<FaSpinner />}
            iconStyle="bg-blue-50 text-blue-700"
          />

          <StatCard
            title="Resolved"
            value={resolved}
            icon={<FaCheckCircle />}
            iconStyle="bg-emerald-50 text-emerald-700"
          />

        </div>


        {/* ================================= */}
        {/* SUBMIT COMPLAINT */}
        {/* ================================= */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">

          <div className="bg-gradient-to-r from-teal-800 to-emerald-700 px-6 py-6 text-white">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">

                <FaPaperPlane className="text-xl" />

              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  Submit a Complaint
                </h2>

                <p className="text-teal-100 mt-1">
                  Tell us about an issue you experienced.
                </p>

              </div>

            </div>

          </div>


          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-6"
          >

            {/* User information */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>

                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">

                  <FaClipboardList className="text-teal-600" />

                  <span className="text-slate-700 font-medium">
                    {user?.name ||
                      user?.fullName ||
                      "User"}
                  </span>

                </div>

              </div>


              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>

                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">

                  <FaEnvelope className="text-teal-600" />

                  <span className="text-slate-700 font-medium break-all">
                    {user?.email}
                  </span>

                </div>

              </div>

            </div>


            {/* License ID */}

            <div>

              <label
                htmlFor="licenseId"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                License ID
              </label>

              <div className="relative">

                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600" />

                <input
                  id="licenseId"
                  name="licenseId"
                  value={formData.licenseId}
                  onChange={handleChange}
                  placeholder="Example: TG-2026-1234"
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100 transition"
                />

              </div>

              <p className="text-xs text-slate-500 mt-2">
                Enter the tourism guide license related to
                your complaint.
              </p>

            </div>


            {/* Subject */}

            <div>

              <label
                htmlFor="subject"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Complaint Subject
              </label>

              <input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter complaint subject"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100 transition"
              />

            </div>


            {/* Description */}

            <div>

              <label
                htmlFor="description"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Complaint Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Describe your complaint in detail..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none resize-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100 transition"
              />

            </div>


            {/* Submit */}

            <div className="flex justify-end pt-2">

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-3 px-7 py-3.5 bg-gradient-to-r from-teal-700 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:from-teal-800 hover:to-emerald-700 transition disabled:opacity-60"
              >

                {submitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

                    Submitting...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />

                    Submit Complaint
                  </>
                )}

              </button>

            </div>

          </form>

        </div>


        {/* ================================= */}
        {/* COMPLAINT HISTORY */}
        {/* ================================= */}

        <div>

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                My Complaints
              </h2>

              <p className="text-slate-500 mt-1">
                View the status and response of your
                submitted complaints.
              </p>

            </div>

          </div>


          {complaints.length === 0 ? (

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">

              <div className="w-16 h-16 mx-auto bg-slate-100 text-slate-500 rounded-full flex items-center justify-center text-2xl">

                <FaClipboardList />

              </div>

              <h3 className="text-xl font-bold text-slate-800 mt-5">
                No Complaints Yet
              </h3>

              <p className="text-slate-500 mt-2">
                Your submitted complaints will appear here.
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {complaints.map((complaint) => (

                <ComplaintCard
                  key={complaint._id}
                  complaint={complaint}
                />

              ))}

            </div>

          )}

        </div>

      </div>

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
  iconStyle,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-1">
            {value}
          </p>

        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconStyle}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}


// ========================================
// COMPLAINT CARD
// ========================================

function ComplaintCard({
  complaint,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      {/* Header */}

      <div className="px-6 py-5 border-b border-slate-100">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>

            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Complaint ID
            </p>

            <p className="font-bold text-slate-800 mt-1 break-all">
              {complaint._id}
            </p>

          </div>

          <ComplaintStatus
            status={complaint.status}
          />

        </div>

      </div>


      {/* Body */}

      <div className="p-6">

        <h3 className="text-xl font-bold text-slate-900">
          {complaint.subject}
        </h3>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

          <ComplaintInfo
            icon={<FaMapMarkerAlt />}
            label="License ID"
            value={complaint.licenseId}
          />

          <ComplaintInfo
            icon={<FaCalendarAlt />}
            label="Submitted On"
            value={
              complaint.createdAt
                ? new Date(
                    complaint.createdAt
                  ).toLocaleDateString("en-IN")
                : "Not available"
            }
          />

        </div>


        {/* Description */}

        <div className="mt-6">

          <p className="text-sm font-semibold text-slate-500 mb-2">
            Description
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">

            <p className="text-slate-700 leading-7 whitespace-pre-wrap">
              {complaint.description}
            </p>

          </div>

        </div>


        {/* Admin Remark */}

        {complaint.adminRemark && (

          <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-5">

            <div className="flex items-center gap-2">

              <FaCheckCircle className="text-emerald-600" />

              <p className="font-bold text-emerald-800">
                Administrator Response
              </p>

            </div>

            <p className="text-emerald-700 mt-2 leading-6">
              {complaint.adminRemark}
            </p>

          </div>

        )}

      </div>

    </div>
  );
}


// ========================================
// COMPLAINT STATUS
// ========================================

function ComplaintStatus({
  status,
}) {
  if (status === "Resolved") {
    return (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-bold">
        <FaCheckCircle />
        Resolved
      </span>
    );
  }

  if (status === "In Progress") {
    return (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm font-bold">
        <FaSpinner />
        In Progress
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-sm font-bold">
      <FaClock />
      Pending
    </span>
  );
}


// ========================================
// COMPLAINT INFO
// ========================================

function ComplaintInfo({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="text-teal-600 mt-1">
        {icon}
      </div>

      <div>

        <p className="text-xs text-slate-400 uppercase tracking-wide">
          {label}
        </p>

        <p className="font-semibold text-slate-800 mt-1">
          {value || "Not provided"}
        </p>

      </div>

    </div>
  );
}
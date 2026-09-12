"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaSyncAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaIdCard,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEnvelope,
} from "react-icons/fa";
import { toast } from "react-toastify";
import API from "../../services/api";

export default function TrackStatusPage() {
  const router = useRouter();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  // =========================
  // GET USER EMAIL
  // =========================

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          toast.error("Please login first.");
          router.push("/login");
          return;
        }

        const user = JSON.parse(storedUser);

        console.log("Logged in user:", user);

        if (!user?.email) {
          toast.error("User email not found.");
          return;
        }

        setEmail(user.email);

        await fetchApplications(user.email);
      } catch (error) {
        console.error("User loading error:", error);

        toast.error("Unable to load your account information.");
      }
    };

    loadUser();
  }, [router]);

  // =========================
  // FETCH APPLICATIONS
  // =========================

  const fetchApplications = async (userEmail = email) => {
    if (!userEmail) return;

    try {
      setLoading(true);

      console.log(
        "Fetching applications for:",
        userEmail
      );

      const response = await API.get(
        `/license/my-applications/${encodeURIComponent(
          userEmail
        )}`
      );

      console.log(
        "Applications response:",
        response.data
      );

      setApplications(response.data || []);

    } catch (error) {
      console.error(
        "Fetch applications error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load applications."
      );

      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // STATUS UI
  // =========================

  const getStatus = (status) => {
    if (status === "Approved") {
      return (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-bold">
          <FaCheckCircle />
          Approved
        </span>
      );
    }

    if (status === "Rejected") {
      return (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 font-bold">
          <FaTimesCircle />
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-bold">
        <FaClock />
        Pending
      </span>
    );
  };

  // =========================
  // LOADING
  // =========================

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

  // =========================
  // PAGE
  // =========================

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-5">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>

            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-900 mb-4"
            >
              <FaArrowLeft />
              Back to Dashboard
            </button>

            <p className="text-sm uppercase tracking-wider font-bold text-teal-700">
              Application Tracking
            </p>

            <h1 className="text-4xl font-extrabold text-slate-900 mt-2">
              My Applications
            </h1>

            <p className="text-slate-500 mt-2">
              Track your Tourism Guide License applications.
            </p>

          </div>

          <button
            onClick={() => fetchApplications(email)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-800 transition"
          >
            <FaSyncAlt />
            Refresh
          </button>

        </div>

        {/* EMAIL */}

        {email && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <FaEnvelope />
              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Applications linked to
                </p>

                <p className="font-bold text-slate-900">
                  {email}
                </p>

              </div>

            </div>

          </div>
        )}

        {/* NO APPLICATION */}

        {applications.length === 0 ? (

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-3xl">
              📄
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-5">
              No Applications Found
            </h2>

            <p className="text-slate-500 mt-2">
              We could not find any Tourism Guide License
              applications associated with your email.
            </p>

            <button
              onClick={() => router.push("/apply-license")}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-teal-700 to-emerald-600 text-white rounded-xl font-bold hover:from-teal-800 hover:to-emerald-700 transition"
            >
              Apply for License
            </button>

          </div>

        ) : (

          <div className="space-y-6">

            {applications.map((application) => (

              <div
                key={application._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >

                {/* CARD HEADER */}

                <div className="bg-gradient-to-r from-teal-800 to-emerald-600 p-6">

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                      <p className="text-teal-100 text-sm">
                        Tourism Guide License Application
                      </p>

                      <h2 className="text-2xl font-bold text-white mt-1">
                        {application.fullName}
                      </h2>

                    </div>

                    {getStatus(application.status)}

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
                      highlight={application.status === "Approved"}
                    />

                    <Info
                      icon={<FaMapMarkerAlt />}
                      label="Tourist Region"
                      value={application.touristRegion}
                    />

                    <Info
                      icon={<FaEnvelope />}
                      label="Email"
                      value={application.email}
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
                              month: "short",
                              year: "numeric",
                            })
                          : "Not available"
                      }
                    />

                    <Info
                      icon={<FaCheckCircle />}
                      label="Current Status"
                      value={application.status || "Pending"}
                    />

                  </div>

                  {/* APPROVED */}

                  {application.status === "Approved" && (

                    <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-6">

                      <div className="flex items-start gap-4">

                        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">
                          <FaCheckCircle />
                        </div>

                        <div>

                          <h3 className="font-bold text-emerald-900 text-lg">
                            License Approved Successfully
                          </h3>

                          <p className="text-emerald-700 mt-1">
                            Your Tourism Guide License has been
                            approved by the administrator.
                          </p>

                          <div className="mt-4">

                            <p className="text-sm text-emerald-700">
                              Your License ID
                            </p>

                            <p className="text-2xl font-extrabold text-emerald-900 tracking-wide">
                              {application.licenseId}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  )}

                  {/* PENDING */}

                  {application.status === "Pending" && (

                    <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5">

                      <p className="font-bold text-amber-900">
                        Application Under Review
                      </p>

                      <p className="text-amber-700 text-sm mt-1">
                        Your application has been submitted successfully
                        and is waiting for administrator approval.
                      </p>

                    </div>

                  )}

                  {/* REJECTED */}

                  {application.status === "Rejected" && (

                    <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-5">

                      <p className="font-bold text-red-900">
                        Application Rejected
                      </p>

                      <p className="text-red-700 text-sm mt-1">
                        Unfortunately, your license application was
                        rejected by the administrator.
                      </p>

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


// =========================
// INFO COMPONENT
// =========================

function Info({
  icon,
  label,
  value,
  highlight = false,
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "bg-emerald-50 border-emerald-200"
          : "bg-slate-50 border-slate-200"
      }`}
    >

      <div className="flex items-center gap-3">

        <div
          className={`text-lg ${
            highlight
              ? "text-emerald-600"
              : "text-teal-700"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-sm text-slate-500">
            {label}
          </p>

          <p
            className={`font-semibold break-words ${
              highlight
                ? "text-emerald-900"
                : "text-slate-900"
            }`}
          >
            {value || "Not provided"}
          </p>

        </div>

      </div>

    </div>
  );
}
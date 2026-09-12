"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSyncAlt,
} from "react-icons/fa";
import API from "../../services/api";

export default function MyRenewalsPage() {
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRenewals = async () => {
    try {
      setLoading(true);
      setError("");

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.email) {
        setError("Please login to view your renewal requests.");
        return;
      }

      const response = await API.get(
        `/renewal/my-renewals/${encodeURIComponent(user.email)}`
      );

      setRenewals(response.data || []);
    } catch (error) {
      console.error("Fetch renewals error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load renewal requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRenewals();
  }, []);

  const pendingCount = renewals.filter(
    (item) => item.status === "Pending"
  ).length;

  const approvedCount = renewals.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedCount = renewals.filter(
    (item) => item.status === "Rejected"
  ).length;

  const getStatus = (status) => {
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

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <div className="bg-white border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-6 py-8">

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-900 transition"
          >
            <FaArrowLeft />
            Back to Dashboard
          </Link>

          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <p className="text-sm font-semibold text-teal-700 uppercase tracking-wider">
                License Services
              </p>

              <h1 className="text-4xl font-extrabold text-slate-900 mt-2">
                My Renewals
              </h1>

              <p className="text-slate-500 mt-2">
                View and track your tourism guide license renewal requests.
              </p>

            </div>

            <button
              onClick={fetchRenewals}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-800 transition"
            >
              <FaSyncAlt />
              Refresh
            </button>

          </div>

        </div>

      </div>

      {/* CONTENT */}

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* STATISTICS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <p className="text-sm text-slate-500 font-medium">
              Total Renewals
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              {renewals.length}
            </h2>

          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <p className="text-sm text-slate-500 font-medium">
              Pending
            </p>

            <h2 className="text-3xl font-bold text-amber-600 mt-2">
              {pendingCount}
            </h2>

          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <p className="text-sm text-slate-500 font-medium">
              Approved
            </p>

            <h2 className="text-3xl font-bold text-emerald-600 mt-2">
              {approvedCount}
            </h2>

          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <p className="text-sm text-slate-500 font-medium">
              Rejected
            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {rejectedCount}
            </h2>

          </div>

        </div>

        {/* ERROR */}

        {error && (

          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-5">

            <p className="text-red-700 font-semibold">
              {error}
            </p>

          </div>

        )}

        {/* LOADING */}

        {loading ? (

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">

            <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="mt-4 text-slate-500 font-medium">
              Loading your renewal requests...
            </p>

          </div>

        ) : renewals.length === 0 ? (

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">

            <div className="text-6xl mb-5">
              ♻️
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              No Renewal Requests
            </h2>

            <p className="text-slate-500 mt-2">
              You haven't submitted any license renewal requests yet.
            </p>

            <Link
              href="/renew-license"
              className="inline-block mt-6 px-6 py-3 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-800 transition"
            >
              Renew License
            </Link>

          </div>

        ) : (

          <div className="space-y-6">

            {renewals.map((renewal) => (

              <div
                key={renewal._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >

                {/* CARD HEADER */}

                <div className="bg-gradient-to-r from-teal-700 to-emerald-600 px-6 py-5">

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                      <p className="text-teal-100 text-sm">
                        License Renewal Request
                      </p>

                      <h2 className="text-2xl font-bold text-white mt-1">
                        {renewal.fullName}
                      </h2>

                    </div>

                    {getStatus(renewal.status)}

                  </div>

                </div>

                {/* DETAILS */}

                <div className="p-6">

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                    <Detail
                      label="License ID"
                      value={renewal.licenseId}
                    />

                    <Detail
                      label="Email"
                      value={renewal.email}
                    />

                    <Detail
                      label="Phone"
                      value={renewal.phone}
                    />

                    <Detail
                      label="Current Region"
                      value={renewal.currentRegion}
                    />

                    <Detail
                      label="Reason"
                      value={renewal.reason}
                    />

                    <Detail
                      label="Submitted On"
                      value={
                        renewal.createdAt
                          ? new Date(
                              renewal.createdAt
                            ).toLocaleDateString("en-IN")
                          : "Not available"
                      }
                    />

                  </div>

                  {/* ADMIN REMARK */}

                  {renewal.adminRemark && (

                    <div className="mt-6 p-5 bg-teal-50 border border-teal-200 rounded-xl">

                      <p className="text-sm font-semibold text-teal-700">
                        Administrator Remark
                      </p>

                      <p className="text-teal-900 mt-1">
                        {renewal.adminRemark}
                      </p>

                    </div>

                  )}

                  {/* RENEWAL DATE */}

                  {renewal.status === "Approved" &&
                    renewal.renewalDate && (

                    <div className="mt-6 p-5 bg-emerald-50 border border-emerald-200 rounded-xl">

                      <p className="text-sm font-semibold text-emerald-700">
                        Renewal Approved On
                      </p>

                      <p className="text-emerald-900 font-bold mt-1">
                        {new Date(
                          renewal.renewalDate
                        ).toLocaleDateString("en-IN")}
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

function Detail({ label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">

      <p className="text-sm text-slate-500 mb-1">
        {label}
      </p>

      <p className="font-semibold text-slate-900 break-words">
        {value || "Not provided"}
      </p>

    </div>
  );
}
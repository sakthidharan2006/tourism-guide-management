"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaSyncAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaEye,
  FaTimes,
  FaRedo,
} from "react-icons/fa";
import { toast } from "react-toastify";
import API from "../../../services/api";

export default function AdminRenewalsPage() {
  const router = useRouter();

  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedRenewal, setSelectedRenewal] = useState(null);
  const [search, setSearch] = useState("");

  // =========================
  // FETCH RENEWALS
  // =========================

  const fetchRenewals = async () => {
    try {
      setLoading(true);

      const response = await API.get(
        "/renewal/all"
      );

      setRenewals(response.data || []);

    } catch (error) {
      console.error(
        "Fetch renewals error:",
        error
      );

      toast.error(
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

  // =========================
  // APPROVE
  // =========================

  const handleApprove = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this renewal request?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);

      const response = await API.put(
        `/renewal/approve/${id}`
      );

      toast.success(
        response.data?.message ||
          "Renewal approved successfully."
      );

      await fetchRenewals();

      setSelectedRenewal(null);

    } catch (error) {
      console.error(
        "Approve renewal error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to approve renewal."
      );

    } finally {
      setProcessingId(null);
    }
  };

  // =========================
  // REJECT
  // =========================

  const handleReject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this renewal request?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);

      const response = await API.put(
        `/renewal/reject/${id}`,
        {
          adminRemark:
            "Renewal request rejected by administrator.",
        }
      );

      toast.success(
        response.data?.message ||
          "Renewal rejected successfully."
      );

      await fetchRenewals();

      setSelectedRenewal(null);

    } catch (error) {
      console.error(
        "Reject renewal error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to reject renewal."
      );

    } finally {
      setProcessingId(null);
    }
  };

  // =========================
  // FILTER
  // =========================

  const filteredRenewals = renewals.filter(
    (renewal) => {
      const text = search.toLowerCase();

      return (
        renewal.fullName
          ?.toLowerCase()
          .includes(text) ||
        renewal.email
          ?.toLowerCase()
          .includes(text) ||
        renewal.licenseId
          ?.toLowerCase()
          .includes(text) ||
        renewal.status
          ?.toLowerCase()
          .includes(text)
      );
    }
  );

  // =========================
  // STATISTICS
  // =========================

  const total = renewals.length;

  const pending = renewals.filter(
    (item) => item.status === "Pending"
  ).length;

  const approved = renewals.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejected = renewals.filter(
    (item) => item.status === "Rejected"
  ).length;

  // =========================
  // STATUS BADGE
  // =========================

  const statusBadge = (status) => {
    if (status === "Approved") {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
          <FaCheckCircle />
          Approved
        </span>
      );
    }

    if (status === "Rejected") {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
          <FaTimesCircle />
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">
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
            Loading renewal requests...
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8">

          <button
            onClick={() =>
              router.push("/admin")
            }
            className="flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-900 mb-5"
          >
            <FaArrowLeft />
            Back to Admin Dashboard
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <p className="text-sm font-semibold text-teal-700 uppercase tracking-wider">
                License Management
              </p>

              <h1 className="text-4xl font-extrabold text-slate-900 mt-2">
                Renewal Management
              </h1>

              <p className="text-slate-500 mt-2">
                Review and manage Tourism Guide License renewal requests.
              </p>

            </div>

            <button
              onClick={fetchRenewals}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-800 transition"
            >
              <FaSyncAlt />
              Refresh
            </button>

          </div>

        </div>

        {/* =========================
            STATISTICS
        ========================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <StatCard
            label="Total Renewals"
            value={total}
            icon={<FaRedo />}
            bg="bg-blue-100"
            text="text-blue-600"
          />

          <StatCard
            label="Pending"
            value={pending}
            icon={<FaClock />}
            bg="bg-amber-100"
            text="text-amber-600"
          />

          <StatCard
            label="Approved"
            value={approved}
            icon={<FaCheckCircle />}
            bg="bg-emerald-100"
            text="text-emerald-600"
          />

          <StatCard
            label="Rejected"
            value={rejected}
            icon={<FaTimesCircle />}
            bg="bg-red-100"
            text="text-red-600"
          />

        </div>

        {/* =========================
            TABLE
        ========================= */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

          {/* SEARCH */}

          <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Renewal Requests
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Review submitted license renewal applications.
              </p>

            </div>

            <div className="relative w-full md:w-80">

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search renewals..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
              />

            </div>

          </div>

          {/* TABLE */}

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
                    Region
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

                {filteredRenewals.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center"
                    >

                      <FaRedo className="mx-auto text-4xl text-slate-300 mb-3" />

                      <p className="text-slate-600 font-semibold">
                        No renewal requests found
                      </p>

                      <p className="text-slate-400 text-sm mt-1">
                        Submitted renewal requests will appear here.
                      </p>

                    </td>

                  </tr>

                ) : (

                  filteredRenewals.map(
                    (renewal) => (

                      <tr
                        key={renewal._id}
                        className="hover:bg-slate-50 transition"
                      >

                        {/* APPLICANT */}

                        <td className="px-6 py-5">

                          <p className="font-semibold text-slate-900">
                            {renewal.fullName}
                          </p>

                          <p className="text-sm text-slate-500 mt-1">
                            {renewal.email}
                          </p>

                        </td>

                        {/* LICENSE */}

                        <td className="px-6 py-5">

                          <span className="font-bold text-teal-700">
                            {renewal.licenseId}
                          </span>

                        </td>

                        {/* REGION */}

                        <td className="px-6 py-5">

                          <span className="text-slate-700">
                            {renewal.currentRegion}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">
                          {statusBadge(
                            renewal.status
                          )}
                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2">

                            <button
                              onClick={() =>
                                setSelectedRenewal(
                                  renewal
                                )
                              }
                              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm"
                            >
                              <FaEye />
                              View
                            </button>

                            {renewal.status ===
                              "Pending" && (
                              <>
                                <button
                                  disabled={
                                    processingId ===
                                    renewal._id
                                  }
                                  onClick={() =>
                                    handleApprove(
                                      renewal._id
                                    )
                                  }
                                  className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm disabled:opacity-50"
                                >
                                  Approve
                                </button>

                                <button
                                  disabled={
                                    processingId ===
                                    renewal._id
                                  }
                                  onClick={() =>
                                    handleReject(
                                      renewal._id
                                    )
                                  }
                                  className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                          </div>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* =========================
          MODAL
      ========================= */}

      {selectedRenewal && (

        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-5">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Renewal Details
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Review renewal request information.
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedRenewal(null)
                }
                className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <FaTimes />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="p-6 space-y-5">

              <Detail
                label="Full Name"
                value={
                  selectedRenewal.fullName
                }
              />

              <Detail
                label="Email"
                value={selectedRenewal.email}
              />

              <Detail
                label="License ID"
                value={
                  selectedRenewal.licenseId
                }
              />

              <Detail
                label="Phone"
                value={
                  selectedRenewal.phone
                }
              />

              <Detail
                label="Current Region"
                value={
                  selectedRenewal.currentRegion
                }
              />

              <Detail
                label="Renewal Reason"
                value={
                  selectedRenewal.reason
                }
              />

              <Detail
                label="Submitted On"
                value={
                  selectedRenewal.createdAt
                    ? new Date(
                        selectedRenewal.createdAt
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : "Not available"
                }
              />

              <div>

                <p className="text-sm font-semibold text-slate-500 mb-2">
                  Current Status
                </p>

                {statusBadge(
                  selectedRenewal.status
                )}

              </div>

              {selectedRenewal.adminRemark && (

                <div>

                  <p className="text-sm font-semibold text-slate-500 mb-2">
                    Admin Remark
                  </p>

                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-teal-900">
                    {selectedRenewal.adminRemark}
                  </div>

                </div>

              )}

            </div>

            {/* MODAL FOOTER */}

            <div className="px-6 py-5 border-t border-slate-200 flex flex-wrap justify-end gap-3">

              {selectedRenewal.status ===
                "Pending" && (
                <>
                  <button
                    disabled={
                      processingId ===
                      selectedRenewal._id
                    }
                    onClick={() =>
                      handleApprove(
                        selectedRenewal._id
                      )
                    }
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50"
                  >
                    <FaCheckCircle />
                    Approve Renewal
                  </button>

                  <button
                    disabled={
                      processingId ===
                      selectedRenewal._id
                    }
                    onClick={() =>
                      handleReject(
                        selectedRenewal._id
                      )
                    }
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50"
                  >
                    <FaTimesCircle />
                    Reject Renewal
                  </button>
                </>
              )}

              <button
                onClick={() =>
                  setSelectedRenewal(null)
                }
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}


// =========================
// STAT CARD
// =========================

function StatCard({
  label,
  value,
  icon,
  bg,
  text,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mt-2">
            {value}
          </h2>

        </div>

        <div
          className={`w-12 h-12 rounded-xl ${bg} ${text} flex items-center justify-center`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}


// =========================
// DETAIL
// =========================

function Detail({ label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">

      <p className="text-sm font-semibold text-slate-500 mb-1">
        {label}
      </p>

      <p className="font-semibold text-slate-900 break-words">
        {value || "Not provided"}
      </p>

    </div>
  );
}
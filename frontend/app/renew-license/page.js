"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaSyncAlt,
  FaCheckCircle,
  FaIdCard,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaRedo,
} from "react-icons/fa";
import { toast } from "react-toastify";
import API from "../../services/api";

export default function RenewLicensePage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    licenseId: "",
    phone: "",
    currentRegion: "",
    reason: "License Renewal",
  });

  const [renewals, setRenewals] = useState([]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        toast.error("Please login first.");
        router.push("/login");
        return;
      }

      const user = JSON.parse(storedUser);

      setEmail(user.email);

      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        licenseId: "",
        phone: user.phone || "",
        currentRegion: "",
        reason: "License Renewal",
      });

      await fetchRenewals(user.email);

    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to load your account."
      );

    } finally {
      setLoading(false);
    }
  };

  const fetchRenewals = async (userEmail) => {
    try {
      const response = await API.get(
        `/renewal/my-renewals/${encodeURIComponent(
          userEmail
        )}`
      );

      setRenewals(response.data || []);

    } catch (error) {
      console.error(
        "Fetch renewals error:",
        error
      );
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.licenseId ||
      !formData.phone ||
      !formData.currentRegion
    ) {
      toast.error(
        "Please fill in all required fields."
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await API.post(
        "/renewal/apply",
        formData
      );

      toast.success(
        response.data?.message ||
          "Renewal request submitted successfully."
      );

      await fetchRenewals(email);

      setFormData({
        ...formData,
        licenseId: "",
        currentRegion: "",
      });

    } catch (error) {
      console.error(
        "Renewal submission error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to submit renewal request."
      );

    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">

          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-600 font-semibold">
            Loading renewal service...
          </p>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-5">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">

          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-900 mb-5"
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>

          <p className="text-sm uppercase tracking-wider text-teal-700 font-bold">
            License Services
          </p>

          <h1 className="text-4xl font-extrabold text-slate-900 mt-2">
            Renew Tourism Guide License
          </h1>

          <p className="text-slate-500 mt-2">
            Submit a renewal request for your approved Tourism
            Guide License.
          </p>

        </div>

        {/* FORM */}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="bg-gradient-to-r from-teal-800 to-emerald-600 p-7">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl">
                <FaRedo />
              </div>

              <div>

                <h2 className="text-2xl font-bold text-white">
                  Renewal Application
                </h2>

                <p className="text-teal-100 mt-1">
                  Enter your existing license details.
                </p>

              </div>

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="p-7"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <Input
                icon={<FaIdCard />}
                label="License ID"
                name="licenseId"
                value={formData.licenseId}
                onChange={handleChange}
                placeholder="Example: TG-2026-1234"
              />

              <Input
                icon={<FaEnvelope />}
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your registered email"
                disabled
              />

              <Input
                icon={<FaIdCard />}
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full name"
              />

              <Input
                icon={<FaPhone />}
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
              />

              <Input
                icon={<FaMapMarkerAlt />}
                label="Current Tourist Region"
                name="currentRegion"
                value={formData.currentRegion}
                onChange={handleChange}
                placeholder="Current tourism region"
              />

            </div>

            <div className="mt-7">

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Renewal Reason
              </label>

              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="4"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />

            </div>

            <div className="mt-7 flex justify-end">

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-teal-700 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:from-teal-800 hover:to-emerald-700 transition disabled:opacity-50"
              >

                {submitting ? (
                  <>
                    <FaSyncAlt className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Submit Renewal
                  </>
                )}

              </button>

            </div>

          </form>

        </div>

        {/* PREVIOUS RENEWALS */}

        <div className="mt-8">

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            My Renewal Requests
          </h2>

          {renewals.length === 0 ? (

            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
              No renewal requests found.
            </div>

          ) : (

            <div className="space-y-4">

              {renewals.map((renewal) => (

                <div
                  key={renewal._id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                      <p className="text-sm text-slate-500">
                        License ID
                      </p>

                      <p className="font-bold text-slate-900">
                        {renewal.licenseId}
                      </p>

                    </div>

                    <Status
                      status={renewal.status}
                    />

                  </div>

                  {renewal.adminRemark && (
                    <div className="mt-4 bg-slate-50 rounded-xl p-4 text-slate-700">
                      <strong>Admin Remark:</strong>{" "}
                      {renewal.adminRemark}
                    </div>
                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </main>
  );
}


// =========================
// INPUT
// =========================

function Input({
  icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
}) {
  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <div className="flex items-center gap-3 border border-slate-300 rounded-xl px-4 py-3 bg-white focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100">

        <span className="text-teal-700">
          {icon}
        </span>

        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full outline-none bg-transparent text-slate-900 placeholder:text-slate-400 disabled:text-slate-500"
        />

      </div>

    </div>
  );
}


// =========================
// STATUS
// =========================

function Status({ status }) {
  if (status === "Approved") {
    return (
      <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-bold">
        ✓ Approved
      </span>
    );
  }

  if (status === "Rejected") {
    return (
      <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-bold">
        ✕ Rejected
      </span>
    );
  }

  return (
    <span className="px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-bold">
      ◷ Pending
    </span>
  );
}
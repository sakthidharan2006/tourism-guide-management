"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaGraduationCap,
  FaBriefcase,
  FaMapMarkerAlt,
  FaGlobeAsia,
  FaArrowLeft,
  FaPaperPlane,
} from "react-icons/fa";
import API from "../../services/api";

export default function ApplyLicensePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    aadhaar: "",
    qualification: "",
    experience: "",
    address: "",
    touristRegion: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =========================
    // VALIDATION
    // =========================

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.aadhaar ||
      !formData.qualification ||
      !formData.experience ||
      !formData.address ||
      !formData.touristRegion
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (formData.aadhaar.length !== 12) {
      toast.error("Aadhaar number must contain 12 digits.");
      return;
    }

    try {
      setLoading(true);

      console.log("Submitting license application:", formData);

      const response = await API.post(
        "/license/apply",
        {
          ...formData,
          experience: Number(formData.experience),
        }
      );

      console.log("Application response:", response.data);

      toast.success(
        response.data?.message ||
          "License application submitted successfully."
      );

      // Clear form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        aadhaar: "",
        qualification: "",
        experience: "",
        address: "",
        touristRegion: "",
      });

      // Redirect after successful submission
      setTimeout(() => {
        router.push("/track-status");
      }, 1200);

    } catch (error) {
      console.error("License application error:", error);

      console.error("Server response:", error.response?.data);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong while submitting the application."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-5">

      <div className="max-w-5xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="mb-8">

          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-900 transition mb-5"
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>

          <div className="bg-gradient-to-r from-teal-800 to-emerald-600 rounded-2xl p-8 text-white shadow-lg">

            <p className="text-teal-100 text-sm uppercase tracking-wider font-semibold">
              Tourism Guide License
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mt-2">
              Apply for a New License
            </h1>

            <p className="text-teal-50 mt-3 max-w-2xl">
              Complete the application form below to submit your
              Tourism Guide License request.
            </p>

          </div>

        </div>

        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
        >

          {/* Personal Information */}

          <div className="p-6 md:p-8">

            <div className="mb-6">

              <h2 className="text-xl font-bold text-slate-900">
                Personal Information
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                Enter your personal details accurately.
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <InputField
                icon={<FaUser />}
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />

              <InputField
                icon={<FaEnvelope />}
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />

              <InputField
                icon={<FaPhone />}
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />

              <InputField
                icon={<FaIdCard />}
                label="Aadhaar Number"
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleChange}
                placeholder="Enter 12-digit Aadhaar number"
                maxLength={12}
              />

            </div>

          </div>

          <div className="border-t border-slate-200" />

          {/* Professional Information */}

          <div className="p-6 md:p-8">

            <div className="mb-6">

              <h2 className="text-xl font-bold text-slate-900">
                Professional Information
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                Provide your educational and professional details.
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <InputField
                icon={<FaGraduationCap />}
                label="Qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="Example: B.Tech / B.A / M.A"
              />

              <InputField
                icon={<FaBriefcase />}
                label="Experience"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Years of experience"
                min="0"
              />

            </div>

          </div>

          <div className="border-t border-slate-200" />

          {/* Location Information */}

          <div className="p-6 md:p-8">

            <div className="mb-6">

              <h2 className="text-xl font-bold text-slate-900">
                Tourism Details
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                Tell us about your preferred tourism region.
              </p>

            </div>

            <div className="space-y-6">

              <InputField
                icon={<FaMapMarkerAlt />}
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
              />

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tourist Region
                </label>

                <div className="flex items-center border border-slate-300 rounded-xl px-4 py-3 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100 transition">

                  <FaGlobeAsia className="text-teal-700 mr-3" />

                  <select
                    name="touristRegion"
                    value={formData.touristRegion}
                    onChange={handleChange}
                    className="w-full bg-white text-slate-900 outline-none"
                  >

                    <option value="">
                      Select tourism region
                    </option>

                    <option value="Chennai">
                      Chennai
                    </option>

                    <option value="Madurai">
                      Madurai
                    </option>

                    <option value="Coimbatore">
                      Coimbatore
                    </option>

                    <option value="Ooty">
                      Ooty
                    </option>

                    <option value="Kanyakumari">
                      Kanyakumari
                    </option>

                    <option value="Thanjavur">
                      Thanjavur
                    </option>

                    <option value="Rameswaram">
                      Rameswaram
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

              </div>

            </div>

          </div>

          {/* ================= FOOTER ================= */}

          <div className="bg-slate-50 border-t border-slate-200 p-6 md:p-8">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div>

                <p className="font-semibold text-slate-800">
                  Review your information
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Make sure all details are correct before submitting.
                </p>

              </div>

              <button
                type="submit"
                disabled={loading}
                className={`flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl text-white font-bold shadow-lg transition ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 hover:-translate-y-0.5"
                }`}
              >

                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Submit Application
                  </>
                )}

              </button>

            </div>

          </div>

        </form>

      </div>

    </main>
  );
}


// =========================
// INPUT COMPONENT
// =========================

function InputField({
  icon,
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  maxLength,
  min,
}) {
  return (
    <div>

      <label
        htmlFor={name}
        className="block text-sm font-semibold text-slate-700 mb-2"
      >
        {label}
      </label>

      <div className="flex items-center border border-slate-300 rounded-xl px-4 py-3 bg-white focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100 transition">

        <span className="text-teal-700 mr-3">
          {icon}
        </span>

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          min={min}
          className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 outline-none"
        />

      </div>

    </div>
  );
}
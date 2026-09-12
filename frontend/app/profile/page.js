"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaSignOutAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import API from "../../services/api";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  // Password states
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);

  // =========================================
  // LOAD USER
  // =========================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);

      setFormData({
        name: parsedUser.name || parsedUser.fullName || "",
        phone: parsedUser.phone || "",
      });
    } catch (error) {
      console.error("User data error:", error);

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      router.push("/login");
    }
  }, [router]);

  // =========================================
  // HANDLE PROFILE INPUT
  // =========================================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================================
  // UPDATE PROFILE
  // =========================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    try {
      setLoading(true);

      const res = await API.put(
        `/auth/profile/${user._id || user.id}`,
        {
          name: formData.name,
          phone: formData.phone,
        }
      );

      const updatedUser = res.data.user;

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);

      setFormData({
        name: updatedUser.name || updatedUser.fullName || "",
        phone: updatedUser.phone || "",
      });

      setEditing(false);

      toast.success(
        res.data.message || "Profile updated successfully"
      );
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // CANCEL PROFILE EDIT
  // =========================================

  const handleCancelEdit = () => {
    setEditing(false);

    setFormData({
      name: user.name || user.fullName || "",
      phone: user.phone || "",
    });
  };

  // =========================================
  // PASSWORD INPUT
  // =========================================

  const handlePasswordInput = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================================
  // CHANGE PASSWORD
  // =========================================

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordData;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      toast.error("Please fill all password fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "New password must contain at least 6 characters"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error(
        "New password must be different from current password"
      );
      return;
    }

    try {
      setPasswordLoading(true);

      const res = await API.put(
        `/auth/change-password/${user._id || user.id}`,
        {
          currentPassword,
          newPassword,
        }
      );

      toast.success(
        res.data?.message ||
          "Password changed successfully"
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswordSection(false);

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // =========================================
  // CANCEL PASSWORD
  // =========================================

  const handleCancelPassword = () => {
    setShowPasswordSection(false);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    setTimeout(() => {
      router.push("/login");
    }, 800);
  };

  // =========================================
  // LOADING
  // =========================================

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-11 h-11 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-600 font-medium">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  const displayName =
    user.name ||
    user.fullName ||
    "Tourism Guide";

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =========================================
          TOP HEADER
      ========================================= */}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-900 transition"
          >
            <FaArrowLeft className="text-sm" />
            <span>Back to Dashboard</span>
          </Link>

        </div>

      </header>

      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* PAGE INTRO */}

        <div className="mb-8">

          <p className="text-xs sm:text-sm font-bold text-teal-700 uppercase tracking-[0.15em]">
            Account Management
          </p>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
            My Profile
          </h1>

          <p className="text-slate-500 mt-2 max-w-2xl text-sm sm:text-base">
            View and manage your Tourism Guide account
            information and security settings.
          </p>

        </div>

        {/* =========================================
            PROFILE CARD
        ========================================= */}

        <section className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

          {/* PROFILE HEADER */}

          <div className="bg-gradient-to-r from-[#0f3d56] via-teal-700 to-emerald-600 px-5 sm:px-8 py-8 sm:py-10">

            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">

              {/* AVATAR */}

              <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">

                <FaUser className="text-white text-3xl sm:text-4xl" />

              </div>

              {/* USER INFO */}

              <div className="min-w-0">

                <p className="text-teal-100 text-xs sm:text-sm font-semibold uppercase tracking-wider">
                  Tourism Guide Account
                </p>

                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 break-words">
                  {displayName}
                </h2>

                <p className="text-teal-50 mt-1.5 text-sm sm:text-base break-all">
                  {user.email || "No email available"}
                </p>

              </div>

            </div>

          </div>

          {/* =========================================
              PERSONAL INFORMATION
          ========================================= */}

          <div className="p-5 sm:p-8">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Personal Information
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Manage your basic account information.
                </p>
              </div>

              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold shadow-sm"
                >
                  <FaEdit />
                  Edit Profile
                </button>
              )}

            </div>

            {/* =========================================
                EDIT FORM
            ========================================= */}

            {editing ? (

              <form
                onSubmit={handleUpdate}
                className="space-y-5"
              >

                {/* FULL NAME */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>

                  <div className="flex items-center border border-slate-300 rounded-xl px-4 py-3 bg-white focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100">

                    <FaUser className="text-teal-700 mr-3 shrink-0" />

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full outline-none text-slate-900 bg-transparent"
                      placeholder="Enter your full name"
                    />

                  </div>

                </div>

                {/* EMAIL */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>

                  <div className="flex items-center border border-slate-200 bg-slate-100 rounded-xl px-4 py-3">

                    <FaEnvelope className="text-slate-400 mr-3 shrink-0" />

                    <input
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="w-full bg-transparent outline-none text-slate-500 cursor-not-allowed"
                    />

                  </div>

                  <p className="text-xs text-slate-400 mt-2">
                    Email address cannot be changed here.
                  </p>

                </div>

                {/* PHONE */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number
                  </label>

                  <div className="flex items-center border border-slate-300 rounded-xl px-4 py-3 bg-white focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100">

                    <FaPhone className="text-teal-700 mr-3 shrink-0" />

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full outline-none text-slate-900 bg-transparent"
                      placeholder="Enter phone number"
                    />

                  </div>

                </div>

                {/* ACTIONS */}

                <div className="flex flex-col sm:flex-row gap-3 pt-3">

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50"
                  >

                    <FaSave />

                    {loading
                      ? "Saving..."
                      : "Save Changes"}

                  </button>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                  >

                    <FaTimes />
                    Cancel

                  </button>

                </div>

              </form>

            ) : (

              /* =========================================
                 VIEW PROFILE
              ========================================= */

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <ProfileField
                  icon={<FaUser />}
                  label="Full Name"
                  value={displayName}
                />

                <ProfileField
                  icon={<FaEnvelope />}
                  label="Email Address"
                  value={
                    user.email || "Not provided"
                  }
                />

                <ProfileField
                  icon={<FaPhone />}
                  label="Phone Number"
                  value={
                    user.phone || "Not provided"
                  }
                />

                <ProfileField
                  icon={<FaIdCard />}
                  label="Account ID"
                  value={
                    user._id ||
                    user.id ||
                    "Not available"
                  }
                />

              </div>

            )}

          </div>

        </section>

        {/* =========================================
            PASSWORD & SECURITY
        ========================================= */}

        <section className="mt-6 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

          <div className="p-5 sm:p-8">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

              <div className="flex gap-4">

                <div className="w-11 h-11 shrink-0 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">

                  <FaShieldAlt />

                </div>

                <div>

                  <h3 className="text-xl font-bold text-slate-900">
                    Password & Security
                  </h3>

                  <p className="text-slate-500 text-sm mt-1">
                    Keep your account secure by regularly
                    updating your password.
                  </p>

                </div>

              </div>

              {!showPasswordSection && (
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswordSection(true)
                  }
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold"
                >
                  <FaKey />
                  Change Password
                </button>
              )}

            </div>

            {/* PASSWORD FORM */}

            {showPasswordSection && (

              <form
                onSubmit={handlePasswordChange}
                className="mt-7 space-y-5 border-t border-slate-100 pt-7"
              >

                <PasswordField
                  label="Current Password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInput}
                  show={showCurrentPassword}
                  setShow={setShowCurrentPassword}
                  placeholder="Enter your current password"
                />

                <PasswordField
                  label="New Password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInput}
                  show={showNewPassword}
                  setShow={setShowNewPassword}
                  placeholder="Enter your new password"
                />

                <PasswordField
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInput}
                  show={showConfirmPassword}
                  setShow={setShowConfirmPassword}
                  placeholder="Confirm your new password"
                />

                <p className="text-sm text-slate-500">
                  Password must contain at least 6 characters.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold disabled:opacity-50"
                  >

                    <FaKey />

                    {passwordLoading
                      ? "Changing..."
                      : "Change Password"}

                  </button>

                  <button
                    type="button"
                    onClick={handleCancelPassword}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                  >

                    <FaTimes />
                    Cancel

                  </button>

                </div>

              </form>

            )}

          </div>

        </section>

        {/* =========================================
            SECURITY NOTICE
        ========================================= */}

        <section className="mt-6 bg-teal-50 border border-teal-100 rounded-2xl p-5 sm:p-6">

          <div className="flex gap-4">

            <div className="w-10 h-10 shrink-0 rounded-xl bg-white text-teal-700 flex items-center justify-center shadow-sm">

              <FaShieldAlt />

            </div>

            <div>

              <h3 className="font-bold text-teal-900">
                Account Security
              </h3>

              <p className="text-teal-800 text-sm mt-2 leading-6">
                Your account information is protected.
                Always remember to log out after using
                the Tourism Guide Management Portal on a
                shared device.
              </p>

            </div>

          </div>

        </section>

        {/* =========================================
            LOGOUT
        ========================================= */}

        {!editing && (

          <div className="mt-6 flex justify-end">

            <button
              type="button"
              onClick={handleLogout}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm"
            >
              <FaSignOutAlt />
              Logout
            </button>

          </div>

        )}

      </div>

    </main>
  );
}

// =========================================
// PROFILE FIELD
// =========================================

function ProfileField({
  icon,
  label,
  value,
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-teal-200 hover:bg-teal-50/30 transition">

      <div className="flex items-center gap-3 mb-2">

        <span className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
          {icon}
        </span>

        <p className="text-sm font-semibold text-slate-500">
          {label}
        </p>

      </div>

      <p className="text-slate-900 font-semibold break-words">
        {value}
      </p>

    </div>
  );
}

// =========================================
// PASSWORD FIELD
// =========================================

function PasswordField({
  label,
  name,
  value,
  onChange,
  show,
  setShow,
  placeholder,
}) {
  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <div className="flex items-center border border-slate-300 rounded-xl px-4 py-3 bg-white focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100">

        <FaKey className="text-teal-700 mr-3 shrink-0" />

        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full outline-none text-slate-900 placeholder:text-slate-400 bg-transparent"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="ml-2 text-slate-400 hover:text-teal-700 transition"
          aria-label={
            show
              ? "Hide password"
              : "Show password"
          }
        >
          {show ? (
            <FaEyeSlash />
          ) : (
            <FaEye />
          )}
        </button>

      </div>

    </div>
  );
}
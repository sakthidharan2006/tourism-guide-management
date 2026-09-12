"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import API from "../../services/api";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    // Validation
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("Login response:", res.data);

      // Store authentication information
      localStorage.setItem("token", res.data.token);

      if (res.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );
      }

      toast.success(
        res.data.message || "Login Successful"
      );

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

    } catch (error) {
      console.error("Login error:", error);

      const message =
        error.response?.data?.message ||
        "Login failed. Please try again.";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* ================= LEFT SIDE ================= */}

        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative hidden md:block min-h-[650px]"
        >

          <Image
            src="/images/tourism-register.jpg"
            alt="Tourism Guide"
            fill
            priority
            className="object-cover"
          />

          {/* Overlay */}

          <div className="absolute inset-0 bg-gradient-to-br from-teal-950/90 via-teal-900/75 to-emerald-800/70" />

          <div className="absolute inset-0 flex flex-col justify-center p-12 text-white">

            <div className="mb-6">

              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">

                <span className="text-3xl font-bold">
                  G
                </span>

              </div>

            </div>

            <h1 className="text-5xl font-extrabold leading-tight">
              Tourism Guide
              <br />
              Management Portal
            </h1>

            <p className="mt-6 text-lg text-teal-50 leading-8 max-w-md">
              Access your account to apply for licenses,
              renew existing licenses, track applications,
              and manage tourism-related services.
            </p>

            <div className="mt-8 flex items-center gap-3">

              <div className="h-1 w-12 bg-emerald-400 rounded-full" />

              <span className="text-sm text-teal-100">
                Secure • Reliable • Digital
              </span>

            </div>

          </div>

        </motion.div>

        {/* ================= RIGHT SIDE ================= */}

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="p-8 sm:p-10 md:p-12 flex items-center"
        >

          <div className="w-full">

            {/* Heading */}

            <div className="mb-8">

              <p className="text-teal-700 font-semibold text-sm uppercase tracking-wider">
                Welcome Back
              </p>

              <h2 className="text-4xl font-extrabold text-slate-900 mt-2">
                Login
              </h2>

              <p className="text-slate-500 mt-2">
                Sign in to access your Tourism Guide account.
              </p>

            </div>

            {/* Form */}

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* Email */}

              <div>

                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Email Address
                </label>

                <div className="flex items-center border border-slate-300 bg-white rounded-xl px-4 py-3 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100 transition-all">

                  <FaEnvelope className="text-teal-700 mr-3 flex-shrink-0" />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 outline-none"
                  />

                </div>

              </div>

              {/* Password */}

              <div>

                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Password
                </label>

                <div className="flex items-center border border-slate-300 bg-white rounded-xl px-4 py-3 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100 transition-all">

                  <FaLock className="text-teal-700 mr-3 flex-shrink-0" />

                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 outline-none"
                  />

                </div>

              </div>

              {/* Forgot Password */}

              <div className="flex justify-end">

                <Link
                  href="/forgot-password"
                  className="text-sm text-teal-700 font-semibold hover:text-teal-900 hover:underline transition"
                >
                  Forgot Password?
                </Link>

              </div>

              {/* Login Button */}

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl py-3.5 text-lg font-bold text-white shadow-lg transition-all duration-300 ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 hover:-translate-y-0.5 hover:shadow-xl"
                }`}
              >

                {loading ? (
                  <span className="flex items-center justify-center gap-2">

                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

                    Signing In...

                  </span>
                ) : (
                  "Login"
                )}

              </button>

            </form>

            {/* Register */}

            <div className="mt-8 text-center">

              <p className="text-slate-600">

                Don't have an account?{" "}

                <Link
                  href="/register"
                  className="text-teal-700 font-bold hover:text-teal-900 hover:underline transition"
                >
                  Create Account
                </Link>

              </p>

            </div>

            {/* Security Message */}

            <div className="mt-8 bg-teal-50 border border-teal-100 rounded-xl p-4">

              <p className="text-sm text-teal-800 text-center">
                🔒 Your account information is securely
                protected.
              </p>

            </div>

          </div>

        </motion.div>

      </div>

    </div>
  );
}
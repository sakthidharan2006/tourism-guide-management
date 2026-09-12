"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
} from "react-icons/fa";
import { toast } from "react-toastify";
import API from "../../services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
    } = formData;

    // Validation
    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      console.log("Sending registration request...");

      const res = await API.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });

      console.log("Registration response:", res.data);

      toast.success(
        res.data?.message || "Account created successfully!"
      );

      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect to login
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        toast.error(
          error.response.data?.message ||
          "Registration failed"
        );
      } else if (error.request) {
        toast.error(
          "Cannot connect to the backend server. Please make sure the backend is running."
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* =========================
            LEFT SIDE
        ========================== */}

        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative hidden md:block min-h-[650px]"
        >
          <Image
            src="/images/tourism-register.jpg"
            alt="Tourism"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-teal-950/90 via-teal-900/70 to-emerald-800/60 flex flex-col justify-center p-12 text-white">

            <div className="max-w-lg">

              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8">
                <span className="text-3xl font-bold">
                  G
                </span>
              </div>

              <h1 className="text-5xl font-bold leading-tight">
                Tourism Guide Portal
              </h1>

              <p className="mt-6 text-lg leading-8 text-teal-50">
                Apply, renew and track your Tourism Guide
                License through one secure government
                platform.
              </p>

              <div className="mt-8 space-y-3 text-teal-50">

                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                  Secure account management
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                  Online license applications
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                  Application tracking
                </div>

              </div>

            </div>

          </div>
        </motion.div>

        {/* =========================
            RIGHT SIDE
        ========================== */}

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="p-8 md:p-12 flex items-center"
        >

          <div className="w-full max-w-md mx-auto">

            <div className="mb-8">

              <h2 className="text-4xl font-bold text-slate-900">
                Create Account
              </h2>

              <p className="text-slate-600 mt-2">
                Register to access Tourism Guide services.
              </p>

            </div>

            <form
              onSubmit={handleRegister}
              className="space-y-5"
            >

              {/* Full Name */}

              <Input icon={<FaUser />}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Full Name"
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                />
              </Input>

              {/* Email */}

              <Input icon={<FaEnvelope />}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="Email Address"
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                />
              </Input>

              {/* Phone */}

              <Input icon={<FaPhone />}>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  placeholder="Phone Number"
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                />
              </Input>

              {/* Password */}

              <Input icon={<FaLock />}>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  placeholder="Password"
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                />
              </Input>

              {/* Confirm Password */}

              <Input icon={<FaLock />}>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                />
              </Input>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-700 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-teal-800 hover:to-emerald-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              {/* Login */}

              <p className="text-center text-slate-600 pt-2">
                Already have an account?{" "}

                <Link
                  href="/login"
                  className="text-teal-700 font-semibold hover:text-teal-900 hover:underline"
                >
                  Login
                </Link>
              </p>

            </form>

          </div>

        </motion.div>

      </div>

    </div>
  );
}

/* =========================================
   INPUT COMPONENT
========================================= */

function Input({ icon, children }) {
  return (
    <div className="flex items-center border border-slate-300 bg-white rounded-xl px-4 py-3.5 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100 transition-all duration-300">

      <div className="text-teal-700 mr-3 text-lg flex-shrink-0">
        {icon}
      </div>

      {children}

    </div>
  );
}
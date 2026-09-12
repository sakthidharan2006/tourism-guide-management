"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative hidden md:flex"
        >
          <Image
            src="/images/tourism-register.jpg"
            alt="Tourism"
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-teal-900/60 flex flex-col justify-center p-10 text-white">

            <h1 className="text-5xl font-bold leading-tight">
              Tourism Guide Portal
            </h1>

            <p className="mt-6 text-lg">
              Apply, Renew and Track Tourism Guide Licenses through one secure government portal.
            </p>

          </div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="p-10"
        >
          {children}
        </motion.div>

      </div>

    </div>
  );
}
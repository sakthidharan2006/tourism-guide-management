"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-teal-50 via-white to-emerald-50 min-h-screen flex items-center">

      <div className="container mx-auto px-6 lg:px-12">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .8 }}
          >

            <span className="inline-block bg-teal-100 text-teal-700 px-5 py-2 rounded-full font-semibold">
              🇮🇳 Government Tourism Portal
            </span>

            <h1 className="mt-8 text-4xl md:text-5xl xl:text-6xl font-bold leading-tight text-slate-900">

              Tourism Guide

              <span className="block text-teal-700">
                License Management
              </span>

            </h1>

            <p className="mt-6 text-lg text-slate-600 leading-8 max-w-xl">

              Apply for a new Tourism Guide License,
              renew your existing license,
              track applications,
              and manage complaints from one secure portal.

            </p>

            <div className="mt-10 flex flex-wrap gap-5">

              <Link
                href="/register"
                className="px-7 py-4 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-500 text-white font-semibold shadow-lg hover:scale-105"
              >
                Apply Now
              </Link>

              <Link
                href="/track-status"
                className="px-7 py-4 rounded-xl border-2 border-teal-700 text-teal-700 font-semibold hover:bg-teal-700 hover:text-white"
              >
                Track Status
              </Link>

            </div>

          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .8 }}
            className="flex justify-center"
          >

            <Image
              src="/images/hero.jpg"
              alt="Hero"
              width={650}
              height={650}
              className="w-full max-w-xl h-auto"
              priority
            />

          </motion.div>

        </div>

      </div>

    </section>
  );
}
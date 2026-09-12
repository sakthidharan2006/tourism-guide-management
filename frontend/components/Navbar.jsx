"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow">
              G
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                GuideConnect
              </h1>

              <p className="text-sm text-slate-500">
                Tourism Guide Portal
              </p>
            </div>

          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-10">

            <Link
              href="/"
              className="text-slate-700 hover:text-teal-600 font-medium transition"
            >
              Home
            </Link>

            <Link
              href="#services"
              className="text-slate-700 hover:text-teal-600 font-medium transition"
            >
              Services
            </Link>

            <Link
              href="#about"
              className="text-slate-700 hover:text-teal-600 font-medium transition"
            >
              About
            </Link>

            <Link
              href="#contact"
              className="text-slate-700 hover:text-teal-600 font-medium transition"
            >
              Contact
            </Link>

          </nav>

          {/* Buttons */}
          <div className="flex items-center gap-4">

            <Link
              href="/login"
              className="px-5 py-2 border-2 border-teal-600 text-teal-600 rounded-full font-medium hover:bg-teal-600 hover:text-white transition"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="px-5 py-2 bg-teal-600 text-white rounded-full font-medium hover:bg-teal-700 transition shadow"
            >
              Register
            </Link>

          </div>

        </div>

      </div>
    </header>
  );
}
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Logo */}
          <div>
            <h2 className="text-3xl font-bold text-teal-400">
              GuideConnect
            </h2>

            <p className="mt-5 text-slate-300 leading-7">
              Tourism Guide License Application, Renewal &
              Complaint Tracking Management Portal.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-slate-300">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/register">Register</Link></li>
              <li><a href="#services">Services</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold mb-5">
              Services
            </h3>

            <ul className="space-y-3 text-slate-300">
              <li>Apply License</li>
              <li>Renew License</li>
              <li>Track Status</li>
              <li>Complaint Portal</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-5">
              Contact
            </h3>

            <p className="text-slate-300">
              Chennai, Tamil Nadu
            </p>

            <p className="mt-2 text-slate-300">
              support@guideconnect.com
            </p>

            <p className="mt-2 text-slate-300">
              +91 98765 43210
            </p>

            <div className="flex gap-4 mt-6 text-xl">
              <FaFacebookF className="cursor-pointer hover:text-teal-400 transition" />
              <FaTwitter className="cursor-pointer hover:text-teal-400 transition" />
              <FaInstagram className="cursor-pointer hover:text-teal-400 transition" />
              <FaLinkedinIn className="cursor-pointer hover:text-teal-400 transition" />
            </div>

          </div>

        </div>

        <hr className="my-10 border-slate-700"/>

        <p className="text-center text-slate-400">
          © 2026 GuideConnect. All Rights Reserved.
        </p>

      </div>
    </footer>
  );
}
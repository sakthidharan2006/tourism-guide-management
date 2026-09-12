"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaFileAlt,
  FaComments,
  FaHome,
  FaSignOutAlt,
  FaIdCard,
} from "react-icons/fa";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Applications",
      href: "/admin/applications",
      icon: <FaFileAlt />,
    },
    {
      name: "Complaints",
      href: "/admin/complaints",
      icon: <FaComments />,
    },
    {
      name: "License Management",
      href: "/admin/applications",
      icon: <FaIdCard />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 border-r border-slate-200 bg-slate-950 text-white lg:block">

      {/* Logo */}

      <div className="flex h-20 items-center border-b border-slate-800 px-6">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-xl font-bold shadow-lg">
          G
        </div>

        <div className="ml-3">

          <h1 className="text-lg font-bold">
            GuideConnect
          </h1>

          <p className="text-xs text-slate-400">
            Admin Portal
          </p>

        </div>

      </div>

      {/* Navigation */}

      <nav className="px-4 py-6">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Management
        </p>

        <div className="space-y-2">

          {menuItems.map((item) => {

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${
                  active
                    ? "bg-teal-700 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >

                <span className="text-lg">
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>

              </Link>
            );
          })}

        </div>

      </nav>

      {/* Bottom */}

      <div className="absolute bottom-0 left-0 w-full border-t border-slate-800 p-4">

        <Link
          href="/"
          className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          <FaHome />
          <span>Public Portal</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}
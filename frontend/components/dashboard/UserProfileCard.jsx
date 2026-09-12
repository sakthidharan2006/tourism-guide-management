"use client";

import { useEffect, useState } from "react";

export default function UserProfileCard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">

      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full bg-teal-600 text-white flex items-center justify-center text-4xl font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>

      <h2 className="text-center mt-6 text-2xl font-bold">
        {user?.name}
      </h2>

      <p className="text-center text-slate-500">
        Tourism Guide
      </p>

      <div className="mt-8 space-y-4">

        <div className="flex justify-between">
          <span>Email</span>
          <span>{user?.email}</span>
        </div>

        <div className="flex justify-between">
          <span>Phone</span>
          <span>{user?.phone}</span>
        </div>

        <div className="flex justify-between">
          <span>Status</span>
          <span className="text-green-600 font-semibold">
            Active
          </span>
        </div>

      </div>

    </div>
  );
}
"use client";

import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaClock,
  FaLaptop,
  FaHeadset,
} from "react-icons/fa";

const features = [
  {
    icon: <FaShieldAlt />,
    title: "Secure System",
    desc: "Your personal information is protected using secure authentication and encrypted storage.",
  },
  {
    icon: <FaClock />,
    title: "Fast Processing",
    desc: "Apply and renew licenses online without unnecessary paperwork or long waiting times.",
  },
  {
    icon: <FaLaptop />,
    title: "100% Digital",
    desc: "Complete every step online, from application submission to status tracking.",
  },
  {
    icon: <FaHeadset />,
    title: "Support",
    desc: "Dedicated support for guides throughout the application and renewal process.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-900">
            Why Choose GuideConnect?
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Built to simplify tourism guide services with speed, transparency, and security.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="text-4xl text-teal-700">
                {item.icon}
              </div>

              <h3 className="mt-5 text-2xl font-bold">
                {item.title}
              </h3>

              <p className="mt-4 text-slate-600">
                {item.desc}
              </p>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
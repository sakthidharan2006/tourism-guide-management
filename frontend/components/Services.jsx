"use client";

import { motion } from "framer-motion";
import {
  FaIdCard,
  FaSyncAlt,
  FaSearch,
  FaExclamationCircle,
} from "react-icons/fa";

const services = [
  {
    icon: <FaIdCard />,
    title: "Apply for License",
    description:
      "Submit a new Tourism Guide License application with all required documents.",
  },
  {
    icon: <FaSyncAlt />,
    title: "Renew License",
    description:
      "Renew your existing guide license quickly without visiting the office.",
  },
  {
    icon: <FaSearch />,
    title: "Track Application",
    description:
      "Check your application status in real time using your application ID.",
  },
  {
    icon: <FaExclamationCircle />,
    title: "Complaint Portal",
    description:
      "Raise complaints and monitor their progress until resolution.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="py-24 bg-gradient-to-b from-white to-slate-100"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-slate-900">
            Our Services
          </h2>

          <p className="mt-4 text-slate-600 text-lg">
            Everything you need to manage your Tourism Guide License in one place.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 hover:shadow-2xl"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 text-white text-2xl flex items-center justify-center mb-6">
                {service.icon}
              </div>

              <h3 className="text-2xl font-bold text-slate-900">
                {service.title}
              </h3>

              <p className="mt-4 text-slate-600 leading-7">
                {service.description}
              </p>

              <button className="mt-6 text-teal-700 font-semibold hover:text-teal-900 transition">
                Learn More →
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
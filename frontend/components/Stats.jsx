"use client";

import { motion } from "framer-motion";
import {
  FaUsers,
  FaFileSignature,
  FaMapMarkedAlt,
  FaStar,
} from "react-icons/fa";

const stats = [
  {
    icon: <FaUsers />,
    number: "12,500+",
    title: "Registered Guides",
  },
  {
    icon: <FaFileSignature />,
    number: "18,000+",
    title: "Licenses Issued",
  },
  {
    icon: <FaMapMarkedAlt />,
    number: "30+",
    title: "Tourist Destinations",
  },
  {
    icon: <FaStar />,
    number: "98%",
    title: "Citizen Satisfaction",
  },
];

export default function Stats() {
  return (
    <section className="bg-teal-700 py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 text-center shadow-xl"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-teal-100 flex items-center justify-center text-3xl text-teal-700">
                {item.icon}
              </div>

              <h2 className="mt-6 text-4xl font-bold text-slate-900">
                {item.number}
              </h2>

              <p className="mt-2 text-slate-600">
                {item.title}
              </p>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
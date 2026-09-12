import {
  FaIdCard,
  FaSyncAlt,
  FaSearch,
  FaExclamationTriangle,
} from "react-icons/fa";

const cards = [
  {
    title: "Apply License",
    icon: <FaIdCard />,
    color: "from-blue-600 to-cyan-500",
  },
  {
    title: "Renew License",
    icon: <FaSyncAlt />,
    color: "from-green-600 to-emerald-500",
  },
  {
    title: "Track Status",
    icon: <FaSearch />,
    color: "from-orange-500 to-yellow-500",
  },
  {
    title: "Complaint",
    icon: <FaExclamationTriangle />,
    color: "from-red-600 to-pink-500",
  },
];

export default function DashboardCards() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

      {cards.map((card) => (
        <div
          key={card.title}
          className={`bg-gradient-to-r ${card.color} rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition`}
        >
          <div className="text-4xl">{card.icon}</div>

          <h2 className="mt-6 text-2xl font-bold">
            {card.title}
          </h2>
        </div>
      ))}

    </div>
  );
}
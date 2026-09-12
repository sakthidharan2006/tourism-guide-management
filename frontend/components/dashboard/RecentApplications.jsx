const applications = [
  {
    id: "TG1001",
    type: "New License",
    status: "Approved",
    date: "03 Aug 2026",
  },
  {
    id: "TG1002",
    type: "Renewal",
    status: "Pending",
    date: "28 Jul 2026",
  },
];

export default function RecentApplications() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">

      <h2 className="text-2xl font-bold mb-6">
        Recent Applications
      </h2>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left py-3">ID</th>
            <th className="text-left">Type</th>
            <th className="text-left">Status</th>
            <th className="text-left">Date</th>

          </tr>

        </thead>

        <tbody>

          {applications.map((item) => (
            <tr key={item.id} className="border-b">

              <td className="py-4">{item.id}</td>
              <td>{item.type}</td>

              <td>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  {item.status}
                </span>

              </td>

              <td>{item.date}</td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}
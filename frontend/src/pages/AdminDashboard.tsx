import React from "react";

const AdminDashboard: React.FC = () => {
  // Global Mock Metrics for the TimeBank Network
  const metrics = [
    { label: "Total Members", count: "1,240", change: "+12% this month", color: "text-blue-600" },
    { label: "Circulating Hours", count: "4,850 hrs", change: "Stable velocity", color: "text-indigo-600" },
    { label: "Active Disputes", count: "3 Pending", change: "Requires immediate review", color: "text-red-600" },
    { label: "Completed Swaps", count: "320", change: "+8% week over week", color: "text-green-600" },
  ];

  // Mock data for filed reports waiting in the queue
  const complianceQueue = [
    { id: "REP-402", target: "EXCH-9482", reporter: "Sarah T.", reason: "No-Show", date: "Today" },
    { id: "REP-399", target: "EXCH-9110", reporter: "John D.", reason: "Incorrect hour duration logged", date: "Yesterday" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">ADMINISTRATIVE OPERATIONS</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Monitor system velocity, audit time-credit integrity, and resolve outstanding community escalations.
        </p>
      </div>

      {/* 📊 High-Level Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{m.label}</p>
            <p className={`text-2xl font-black my-2 ${m.color}`}>{m.count}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{m.change}</p>
          </div>
        ))}
      </div>

      {/* 🛡️ Moderation Queue Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
          <h2 className="text-base font-bold">Open Disputes & Verification Queue</h2>
          <p className="text-xs text-gray-400 mt-0.5">Filing history routed from user transaction reports.</p>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-200 dark:border-gray-700 bg-gray-50/20 dark:bg-gray-800/40">
              <th className="p-4">Report ID</th>
              <th className="p-4">Exchange Token</th>
              <th className="p-4">Filer</th>
              <th className="p-4">Violation Reason</th>
              <th className="p-4">Logged</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            {complianceQueue.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50/40 dark:hover:bg-gray-700/10 transition-colors">
                <td className="p-4 font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">{ticket.id}</td>
                <td className="p-4 font-mono text-xs">{ticket.target}</td>
                <td className="p-4">{ticket.reporter}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-100 dark:border-red-900/20">
                    {ticket.reason}
                  </span>
                </td>
                <td className="p-4 text-gray-400 text-xs">{ticket.date}</td>
                <td className="p-4 text-right">
                  <div className="flex gap-2 justify-end">
                    <button className="px-2.5 py-1 text-xs bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 rounded font-medium hover:opacity-90">
                      Investigate
                    </button>
                    <button className="px-2.5 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      Dismiss
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminDashboard;
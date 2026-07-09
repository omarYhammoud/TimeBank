import React from "react";

type Transaction = {
  id: string;
  date: string;
  description: string;
  type: "Earned" | "Spent";
  hours: number;
  balance: number;
};

const transactionLedger: Transaction[] = [
  { id: "TX-401", date: "2026-07-06", description: "Provided 2 hrs of React Portfolio Debugging to Alex Rivera", type: "Earned", hours: 2.0, balance: 12.5 },
  { id: "TX-402", date: "2026-07-04", description: "Consumed 1 hr of Tailwind CSS Responsive Layout Fixes with Jordan Lee", type: "Spent", hours: -1.0, balance: 10.5 },
  { id: "TX-403", date: "2026-06-29", description: "Provided 1.5 hrs of Git Rebase & Versioning coaching to Taylor Smith", type: "Earned", hours: 1.5, balance: 11.5 },
];

const TimeWalletPage: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">TIME WALLET</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Monitor your accrued community time-currency balances and service transaction logs.
        </p>
      </div>

      {/* 💳 Primary Balance Summary Display Hero Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center shadow-sm mb-6 flex flex-col items-center justify-center">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
          Available Balance
        </span>
        <h2 className="text-5xl font-black tracking-tight text-gray-900 dark:text-white">
          12.5 hrs
        </h2>
        <p className="text-xs text-gray-400 mt-2">
          1 hour of service provided equals 1 community time credit.
        </p>
      </div>

      {/* 📊 Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 block uppercase tracking-wider mb-1">
            Total Hours Earned
          </span>
          <div className="text-xl font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
            🌱 +24.5 hrs
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 block uppercase tracking-wider mb-1">
            Total Hours Spent
          </span>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
            🛒 -12.0 hrs
          </div>
        </div>
      </div>

      {/* 📜 Full Historical Transaction Ledger */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Transaction History Ledger
          </h3>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700/50 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th className="p-4 w-32">Date</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-center w-28">Type</th>
              <th className="p-4 text-right w-28">Hours</th>
              <th className="p-4 text-right w-28">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            {transactionLedger.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                <td className="p-4 whitespace-nowrap text-gray-500 dark:text-gray-400 font-medium">
                  {tx.date}
                </td>
                <td className="p-4 text-gray-700 dark:text-gray-300 font-medium">
                  {tx.description}
                </td>
                <td className="p-4 text-center">
                  <span className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                    tx.type === "Earned" 
                      ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" 
                      : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                  }`}>
                    {tx.type}
                  </span>
                </td>
                <td className={`p-4 text-right font-bold ${
                  tx.type === "Earned" ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                }`}>
                  {tx.hours > 0 ? `+${tx.hours.toFixed(1)}` : tx.hours.toFixed(1)}
                </td>
                <td className="p-4 text-right font-semibold text-gray-600 dark:text-gray-400">
                  {tx.balance.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default TimeWalletPage;
import React, { useState } from "react";

const ReportIssuePage: React.FC = () => {
  const [reasonCategory, setReasonCategory] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  // 🌍 NEUTRAL REUSABLE PLACEHOLDER DATA
  const disputeTarget = {
    bookingId: "EXCH-9482",
    serviceTitle: "Scheduled Community Skill-Share Session",
    provider: "Network Member",
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonCategory) {
      alert("Please select a violation category.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center text-gray-900 dark:text-gray-100">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center shadow-sm w-full">
          <div className="text-4xl mb-3">🛡️</div>
          <h2 className="text-xl font-bold mb-2">Report Logged Successfully</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Your ticket has been sent to the Moderation Queue. The time credits involved are locked until administrative review.
          </p>
          <button
            onClick={() => { setSubmitted(false); setReasonCategory(""); setDetails(""); }}
            className="px-4 py-2 text-xs font-bold text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">REPORT TRANSACTION</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Flag inaccurate hour logs or code of conduct violations to our platform compliance team.
        </p>
      </div>

      {/* 📎 Target Context Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-900/30 p-5 shadow-sm mb-6 bg-gradient-to-r from-red-50/20 to-transparent">
        <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400">
          Dispute Target
        </span>
        <h3 className="font-bold text-base mt-3 mb-1">{disputeTarget.serviceTitle}</h3>
        <p className="text-xs text-gray-400">
          Exchange Token: <span className="font-mono">{disputeTarget.bookingId}</span> • Member: {disputeTarget.provider}
        </p>
      </div>

      {/* ⚠️ Form Container */}
      <form onSubmit={handleReportSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-col gap-6">
        
        {/* Dropdown Selector Category */}
        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Reason Category
          </label>
          <select
            value={reasonCategory}
            onChange={(e) => setReasonCategory(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 dark:text-gray-300"
            required
          >
            <option value="">-- Choose a standard classification --</option>
            <option value="no-show">The other member did not attend the scheduled slot</option>
            <option value="incorrect-time">Inaccurate time-credit duration was logged</option>
            <option value="poor-quality">Inappropriate behavior or community guidelines violation</option>
            <option value="other">Other issue (Specify details below)</option>
          </select>
        </div>

        {/* Text Area Body Context */}
        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Supporting Details
          </label>
          <textarea
            rows={5}
            placeholder="Please provide timing details, communication notes, or context to help administrators verify this claim..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full px-4 py-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none placeholder-gray-400"
            required
          />
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="w-full py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
        >
          File Escalation Report
        </button>
      </form>

    </div>
  );
};

export default ReportIssuePage;
import React from "react";

const Leaderboard: React.FC = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Leaderboard
      </h1>
      <p className="text-gray-500 dark:text-gray-400">
        See who has contributed the most hours to the TimeBank.
      </p>
    </div>
  );
};

export default Leaderboard;
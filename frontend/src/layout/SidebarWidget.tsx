export default function SidebarWidget() {
  return (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03] border border-slate-800/40`}
    >
      {/* Icon Badge */}
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 text-xl text-indigo-400">
        🌟
      </div>

      <h3 className="mb-1 font-bold text-gray-900 dark:text-white text-sm">
        Community Champion
      </h3>
      
      <p className="mb-4 text-gray-500 text-xs dark:text-gray-400 leading-relaxed">
        You are in the top 10% of local volunteers this month. Thank you for sharing your skills!
      </p>
      
      <a
        href="#leaderboard"
        className="flex items-center justify-center p-2.5 font-semibold text-white rounded-xl bg-indigo-600 text-xs hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/10"
      >
        View Community Impact
      </a>
    </div>
  );
}
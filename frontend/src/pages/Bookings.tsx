import React, { useState } from "react";
import { Link } from "react-router"; // Clean router package linking

type BookingStatus = "Pending" | "Accepted" | "Completed" | "Cancelled";
// 1. Added a type to differentiate between provider and consumer roles
type BookingType = "Offering" | "Requested";

type Booking = {
  id: string;
  serviceName: string;
  member: string;
  dateTime: string;
  status: BookingStatus;
  type: BookingType; // Added type field
};

// Mock dataset updated to include 'type' variants for filtering testing
const initialBookings: Booking[] = [
  { id: "BK-102", serviceName: "React Portfolio Debugging", member: "Alex Rivera", dateTime: "2026-07-06 14:00", status: "Pending", type: "Offering" },
  { id: "BK-101", serviceName: "Tailwind UI Responsive Fixes", member: "Jordan Lee", dateTime: "2026-07-05 10:30", status: "Accepted", type: "Offering" },
  { id: "BK-100", serviceName: "Node.js API Architecture", member: "Sam Wilson", dateTime: "2026-07-04 09:00", status: "Pending", type: "Requested" },
  { id: "BK-099", serviceName: "MySQL Schema Optimization", member: "Taylor Smith", dateTime: "2026-07-02 11:00", status: "Completed", type: "Requested" },
];

const BookingsPage: React.FC = () => {
 
const [activeTab, setActiveTab] = useState<"Upcoming" | "Pending" | "Completed" | "Cancelled Ramsay">("Upcoming");
  // 2. Added new state control for Offering vs Requested tabs
  const [bookingType, setBookingType] = useState<BookingType>("Offering");
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  // Handles state changes for accepting, rejecting, or completing exchanges
  const handleStatusChange = (id: string, newStatus: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  // 3. Updated filtering logic to respect both the BookingType and status tabs
  const filteredBookings = bookings.filter(b => {
    if (b.type !== bookingType) return false;
    if (activeTab === "Upcoming") return b.status === "Accepted" || b.status === "Pending";
    return b.status === activeTab;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      
      {/* 🛠️ Top Bar Heading & Offering/Requested Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight uppercase">MY BOOKINGS</h1>
        
        {/* New Top-Level Toggle Switch */}
        <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-xl border border-gray-300 dark:border-gray-700 self-start sm:self-auto">
          <button
            onClick={() => setBookingType("Offering")}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 ${
              bookingType === "Offering"
                ? "bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            💼 Offering
          </button>
          <button
            onClick={() => setBookingType("Requested")}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 ${
              bookingType === "Requested"
                ? "bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            🤝 Requested
          </button>
        </div>
      </div>

      {/* 📑 Status Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-800 pb-3">
        {(["Upcoming", "Pending", "Completed", "Cancelled"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
              activeTab === tab
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 📊 Data Grid Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700/50 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th className="p-4">Service</th>
              <th className="p-4">Member</th>
              <th className="p-4">Date / Time</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-sm text-gray-400">
                  No {bookingType.toLowerCase()} records matching this status view.
                </td>
              </tr>
            ) : (
              filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                  <td className="p-4 font-medium text-sm">{b.serviceName}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{b.member}</td>
                  <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{b.dateTime}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${
                      b.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      b.status === "Accepted" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      b.status === "Completed" ? "bg-green-50 text-green-700 border-green-200" :
                      "bg-gray-50 text-gray-600 border-gray-200"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex gap-2 justify-end items-center flex-wrap">
                      
                      {/* Contextual Action Workflows */}
                      {b.status === "Pending" && (
                        <>
                          <button onClick={() => handleStatusChange(b.id, "Accepted")} className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 bg-white font-medium dark:bg-gray-700 dark:border-gray-600">Accept</button>
                          <button onClick={() => handleStatusChange(b.id, "Cancelled")} className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 text-red-600 bg-white font-medium dark:bg-gray-700 dark:border-gray-600">Reject</button>
                        </>
                      )}
                      
                      {b.status === "Accepted" && (
                        <>
                          <button onClick={() => handleStatusChange(b.id, "Completed")} className="px-3 py-1 text-xs border border-gray-100 bg-gray-950 text-white rounded hover:bg-gray-800 font-medium dark:bg-gray-100 dark:text-gray-900">Complete</button>
                          <button onClick={() => handleStatusChange(b.id, "Cancelled")} className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 bg-white font-medium dark:bg-gray-700 dark:border-gray-600">Cancel</button>
                        </>
                      )}
                      
                      {b.status === "Completed" && (
                        <Link to="/reviews" className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 bg-white font-medium dark:bg-gray-700 dark:border-gray-600 text-center">
                          Leave Review
                        </Link>
                      )}

                      {/* 🛡️ Global Report Link (Shows on everything except cancelled items) */}
                      {b.status !== "Cancelled" && (
                        <Link to="/report" className="px-3 py-1 text-xs border border-red-200 text-red-600 rounded hover:bg-red-50 bg-white font-medium dark:bg-gray-700 dark:border-red-900/30 text-center">
                          Report
                        </Link>
                      )}

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsPage;
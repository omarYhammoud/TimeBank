import React, { useState } from "react";

type ServiceListing = {
  id: string;
  title: string;
  provider: string;
  category: string;
  duration: number; // in minutes
  cost: number;     // in time credits (hours)
  description: string;
};

// Mock dataset mapping to modern skill exchanges
const initialServices: ServiceListing[] = [
  {
    id: "SRV-201",
    title: "Full-Stack React & Node.js Architecture Review",
    provider: "Alex Rivera",
    category: "Development",
    duration: 120,
    cost: 2,
    description: "Deep dive into your component state management, hook optimizations, and Express API routing setup.",
  },
  {
    id: "SRV-202",
    title: "Cross-Site Scripting (XSS) Vulnerability Auditing",
    provider: "Sam Vance",
    category: "Cybersecurity",
    duration: 60,
    cost: 1,
    description: "Practical security testing of your web application input vectors and CSP policies to detect injection flaws.",
  },
  {
    id: "SRV-203",
    title: "Tailwind CSS Layout & Mobile Responsiveness Fixes",
    provider: "Jordan Lee",
    category: "Design",
    duration: 60,
    cost: 1,
    description: "Fixing stubborn CSS Grid/Flexbox issues, alignment quirks, and setting up clean breakpoint behaviors.",
  },
  {
    id: "SRV-204",
    title: "Relational Database Schema & Foreign Key Tuning",
    provider: "Taylor Smith",
    category: "Databases",
    duration: 120,
    cost: 2,
    description: "Optimizing complex MySQL query constraints, indexing strategies, or organizing your NoSQL MongoDB collection schemas.",
  },
];

const BrowseServicesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Development", "Cybersecurity", "Design", "Databases"];

  // Search filter matching text queries or category pill selections
  const filteredServices = initialServices.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      
      {/* Page Header Layout */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">BROWSE SERVICES</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Discover skill-share listings offered by other network community members.</p>
        </div>

        {/* 🔍 Interactive Search Bar */}
        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Search skills, topics, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* 🏷️ Horizontal Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 border ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 🎴 Dynamic Services Card Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-sm text-gray-400">No active service listings found matching your current filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div 
              key={service.id} 
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                {/* Card Top Label Row */}
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {service.category}
                  </span>
                  <div className="flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    ⏳ <span>{service.cost} {service.cost === 1 ? "Hour" : "Hours"}</span>
                  </div>
                </div>

                {/* Main Card Content */}
                <h3 className="font-bold text-base line-clamp-1 mb-1 group-hover:text-indigo-600">{service.title}</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">by {service.provider}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Booking Request Actions Footer */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <span className="text-xs text-gray-400">Session length: {service.duration} mins</span>
                <button className="px-4 py-2 text-xs font-bold text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                  Request Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseServicesPage;
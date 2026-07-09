import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

// Unified Interface aligned with TimeBank relational database records
interface TimeExchange {
  id: number;
  taskName: string;      // The service provided (e.g., "React Development Support")
  category: string;      // Service Category (e.g., "IT & Programming", "Education")
  member: string;        // Name of the member performing the service
  hours: string;         // Plain hours spent (e.g., "3.5 hrs") instead of prices ($)
  status: "Completed" | "Pending" | "Canceled"; 
  avatar: string;        // Fallback or user photo placeholder
}

// Data mapped directly to fit a standard peer-to-peer time ledger array
const tableData: TimeExchange[] = [
  {
    id: 1,
    taskName: "Cybersecurity Audit & Code Review",
    category: "IT / Infrastructure",
    member: "Alex Rivera",
    hours: "4.5 hrs",
    status: "Completed",
    avatar: "/images/user/user-01.jpg", 
  },
  {
    id: 2,
    taskName: "Introductory JavaScript Mentoring",
    category: "Education",
    member: "Sarah Chen",
    hours: "2.0 hrs",
    status: "Pending",
    avatar: "/images/user/user-02.jpg",
  },
  {
    id: 3,
    taskName: "Database Schema Optimization",
    category: "IT / Infrastructure",
    member: "Marcus Vance",
    hours: "3.0 hrs",
    status: "Completed",
    avatar: "/images/user/user-03.jpg",
  },
  {
    id: 4,
    taskName: "Responsive Portfolio Setup Assistance",
    category: "Web Development",
    member: "Elena Rostova",
    hours: "1.5 hrs",
    status: "Canceled",
    avatar: "/images/user/user-04.jpg",
  },
  {
    id: 5,
    taskName: "Tailwind CSS Layout Debugging",
    category: "Web Development",
    member: "Liam K.",
    hours: "1.0 hrs",
    status: "Completed",
    avatar: "/images/user/user-05.jpg",
  },
];

export default function RecentOrders() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Exchanges Ledger
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Re-aligned Table Headers */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Service Provided
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Category
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Duration
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body Content mapping structured strings safely */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((exchange) => (
              <TableRow key={exchange.id}>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[40px] w-[40px] rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-sm font-semibold text-brand-500 border border-indigo-100 dark:border-indigo-900/50">
                      {exchange.member.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {exchange.taskName}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        by {exchange.member}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {exchange.category}
                </TableCell>
                <TableCell className="py-3 font-medium text-gray-700 text-theme-sm dark:text-gray-300">
                  {exchange.hours}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      exchange.status === "Completed"
                        ? "success"
                        : exchange.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {exchange.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
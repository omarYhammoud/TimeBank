import { useCallback } from "react";
import { Link, useLocation } from "react-router";

import {
  GridIcon,
  ListIcon,
  CalenderIcon,
  UserCircleIcon,
  TableIcon,
  PieChartIcon,
  PlugInIcon,
  HorizontaLDots,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

// 👥 NAVIGATION FOR REGULAR MEMBERS
const memberItems: NavItem[] = [
  { name: "Dashboard", path: "/", icon: <GridIcon /> },
  { name: "Browse Services", path: "/browse", icon: <ListIcon /> },
  { name: "My Services", path: "/my-services", icon: <PlugInIcon /> },
  { name: "Bookings", path: "/bookings", icon: <CalenderIcon /> },
  { name: "Time Wallet", path: "/wallet", icon: <TableIcon /> },
  { name: "Reviews", path: "/reviews", icon: <UserCircleIcon /> },
  { name: "Leaderboard", path: "/leaderboard", icon: <PieChartIcon /> },
 // { name: "Notifications", path: "/notifications", icon: <HorizontaLDots /> },
  { name: "Profile", path: "/profile", icon: <UserCircleIcon /> },
];

// 👑 NAVIGATION FOR ADMINISTRATORS
const adminItems: NavItem[] = [
  { name: "Dashboard", path: "/admin", icon: <GridIcon /> },
  { name: "Users", path: "/admin/users", icon: <UserCircleIcon /> },
  { name: "Services", path: "/admin/services", icon: <PlugInIcon /> },
  { name: "Categories", path: "/admin/categories", icon: <ListIcon /> },
  { name: "Reports", path: "/admin/reports", icon: <HorizontaLDots /> },
  { name: "Analytics", path: "/admin/analytics", icon: <PieChartIcon /> },
  { name: "Settings", path: "/admin/settings", icon: <TableIcon /> },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  // 🔒 TODO: Connect this hook to your actual global Auth State context (e.g., useAuth())
  // For security, the user role should be derived strictly from verified backend session tokens.
  const userRole: "member" | "admin" = "member"; 

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  // The view is strictly derived from the verified user role variable
  // const dynamicNavItems = userRole === "admin" ? adminItems : memberItems;
     const dynamicNavItems = memberItems;
  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Brand Logo Wrapper */}
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-lg shadow-md shadow-indigo-500/20">
              ⏳
            </div>
            {(isExpanded || isHovered || isMobileOpen) && (
              <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                TimeBank 
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar grow">
        <nav className="mb-6">
          <ul className="flex flex-col gap-2">
            {dynamicNavItems.map((nav) => (
              <li key={nav.name}>
                <Link
                  to={nav.path}
                  className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"} ${
                    !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                  }`}
                >
                  <span className={`menu-item-icon-size ${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {(isExpanded || isHovered || isMobileOpen) && (
        <div className="pb-6">
          <SidebarWidget />
        </div>
      )}
    </aside>
  );
};

export default AppSidebar;
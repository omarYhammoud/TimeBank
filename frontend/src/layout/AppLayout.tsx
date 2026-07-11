import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet, Navigate } from "react-router"; // 👈 Added Navigate here
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  // 🔒 AUTH GUARD BLOCK: Check if the user token exists
  const token = localStorage.getItem("token");

  // If there is no token, prevent access and redirect directly to /signin
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // If authenticated, grant entry to layout context frames
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
import { BrowserRouter as Router, Routes, Route } from "react-router";
import * as React from 'react';

// 1. PUBLIC MARKETING FLOWS
import Landing from "./pages/Landing"; // Wireframe #1: Public Guest View

// 2. AUTHENTICATION MODULE
import SignIn from "./pages/AuthPages/SignIn"; // Wireframe #2
import SignUp from "./pages/AuthPages/SignUp"; // Wireframe #2
import BrowseServicesPage from "./pages/Services/BrowseServices"; 
import TimeWalletPage from "./pages/TimeWallet";
import LeaveReviewPage from "./pages/LeaveReview";
import ReportIssuePage from "./pages/ReportIssue";
import BookingsPage from "./pages/Bookings";
import AdminDashboard from "./pages/AdminDashboard";
import MyServices from "./pages/MyServices";
import Leaderboard from "./pages/Leaderboard";

// 3. SECURE TIMEBANK MEMBER PATHS
import Home from "./pages/Dashboard/Home"; // Wireframe #3: Member Dashboard Home

// TEMPLATE DESIGN UI UTILITIES (Preserved)
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          
          {/* =========================================================
              A. PUBLIC PATHS (No Left Sidebar / No Top Dashboard Nav)
             ========================================================= */}
          {/* Wireframe #1: Guest Entry Point */}
          <Route index element={<Landing />} />

          {/* Wireframe #2: Authentication Module */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* =========================================================
              B. LOGGED-IN SPACE (Wrapped with Sidebar & Top Panels)
             ========================================================= */}
          <Route element={<AppLayout />}>
            {/* Wireframe #3: Central Hub */}
            <Route path="/dashboard" element={<Home />} />

            {/* Core Feature Functional Component Subsections */}
            <Route path="/browse" element={<BrowseServicesPage />} />
            <Route path="/wallet" element={<TimeWalletPage />} />
            <Route path="/reviews" element={<LeaveReviewPage />} />
            <Route path="/report" element={<ReportIssuePage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/my-services" element={<MyServices />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            {/* Others Page Utilities (Preserved) */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms UI Utilities */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables UI Utilities */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* UI Component Assets Kit */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts Components */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* =========================================================
              C. FALLBACK ERROR ROUTE
             ========================================================= */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

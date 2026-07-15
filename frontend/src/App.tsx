import { BrowserRouter as Router, Routes, Route } from "react-router";
import * as React from "react";

// 1. PUBLIC MARKETING FLOWS
import Landing from "./pages/Landing";

// 2. AUTHENTICATION MODULE
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";

// 3. CORE TIMEBANK FEATURES
import BrowseServicesPage from "./pages/Services/BrowseServices";
import CreateServicePage from "./pages/Services/CreateServicePage";
import EditServicePage from "./pages/Services/EditServicePage";
import BookServicePage from "./pages/Services/BookServicePage";
import MyServices from "./pages/MyServices";

import TimeWalletPage from "./pages/TimeWallet";
import LeaveReviewPage from "./pages/LeaveReview";
import ReportIssuePage from "./pages/ReportIssue";
import BookingsPage from "./pages/Bookings";
import AdminDashboard from "./pages/AdminDashboard";
import Leaderboard from "./pages/Leaderboard";

// 4. SECURE TIMEBANK MEMBER PATHS
import Home from "./pages/Dashboard/Home";

// 5. TEMPLATE DESIGN UI UTILITIES
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

// 6. LAYOUT COMPONENTS
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

export default function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* =========================================================
            A. PUBLIC PATHS
           ========================================================= */}

        <Route index element={<Landing />} />

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* =========================================================
            B. LOGGED-IN SPACE
           ========================================================= */}

        <Route element={<AppLayout />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Home />} />

          {/* Services */}
          <Route path="/browse" element={<BrowseServicesPage />} />
          <Route path="/my-services" element={<MyServices />} />
          <Route
            path="/services/new"
            element={<CreateServicePage />}
          />
          <Route
            path="/services/:id/edit"
            element={<EditServicePage />}
          />
          <Route
            path="/book-service/:id"
            element={<BookServicePage />}
          />

          {/* Other Core Features */}
          <Route path="/wallet" element={<TimeWalletPage />} />
          <Route path="/reviews" element={<LeaveReviewPage />} />
          <Route path="/report" element={<ReportIssuePage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          
          {/* User Pages */}
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />
          
          {/* Forms */}
          <Route path="/form-elements" element={<FormElements />} />

          {/* Tables */}
          <Route path="/basic-tables" element={<BasicTables />} />

          {/* UI Components */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />

          {/* Charts */}
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
        </Route>

        {/* =========================================================
            C. FALLBACK ROUTE
           ========================================================= */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
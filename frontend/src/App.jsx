import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import useAuthStore from "./store/authStore";

import LandingPage      from "./pages/home/LandingPage";
import Login            from "./pages/auth/Login";
import Register         from "./pages/auth/Register";
import ChangePassword   from "./pages/auth/ChangePassword";
import CollegeRequest   from "./pages/college/CollegeRequest";
import NotFound         from "./pages/NotFound";

import StudentDashboard from "./pages/student/Dashboard";
import StudentDrives    from "./pages/student/Drives";
import DriveDetail      from "./pages/student/DriveDetail";
import MyApplications   from "./pages/student/MyApplications";
import StudentNotices   from "./pages/student/Notices";
import StudentProfile   from "./pages/student/Profile";

import TPODashboard     from "./pages/tpo/Dashboard";
import TPODrives        from "./pages/tpo/Drives";
import DriveForm        from "./pages/tpo/DriveForm";
import DriveApplicants  from "./pages/tpo/DriveApplicants";
import TPOStudents      from "./pages/tpo/Students";
import TPOAnalytics     from "./pages/tpo/Analytics";
import TPONotices       from "./pages/tpo/Notices";
import NoticeForm       from "./pages/tpo/NoticeForm";
import TPOTeam           from "./pages/tpo/Team";

import AdminDashboard   from "./pages/admin/Dashboard";
import AdminColleges    from "./pages/admin/Colleges";
import CreateTPO        from "./pages/admin/CreateTPO";

// ─── PROTECTED ROUTE ─────────────────────────────────────────────────────────
function ProtectedRoute({ children, roles }) {
  const { user } = useAuthStore();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace />;
  if(user.isFirstLogin && location.pathname !== "/change-password") return <Navigate to="/change-password" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/"                element={<LandingPage />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/college/request" element={<CollegeRequest />} />

        <Route path="/change-password" element={<ProtectedRoute roles={["STUDENT", "TPO", "ADMIN"]}><ChangePassword /></ProtectedRoute>} />

        {/* Student */}
        <Route path="/student/dashboard"    element={<ProtectedRoute roles={["STUDENT"]}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/drives"       element={<ProtectedRoute roles={["STUDENT"]}><StudentDrives /></ProtectedRoute>} />
        <Route path="/student/drives/:id"   element={<ProtectedRoute roles={["STUDENT"]}><DriveDetail /></ProtectedRoute>} />
        <Route path="/student/applications" element={<ProtectedRoute roles={["STUDENT"]}><MyApplications /></ProtectedRoute>} />
        <Route path="/student/notices"      element={<ProtectedRoute roles={["STUDENT"]}><StudentNotices /></ProtectedRoute>} />
        <Route path="/student/profile"      element={<ProtectedRoute roles={["STUDENT"]}><StudentProfile /></ProtectedRoute>} />

        {/* TPO */}
        <Route path="/tpo/dashboard"             element={<ProtectedRoute roles={["TPO","ADMIN"]}><TPODashboard /></ProtectedRoute>} />
        <Route path="/tpo/drives"                element={<ProtectedRoute roles={["TPO","ADMIN"]}><TPODrives /></ProtectedRoute>} />
        <Route path="/tpo/drives/new"            element={<ProtectedRoute roles={["TPO","ADMIN"]}><DriveForm /></ProtectedRoute>} />
        <Route path="/tpo/drives/:id/edit"       element={<ProtectedRoute roles={["TPO","ADMIN"]}><DriveForm /></ProtectedRoute>} />
        <Route path="/tpo/drives/:id/applicants" element={<ProtectedRoute roles={["TPO","ADMIN"]}><DriveApplicants /></ProtectedRoute>} />
        <Route path="/tpo/students"              element={<ProtectedRoute roles={["TPO","ADMIN"]}><TPOStudents /></ProtectedRoute>} />
        <Route path="/tpo/analytics"             element={<ProtectedRoute roles={["TPO","ADMIN"]}><TPOAnalytics /></ProtectedRoute>} />
        <Route path="/tpo/notices"               element={<ProtectedRoute roles={["TPO","ADMIN"]}><TPONotices /></ProtectedRoute>} />
        <Route path="/tpo/notices/new"           element={<ProtectedRoute roles={["TPO","ADMIN"]}><NoticeForm /></ProtectedRoute>} />
        <Route path="/tpo/team"                  element={<ProtectedRoute roles={["TPO","ADMIN"]}><TPOTeam /></ProtectedRoute>} />
        
        {/* Admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute roles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/colleges"  element={<ProtectedRoute roles={["ADMIN"]}><AdminColleges /></ProtectedRoute>} />
        <Route path="/admin/tpo/new"   element={<ProtectedRoute roles={["ADMIN"]}><CreateTPO /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}
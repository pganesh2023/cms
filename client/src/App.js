import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/general/landingPage";
import LoginPage from "./pages/general/loginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import FacilityDashboard from "./pages/admin/FacilityDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Children from "./pages/facility_admin/children";
import Teacher from "./pages/facility_admin/teacher";
import Classroom from "./pages/facility_admin/classroom";
import Ledger from "./pages/facility_admin/ledger";
import ChildrenAssigned from "./pages/teacher/childrenAssigned";
import Finances from "./pages/facility_admin/finances";
import Attendance from "./pages/facility_admin/attendance";
import TeacherHours from "./pages/facility_admin/teacherhours";
import ChildLedger from "./pages/parent/childLedger";
import WeeklyChildAttendance from "./pages/parent/weeklyChildAttendance";
import MonthlyChildAttendance from "./pages/parent/monthlyChildAttendance";
import TeacherSalary from "./pages/teacher/salary";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* General Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/:role" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route
            path="/facility-dashboard/:facilityId"
            element={<FacilityDashboard />}
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* facility-admin Routes */}

          <Route
            path="facility-admin-dashboard/:facilityId/children"
            element={
              <ProtectedRoute>
                <Children />
              </ProtectedRoute>
            }
          />
          <Route
            path="facility-admin-dashboard/:facilityId/teachers"
            element={
              <ProtectedRoute>
                <Teacher />
              </ProtectedRoute>
            }
          />
          <Route
            path="facility-admin-dashboard/:facilityId/classrooms"
            element={
              <ProtectedRoute>
                <Classroom />
              </ProtectedRoute>
            }
          />
          <Route
            path="facility-admin-dashboard/:facilityId/children/ledger/:childId"
            element={
              <ProtectedRoute>
                <Ledger />
              </ProtectedRoute>
            }
          />
          <Route
            path="facility-admin-dashboard/:facilityId/reports/finances"
            element={
              <ProtectedRoute>
                <Finances />
              </ProtectedRoute>
            }
          />
          <Route
            path="facility-admin-dashboard/:facilityId/reports/attendance"
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="facility-admin-dashboard/:facilityId/teachers/view-hours-worked/:teacherId"
            element={
              <ProtectedRoute>
                <TeacherHours />
              </ProtectedRoute>
            }
          />

          {/* Teacher Routes */}
          <Route
            path="teacher-dashboard/:teacherId/children"
            element={
              <ProtectedRoute>
                <ChildrenAssigned />
              </ProtectedRoute>
            }
          />
          <Route
            path="teacher-dashboard/:teacherId/view-salary"
            element={
              <ProtectedRoute>
                <TeacherSalary />
              </ProtectedRoute>
            }
          />
          {/* Parent Routes */}
          <Route
            path="parent-dashboard/:parentId/view-ledger"
            element={
              <ProtectedRoute>
                <ChildLedger />
              </ProtectedRoute>
            }
          />
          <Route
            path="parent-dashboard/:parentId/view-weekly-attendance"
            element={
              <ProtectedRoute>
                <WeeklyChildAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="parent-dashboard/:parentId/view-monthly-attendance"
            element={
              <ProtectedRoute>
                <MonthlyChildAttendance />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

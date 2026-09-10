import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "../components/common/ProtectedRoute";
import EmployeeList from "../pages/employee/EmployeeList";
import AddEmployee from "../pages/employee/AddEmployee";
import EditEmployee from "../pages/employee/EditEmployee";
import DepartmentList from "../pages/department/DepartmentList";
import AddDepartment from "../pages/department/AddDepartment";
import EditDepartment from "../pages/department/EditDepartment";
import AttendanceList from "../pages/attendance/AttendanceList";
import AddAttendance from "../pages/attendance/AddAttendance";
import EditAttendance from "../pages/attendance/EditAttendance";
import LeaveList from "../pages/leave/LeaveList";
import AddLeave from "../pages/leave/AddLeave";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <EmployeeList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/add"
          element={
            <ProtectedRoute>
              <AddEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/edit/:id"
          element={
            <ProtectedRoute>
              <EditEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments"
          element={
            <ProtectedRoute>
              <DepartmentList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/departments/add"
          element={
            <ProtectedRoute>
              <AddDepartment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/departments/edit/:id"
          element={
            <ProtectedRoute>
              <EditDepartment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <AttendanceList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance/add"
          element={
            <ProtectedRoute>
              <AddAttendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance/edit/:id"
          element={
            <ProtectedRoute>
              <EditAttendance />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Route
        path="/leave-requests"
        element={
          <ProtectedRoute>
            <LeaveList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leave-requests/add"
        element={
          <ProtectedRoute>
            <AddLeave />
          </ProtectedRoute>
        }
      />
    </BrowserRouter>
  );
}

export default AppRoutes;

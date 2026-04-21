import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import HRDashboard from './pages/HR/HRDashboard';
import HREmployees from './pages/HR/HREmployees';
import HRAttendance from './pages/HR/HRAttendance';
import HRAnalytics from './pages/HR/HRAnalytics';
import EmployeeDashboard from './pages/Employee/EmployeeDashboard';
import EmployeeProfile from './pages/Employee/EmployeeProfile';
import EmployeeAttendance from './pages/Employee/EmployeeAttendance';
import EmployeeDetails from './pages/Employee/EmployeeDetails';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/hr/employees/:id" element={<EmployeeDetails />} />
             
            {/* HR Routes */}
            <Route
              path="/hr/dashboard"
              element={
                <PrivateRoute requireHR={true}>
                  <Layout>
                    <HRDashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/hr/employees"
              element={
                <PrivateRoute requireHR={true}>
                  <Layout>
                    <HREmployees />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/hr/attendance"
              element={
                <PrivateRoute requireHR={true}>
                  <Layout>
                    <HRAttendance />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/hr/analytics"
              element={
                <PrivateRoute requireHR={true}>
                  <Layout>
                    <HRAnalytics />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Employee Routes */}
            <Route
              path="/employee/dashboard"
              element={
                <PrivateRoute>
                  <Layout>
                    <EmployeeDashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/employee/profile"
              element={
                <PrivateRoute>
                  <Layout>
                    <EmployeeProfile />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/employee/attendance"
              element={
                <PrivateRoute>
                  <Layout>
                    <EmployeeAttendance />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

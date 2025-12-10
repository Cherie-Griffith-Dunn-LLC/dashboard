import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MsalProvider, useIsAuthenticated, useMsal } from '@azure/msal-react';
import { EventType } from '@azure/msal-browser';
import Login from './components/Login';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Dashboard Pages (we'll create these)
import EmployeeDashboard from './pages/employee/Dashboard';
import CustomerAdminDashboard from './pages/customer/Dashboard';
import CyproteckAdminDashboard from './pages/cyproteck/Dashboard';

/**
 * Main App Component with Dashboard Layout
 */
function AppContent() {
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();
  const [userRole, setUserRole] = useState('employee'); // Default role

  useEffect(() => {
    // Handle authentication events
    const callbackId = instance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        console.log('Login successful', event);
        
        // TODO: Get user role from Azure AD token claims
        // For now, we'll check localStorage or default to employee
        const storedRole = localStorage.getItem('userRole');
        setUserRole(storedRole || 'employee');
      }
    });

    // Load saved role on mount
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setUserRole(storedRole);
    }

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
  }, [instance]);

  // Determine which dashboard to show based on role
  const getDashboardRoute = () => {
    switch (userRole) {
      case 'cyproteck_admin':
        return '/cyproteck/dashboard';
      case 'customer_admin':
        return '/customer/dashboard';
      case 'employee':
      default:
        return '/employee/dashboard';
    }
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <DashboardLayout userRole={userRole}>
      <Routes>
        {/* Redirect root to appropriate dashboard */}
        <Route path="/" element={<Navigate to={getDashboardRoute()} replace />} />
        
        {/* Employee Routes */}
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard" element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="/my-score" element={<ProtectedRoute><div>My Security Score Page</div></ProtectedRoute>} />
        <Route path="/my-training" element={<ProtectedRoute><div>My Training Page</div></ProtectedRoute>} />
        <Route path="/my-alerts" element={<ProtectedRoute><div>My Alerts Page</div></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><div>Get Help Page</div></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><div>My Profile Page</div></ProtectedRoute>} />

        {/* Customer Admin Routes */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute requiredRole="customer_admin">
              <CustomerAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/users" element={<ProtectedRoute requiredRole="customer_admin"><div>Users Management Page</div></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute requiredRole="customer_admin"><div>Security Overview Page</div></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute requiredRole="customer_admin"><div>Reports Page</div></ProtectedRoute>} />
        <Route path="/training" element={<ProtectedRoute requiredRole="customer_admin"><div>Training Management Page</div></ProtectedRoute>} />
        <Route path="/m365" element={<ProtectedRoute requiredRole="customer_admin"><div>Microsoft 365 Analytics Page</div></ProtectedRoute>} />
        <Route path="/vulnerabilities" element={<ProtectedRoute requiredRole="customer_admin"><div>Vulnerability Scan Page</div></ProtectedRoute>} />
        <Route path="/helpdesk" element={<ProtectedRoute requiredRole="customer_admin"><div>IT Helpdesk Page</div></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><div>Settings Page</div></ProtectedRoute>} />

        {/* Cyproteck Admin Routes */}
        <Route
          path="/cyproteck/dashboard"
          element={
            <ProtectedRoute requiredRole="cyproteck_admin">
              <CyproteckAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/customers" element={<ProtectedRoute requiredRole="cyproteck_admin"><div>Customers Management Page</div></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute requiredRole="cyproteck_admin"><div>Cross-Customer Analytics Page</div></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute requiredRole="cyproteck_admin"><div>All Alerts Page</div></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<div style={{ padding: '40px', textAlign: 'center' }}><h2>404 - Page Not Found</h2></div>} />
      </Routes>
    </DashboardLayout>
  );
}

/**
 * Main App Wrapper with MSAL Provider
 */
function App({ msalInstance }) {
  return (
    <MsalProvider instance={msalInstance}>
      <Router>
        <AppContent />
      </Router>
    </MsalProvider>
  );
}

export default App;


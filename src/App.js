import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MsalProvider, useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { EventType } from '@azure/msal-browser';
import Login from './components/Login';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Dashboard Pages
import EmployeeDashboard from './pages/employee/Dashboard';

/**
 * Main App Component with Dashboard Layout
 */
function AppContent() {
  const { instance, inProgress } = useMsal();
  const [userRole, setUserRole] = useState('employee'); // Default role

  useEffect(() => {
    // Handle authentication redirect
    const handleRedirect = async () => {
      try {
        const response = await instance.handleRedirectPromise();
        if (response) {
          console.log('Login redirect successful', response);
          
          // Get user role from token claims or localStorage
          const storedRole = localStorage.getItem('userRole');
          setUserRole(storedRole || 'employee');
        }
      } catch (error) {
        console.error('Redirect error:', error);
      }
    };

    handleRedirect();

    // Handle authentication events
    const callbackId = instance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        console.log('Login successful', event);
        
        // TODO: Get user role from Azure AD token claims
        // For now, check localStorage or default to employee
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

  // Show loading while authentication is in progress
  if (inProgress === 'handleRedirect') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f5f7fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '5px solid rgba(0, 120, 212, 0.2)',
            borderTopColor: '#0078d4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ fontSize: '18px', color: '#666', fontWeight: '600' }}>
            Signing you in...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AuthenticatedTemplate>
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
            <Route path="/my-score" element={<ProtectedRoute><div style={{ padding: '40px' }}><h2>My Security Score Page</h2><p>Coming in Phase 2!</p></div></ProtectedRoute>} />
            <Route path="/my-training" element={<ProtectedRoute><div style={{ padding: '40px' }}><h2>My Training Page</h2><p>Coming in Phase 3!</p></div></ProtectedRoute>} />
            <Route path="/my-alerts" element={<ProtectedRoute><div style={{ padding: '40px' }}><h2>My Alerts Page</h2><p>Coming in Phase 2!</p></div></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute><div style={{ padding: '40px' }}><h2>Get Help Page</h2><p>Coming in Phase 5!</p></div></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><div style={{ padding: '40px' }}><h2>My Profile Page</h2><p>Coming in Phase 2!</p></div></ProtectedRoute>} />

            {/* Customer Admin Routes */}
            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute requiredRole="customer_admin">
                  <div style={{ padding: '40px' }}><h2>Customer Admin Dashboard</h2><p>Coming in Phase 2!</p></div>
                </ProtectedRoute>
              }
            />
            <Route path="/users" element={<ProtectedRoute requiredRole="customer_admin"><div style={{ padding: '40px' }}><h2>Users Management</h2><p>Coming in Phase 2!</p></div></ProtectedRoute>} />
            <Route path="/security" element={<ProtectedRoute requiredRole="customer_admin"><div style={{ padding: '40px' }}><h2>Security Overview</h2><p>Coming in Phase 2!</p></div></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute requiredRole="customer_admin"><div style={{ padding: '40px' }}><h2>Reports</h2><p>Coming in Phase 2!</p></div></ProtectedRoute>} />
            <Route path="/training" element={<ProtectedRoute requiredRole="customer_admin"><div style={{ padding: '40px' }}><h2>Training Management</h2><p>Coming in Phase 3!</p></div></ProtectedRoute>} />
            <Route path="/m365" element={<ProtectedRoute requiredRole="customer_admin"><div style={{ padding: '40px' }}><h2>Microsoft 365 Analytics</h2><p>Coming in Phase 6!</p></div></ProtectedRoute>} />
            <Route path="/vulnerabilities" element={<ProtectedRoute requiredRole="customer_admin"><div style={{ padding: '40px' }}><h2>Vulnerability Scan</h2><p>Coming in Phase 6!</p></div></ProtectedRoute>} />
            <Route path="/helpdesk" element={<ProtectedRoute requiredRole="customer_admin"><div style={{ padding: '40px' }}><h2>IT Helpdesk</h2><p>Coming in Phase 5!</p></div></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><div style={{ padding: '40px' }}><h2>Settings</h2><p>Coming in Phase 2!</p></div></ProtectedRoute>} />

            {/* Cyproteck Admin Routes */}
            <Route
              path="/cyproteck/dashboard"
              element={
                <ProtectedRoute requiredRole="cyproteck_admin">
                  <div style={{ padding: '40px' }}><h2>Cyproteck Admin Dashboard</h2><p>Multi-tenant view coming in Phase 2!</p></div>
                </ProtectedRoute>
              }
            />
            <Route path="/customers" element={<ProtectedRoute requiredRole="cyproteck_admin"><div style={{ padding: '40px' }}><h2>Customers Management</h2><p>Coming in Phase 2!</p></div></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute requiredRole="cyproteck_admin"><div style={{ padding: '40px' }}><h2>Cross-Customer Analytics</h2><p>Coming in Phase 2!</p></div></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute requiredRole="cyproteck_admin"><div style={{ padding: '40px' }}><h2>All Alerts</h2><p>Coming in Phase 4!</p></div></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<div style={{ padding: '40px', textAlign: 'center' }}><h2>404 - Page Not Found</h2></div>} />
          </Routes>
        </DashboardLayout>
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <Login />
      </UnauthenticatedTemplate>
    </Router>
  );
}

/**
 * Main App Wrapper with MSAL Provider
 */
function App({ msalInstance }) {
  return (
    <MsalProvider instance={msalInstance}>
      <AppContent />
    </MsalProvider>
  );
}

export default App;

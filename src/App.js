import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MsalProvider, useMsal, useIsAuthenticated } from '@azure/msal-react';
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { msalConfig } from './authConfig';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Setup navigation handler for redirect after login
msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS) {
    console.log('Login successful!');
    const account = event.payload.account;
    msalInstance.setActiveAccount(account);
  }
});

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
function ProtectedRoute({ children }) {
  const isAuthenticated = useIsAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

/**
 * Main App Component with Routing
 */
function AppContent() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    // Handle redirect promise on page load
    instance.handleRedirectPromise().catch((error) => {
      console.error('Redirect error:', error);
    });
  }, [instance]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login Route - redirect to dashboard if already authenticated */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            } 
          />
          
          {/* Protected Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Default Route - redirect based on auth status */}
          <Route
            path="/"
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Navigate to="/login" replace />
            }
          />
          
          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

/**
 * Main App Wrapper with MSAL Provider
 */
function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AppContent />
    </MsalProvider>
  );
}

export default App;

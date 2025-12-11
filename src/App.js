import React from 'react';
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

/**
 * Simple App - Just Login and Dashboard
 * Back to working version before layout updates
 */
function AppContent() {
  return (
    <div className="App">
      <AuthenticatedTemplate>
        <Dashboard />
      </AuthenticatedTemplate>
      
      <UnauthenticatedTemplate>
        <Login />
      </UnauthenticatedTemplate>
    </div>
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

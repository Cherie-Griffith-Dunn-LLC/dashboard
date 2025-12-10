import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import './DashboardLayout.css';

/**
 * Main Dashboard Layout Component
 * Provides the shell for all dashboard pages with sidebar, topbar, and content area
 */
function DashboardLayout({ children, userRole = 'employee' }) {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get user information
  const user = accounts[0];
  const userName = user?.name || 'User';
  const userEmail = user?.username || '';

  /**
   * Handle Logout
   */
  const handleLogout = () => {
    instance.logoutPopup().catch((error) => {
      console.error('Logout error:', error);
    });
  };

  /**
   * Toggle Sidebar
   */
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  /**
   * Toggle Dark Mode
   */
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`dashboard-layout ${darkMode ? 'dark-mode' : ''}`}>
      {/* Sidebar Navigation */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        userRole={userRole}
        onToggle={toggleSidebar}
      />

      {/* Main Content Area */}
      <div className={`dashboard-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Top Bar */}
        <TopBar 
          userName={userName}
          userEmail={userEmail}
          onLogout={handleLogout}
          onToggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
          onToggleSidebar={toggleSidebar}
        />

        {/* Page Content */}
        <div className="dashboard-content">
          {children}
        </div>
      </div>

      {/* Copilot Chat Widget (Bottom Right) */}
      <button className="copilot-widget" title="Chat with Copilot">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <span>Ask Copilot</span>
      </button>
    </div>
  );
}

export default DashboardLayout;

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import './Dashboard.css';

// Import page components
import DashboardHome from './pages/DashboardHome';
import SecurityScorePage from './pages/SecurityScorePage';
import ThreatsPage from './pages/ThreatsPage';
import TrainingPage from './pages/TrainingPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

/**
 * CYPROSECURE Dashboard - With Organization Selector
 * Same sidebar for everyone, just switch which org you're viewing
 */
function DashboardContent() {
  const { instance, accounts } = useMsal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState('all');
  const location = useLocation();

  const user = accounts[0];
  const userName = user?.name || 'User';

  // Mock organizations list (replace with real data later)
  const organizations = [
    { id: 'all', name: 'All Organizations' },
    { id: 'org1', name: 'Acme Healthcare' },
    { id: 'org2', name: 'Tech Solutions Inc' },
    { id: 'org3', name: 'Finance Group LLC' },
  ];

  const handleLogout = () => {
    instance.logoutPopup().catch((error) => {
      console.error('Logout error:', error);
    });
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleOrgChange = (e) => {
    setSelectedOrg(e.target.value);
  };

  // Check if current path matches
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`dashboard-layout ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* Sidebar - SAME AS BEFORE */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <img 
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="CYPROSECURE" 
            className="logo-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          <div className="logo-fallback" style={{display: 'none'}}>C</div>
          {!sidebarCollapsed && (
            <div className="logo-text">
              <h2>CYPROSECURE</h2>
              <p>Security Platform</p>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
            <span className="nav-icon">📊</span>
            {!sidebarCollapsed && <span className="nav-label">Dashboard</span>}
          </Link>
          
          <Link to="/security" className={`nav-item ${isActive('/security') ? 'active' : ''}`}>
            <span className="nav-icon">🛡️</span>
            {!sidebarCollapsed && <span className="nav-label">Security Score</span>}
          </Link>
          
          <Link to="/threats" className={`nav-item ${isActive('/threats') ? 'active' : ''}`}>
            <span className="nav-icon">⚠️</span>
            {!sidebarCollapsed && (
              <>
                <span className="nav-label">Threats</span>
                <span className="nav-badge">8</span>
              </>
            )}
          </Link>
          
          <Link to="/training" className={`nav-item ${isActive('/training') ? 'active' : ''}`}>
            <span className="nav-icon">🎓</span>
            {!sidebarCollapsed && (
              <>
                <span className="nav-label">Training</span>
                <span className="nav-badge">2</span>
              </>
            )}
          </Link>
          
          <Link to="/alerts" className={`nav-item ${isActive('/alerts') ? 'active' : ''}`}>
            <span className="nav-icon">🚨</span>
            {!sidebarCollapsed && (
              <>
                <span className="nav-label">Alerts</span>
                <span className="nav-badge">3</span>
              </>
            )}
          </Link>
          
          <Link to="/reports" className={`nav-item ${isActive('/reports') ? 'active' : ''}`}>
            <span className="nav-icon">📈</span>
            {!sidebarCollapsed && <span className="nav-label">Reports</span>}
          </Link>
          
          <Link to="/settings" className={`nav-item ${isActive('/settings') ? 'active' : ''}`}>
            <span className="nav-icon">⚙️</span>
            {!sidebarCollapsed && <span className="nav-label">Settings</span>}
          </Link>
        </nav>

        {/* Organization Selector - NEW */}
        {!sidebarCollapsed && (
          <div className="org-selector">
            <label>View Organization:</label>
            <select value={selectedOrg} onChange={handleOrgChange}>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>
        )}

        <button className="sidebar-collapse-btn" onClick={toggleSidebar}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            {sidebarCollapsed ? (
              <path d="M7 10l5 5V5l-5 5z"/>
            ) : (
              <path d="M13 10l-5 5V5l5 5z"/>
            )}
          </svg>
        </button>
      </aside>

      {/* Main Content */}
      <div className={`dashboard-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Top Bar */}
        <header className="top-bar">
          <div className="top-bar-left">
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
            <h1 className="page-title">Security Dashboard</h1>
          </div>
          <div className="top-bar-right">
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <div className="user-profile">
              <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
              <span className="user-name">{userName}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
              </svg>
              Logout
            </button>
          </div>
        </header>

        {/* Routes */}
        <div className="content-area">
          <Routes>
            <Route path="/" element={<DashboardHome userName={userName} selectedOrg={selectedOrg} />} />
            <Route path="/dashboard" element={<DashboardHome userName={userName} selectedOrg={selectedOrg} />} />
            <Route path="/security" element={<SecurityScorePage selectedOrg={selectedOrg} />} />
            <Route path="/threats" element={<ThreatsPage selectedOrg={selectedOrg} />} />
            <Route path="/training" element={<TrainingPage selectedOrg={selectedOrg} />} />
            <Route path="/alerts" element={<AlertsPage selectedOrg={selectedOrg} />} />
            <Route path="/reports" element={<ReportsPage selectedOrg={selectedOrg} />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <Router>
      <DashboardContent />
    </Router>
  );
}

export default Dashboard;

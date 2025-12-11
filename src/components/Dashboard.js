import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import './Dashboard.css';

// Import page components
import EmployeeDashboardPage from './pages/EmployeeDashboardPage';
import SecurityScorePage from './pages/SecurityScorePage';
import ThreatsPage from './pages/ThreatsPage';
import TrainingPage from './pages/TrainingPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import CustomersPage from './pages/CustomersPage';
import UsersPage from './pages/UsersPage';
import AnalyticsPage from './pages/AnalyticsPage';

/**
 * CYPROSECURE - Complete Multi-Tenant Dashboard
 * Roles: cyproteck_admin, customer_admin, employee
 */
function Dashboard() {
  const { instance, accounts } = useMsal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [userRole, setUserRole] = useState('employee'); // Default role

  const user = accounts[0];
  const userName = user?.name || 'User';

  // Get role from localStorage (temporary - will come from Azure AD token)
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') || 'employee';
    setUserRole(storedRole);
  }, []);

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

  // Role selector (temporary - for testing)
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setUserRole(newRole);
    localStorage.setItem('userRole', newRole);
    window.location.reload(); // Refresh to update navigation
  };

  // Navigation items based on role
  const getNavigationItems = () => {
    if (userRole === 'cyproteck_admin') {
      return [
        { path: '/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/customers', icon: '🏢', label: 'Customers' },
        { path: '/analytics', icon: '📈', label: 'Analytics' },
        { path: '/training', icon: '🎓', label: 'Training' },
        { path: '/alerts', icon: '🚨', label: 'Alerts', badge: 3 },
        { path: '/reports', icon: '📄', label: 'Reports' },
        { path: '/settings', icon: '⚙️', label: 'Settings' },
      ];
    } else if (userRole === 'customer_admin') {
      return [
        { path: '/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/users', icon: '👥', label: 'Users' },
        { path: '/security', icon: '🛡️', label: 'Security' },
        { path: '/reports', icon: '📄', label: 'Reports' },
        { path: '/training', icon: '🎓', label: 'Training' },
        { path: '/alerts', icon: '🚨', label: 'Alerts', badge: 3 },
        { path: '/settings', icon: '⚙️', label: 'Settings' },
      ];
    } else { // employee
      return [
        { path: '/dashboard', icon: '📊', label: 'My Dashboard' },
        { path: '/security', icon: '🛡️', label: 'Security Score' },
        { path: '/training', icon: '🎓', label: 'My Training', badge: 2 },
        { path: '/alerts', icon: '🚨', label: 'My Alerts', badge: 3 },
        { path: '/reports', icon: '📄', label: 'Reports' },
        { path: '/settings', icon: '⚙️', label: 'Settings' },
      ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <Router>
      <div className={`dashboard-layout ${darkMode ? 'dark-theme' : 'light-theme'}`}>
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-logo">
            <img 
              src={`${process.env.PUBLIC_URL}/logo.png`}
              alt="CYPROSECURE" 
              className="logo-image"
              onError={(e) => {
                // Fallback if logo doesn't load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="logo-fallback" style={{display: 'none', width: '38px', height: '38px', background: 'linear-gradient(135deg, #5de4c7 0%, #4ea8de 100%)', borderRadius: '8px', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', color: '#0f1419'}}>C</div>
            {!sidebarCollapsed && (
              <div className="logo-text">
                <h2>CYPROSECURE</h2>
                <p>Security Platform</p>
              </div>
            )}
          </div>

          <nav className="sidebar-nav">
            {navigationItems.map((item, index) => (
              <Link 
                key={index}
                to={item.path} 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {!sidebarCollapsed && (
                  <>
                    <span className="nav-label">{item.label}</span>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                  </>
                )}
              </Link>
            ))}
          </nav>

          {/* Role Selector (Temporary - for testing) */}
          {!sidebarCollapsed && (
            <div className="role-selector">
              <label>Test Role:</label>
              <select value={userRole} onChange={handleRoleChange}>
                <option value="employee">Employee</option>
                <option value="customer_admin">Customer Admin</option>
                <option value="cyproteck_admin">Cyproteck Admin</option>
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
              <h1 className="page-title">
                {userRole === 'cyproteck_admin' && 'Cyproteck Admin Dashboard'}
                {userRole === 'customer_admin' && 'Customer Admin Dashboard'}
                {userRole === 'employee' && 'Security Dashboard'}
              </h1>
            </div>
            <div className="top-bar-right">
              <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
                {darkMode ? '☀️' : '🌙'}
              </button>
              <div className="user-profile">
                <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
                <div className="user-info-text">
                  <span className="user-name">{userName}</span>
                  <span className="user-role-label">
                    {userRole === 'cyproteck_admin' && 'Cyproteck Admin'}
                    {userRole === 'customer_admin' && 'Customer Admin'}
                    {userRole === 'employee' && 'Employee'}
                  </span>
                </div>
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
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<EmployeeDashboardPage userRole={userRole} userName={userName} />} />
              <Route path="/security" element={<SecurityScorePage userRole={userRole} />} />
              <Route path="/threats" element={<ThreatsPage userRole={userRole} />} />
              <Route path="/training" element={<TrainingPage userRole={userRole} />} />
              <Route path="/alerts" element={<AlertsPage userRole={userRole} />} />
              <Route path="/reports" element={<ReportsPage userRole={userRole} />} />
              <Route path="/settings" element={<SettingsPage userRole={userRole} />} />
              
              {/* Admin-only routes */}
              {userRole === 'cyproteck_admin' && (
                <>
                  <Route path="/customers" element={<CustomersPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                </>
              )}
              
              {/* Customer admin routes */}
              {userRole === 'customer_admin' && (
                <Route path="/users" element={<UsersPage />} />
              )}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default Dashboard;

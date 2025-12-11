import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import './Dashboard.css';

/**
 * Premium Luxury Dashboard with Sidebar
 * Sophisticated, Professional, Enterprise-Grade Design
 */
function Dashboard() {
  const { instance, accounts } = useMsal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const user = accounts[0];
  const userName = user?.name || 'User';

  // Mock data
  const employeeData = {
    securityScore: 85,
    threatsBlocked: 127,
    trainingProgress: 75,
    activeAlerts: 3,
  };

  const handleLogout = () => {
    instance.logoutPopup().catch((error) => {
      console.error('Logout error:', error);
    });
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="dashboard-layout">
      {/* Luxury Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">C</div>
          {!sidebarCollapsed && (
            <div className="logo-text">
              <h2>CYPROSECURE</h2>
              <p>Security Platform</p>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          <a href="#dashboard" className="nav-item active">
            <span className="nav-icon">📊</span>
            {!sidebarCollapsed && <span className="nav-label">Dashboard</span>}
          </a>
          <a href="#security" className="nav-item">
            <span className="nav-icon">🛡️</span>
            {!sidebarCollapsed && <span className="nav-label">Security Score</span>}
          </a>
          <a href="#training" className="nav-item">
            <span className="nav-icon">🎓</span>
            {!sidebarCollapsed && (
              <>
                <span className="nav-label">Training</span>
                <span className="nav-badge">2</span>
              </>
            )}
          </a>
          <a href="#alerts" className="nav-item">
            <span className="nav-icon">🚨</span>
            {!sidebarCollapsed && (
              <>
                <span className="nav-label">Alerts</span>
                <span className="nav-badge">3</span>
              </>
            )}
          </a>
          <a href="#reports" className="nav-item">
            <span className="nav-icon">📈</span>
            {!sidebarCollapsed && <span className="nav-label">Reports</span>}
          </a>
          <a href="#help" className="nav-item">
            <span className="nav-icon">❓</span>
            {!sidebarCollapsed && <span className="nav-label">Help</span>}
          </a>
        </nav>

        <button className="sidebar-collapse-btn" onClick={toggleSidebar}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
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
        {/* Premium Top Bar */}
        <header className="top-bar">
          <div className="top-bar-left">
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
            <h1 className="page-title">Security Dashboard</h1>
          </div>
          <div className="top-bar-right">
            <div className="user-profile">
              <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
              <span className="user-name">{userName}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
              </svg>
              Logout
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {/* Welcome Section */}
          <div className="welcome-section">
            <div className="welcome-text">
              <h1>Welcome back, {userName.split(' ')[0]}</h1>
              <p>Your security posture is looking strong today</p>
            </div>
            <div className="score-display">
              <div className="score-ring">
                <svg viewBox="0 0 100 100">
                  <circle className="ring-bg" cx="50" cy="50" r="45"/>
                  <circle 
                    className="ring-progress" 
                    cx="50" 
                    cy="50" 
                    r="45"
                    style={{ strokeDasharray: `${employeeData.securityScore * 2.83} 283` }}
                  />
                </svg>
                <div className="score-value">{employeeData.securityScore}</div>
              </div>
              <div className="score-info">
                <div className="score-label">Security Score</div>
                <div className="score-status">Excellent</div>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-icon">🛡️</span>
                <span className="metric-trend up">+12</span>
              </div>
              <div className="metric-value">{employeeData.threatsBlocked}</div>
              <div className="metric-label">Threats Blocked</div>
              <div className="metric-sublabel">Last 30 days</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-icon">🎓</span>
                <span className="metric-trend neutral">2 left</span>
              </div>
              <div className="metric-value">{employeeData.trainingProgress}%</div>
              <div className="metric-label">Training Progress</div>
              <div className="metric-sublabel">On track</div>
            </div>

            <div className="metric-card alert">
              <div className="metric-header">
                <span className="metric-icon">🚨</span>
                <span className="metric-trend warning">Action needed</span>
              </div>
              <div className="metric-value">{employeeData.activeAlerts}</div>
              <div className="metric-label">Active Alerts</div>
              <div className="metric-sublabel">Requires attention</div>
            </div>

            <div className="metric-card success">
              <div className="metric-header">
                <span className="metric-icon">✅</span>
                <span className="metric-trend success">Secure</span>
              </div>
              <div className="metric-value">Protected</div>
              <div className="metric-label">Current Status</div>
              <div className="metric-sublabel">All systems operational</div>
            </div>
          </div>

          {/* Alerts Section */}
          <div className="section-card">
            <div className="section-header">
              <h2>Recent Security Alerts</h2>
              <button className="view-all">View All →</button>
            </div>
            <div className="alerts-list">
              <div className="alert-item medium">
                <div className="alert-left">
                  <div className="alert-icon">⚠️</div>
                  <div className="alert-content">
                    <div className="alert-title">Suspicious Login Attempt</div>
                    <div className="alert-desc">Login attempt from unknown device in New York</div>
                    <div className="alert-time">2 hours ago</div>
                  </div>
                </div>
                <button className="alert-btn">Review</button>
              </div>

              <div className="alert-item low">
                <div className="alert-left">
                  <div className="alert-icon">ℹ️</div>
                  <div className="alert-content">
                    <div className="alert-title">Password Expiring Soon</div>
                    <div className="alert-desc">Your password will expire in 7 days</div>
                    <div className="alert-time">1 day ago</div>
                  </div>
                </div>
                <button className="alert-btn">Change Password</button>
              </div>

              <div className="alert-item success">
                <div className="alert-left">
                  <div className="alert-icon">✅</div>
                  <div className="alert-content">
                    <div className="alert-title">Security Update Complete</div>
                    <div className="alert-desc">Your device has been updated successfully</div>
                    <div className="alert-time">2 days ago</div>
                  </div>
                </div>
                <button className="alert-btn secondary">Dismiss</button>
              </div>
            </div>
          </div>

          {/* Training Section */}
          <div className="section-card">
            <div className="section-header">
              <h2>Assigned Training</h2>
              <button className="view-all">View All →</button>
            </div>
            <div className="training-grid">
              <div className="training-card">
                <div className="training-icon">🔒</div>
                <h3>Password Security</h3>
                <p>Learn best practices for password management</p>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '60%' }}></div>
                  </div>
                  <span className="progress-label">60% Complete</span>
                </div>
                <button className="training-btn">Continue</button>
              </div>

              <div className="training-card new">
                <div className="new-badge">NEW</div>
                <div className="training-icon">📧</div>
                <h3>Phishing Awareness</h3>
                <p>Recognize and avoid phishing attacks</p>
                <div className="training-meta">
                  <span>⏱️ 15 min</span>
                  <span>🎯 Due in 3 days</span>
                </div>
                <button className="training-btn primary">Start Now</button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="section-card">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="actions-grid">
              <button className="action-card">
                <span className="action-icon">🔑</span>
                <span className="action-label">Change Password</span>
              </button>
              <button className="action-card">
                <span className="action-icon">📱</span>
                <span className="action-label">Enable MFA</span>
              </button>
              <button className="action-card">
                <span className="action-icon">🆘</span>
                <span className="action-label">Report Issue</span>
              </button>
              <button className="action-card">
                <span className="action-icon">📊</span>
                <span className="action-label">View Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import './Dashboard.css';

/**
 * CYPROSECURE Dashboard with Theme Toggle
 * Light & Dark Mode | Professional Sidebar | Cybersecurity Focus
 */
function Dashboard() {
  const { instance, accounts } = useMsal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Default to dark theme

  const user = accounts[0];
  const userName = user?.name || 'User';

  // Mock cybersecurity data
  const securityData = {
    securityScore: 85,
    threatsBlocked: 127,
    highAlerts: 8,
    mediumAlerts: 6,
    lowAlerts: 10,
    trainingProgress: 75,
    activeAlerts: 3,
    secureConnections: 1523,
    monitored: 32,
  };

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

  return (
    <div className={`dashboard-layout ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* Professional Sidebar */}
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
          <a href="#threats" className="nav-item">
            <span className="nav-icon">⚠️</span>
            {!sidebarCollapsed && (
              <>
                <span className="nav-label">Threats</span>
                <span className="nav-badge">{securityData.highAlerts}</span>
              </>
            )}
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
                <span className="nav-badge">{securityData.activeAlerts}</span>
              </>
            )}
          </a>
          <a href="#reports" className="nav-item">
            <span className="nav-icon">📈</span>
            {!sidebarCollapsed && <span className="nav-label">Reports</span>}
          </a>
          <a href="#settings" className="nav-item">
            <span className="nav-icon">⚙️</span>
            {!sidebarCollapsed && <span className="nav-label">Settings</span>}
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
        {/* Top Bar */}
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
            {/* Theme Toggle */}
            <button className="theme-toggle" onClick={toggleTheme} title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              {darkMode ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                </svg>
              )}
            </button>
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
          {/* Hero Section with Security Score */}
          <div className="hero-section">
            <div className="hero-content">
              <h1>Welcome back, {userName.split(' ')[0]}</h1>
              <p>Your security posture is strong. {securityData.activeAlerts} items need attention.</p>
            </div>
            <div className="hero-score">
              <div className="score-ring">
                <svg viewBox="0 0 100 100">
                  <circle className="ring-bg" cx="50" cy="50" r="45"/>
                  <circle 
                    className="ring-progress" 
                    cx="50" 
                    cy="50" 
                    r="45"
                    style={{ strokeDasharray: `${securityData.securityScore * 2.83} 283` }}
                  />
                </svg>
                <div className="score-value">{securityData.securityScore}</div>
              </div>
              <div className="score-info">
                <div className="score-label">Security Score</div>
                <div className="score-status">Excellent</div>
              </div>
            </div>
          </div>

          {/* Cybersecurity Metrics Grid */}
          <div className="cyber-grid">
            {/* Threats Card */}
            <div className="cyber-card threats-card">
              <div className="card-header">
                <h3>THREATS</h3>
                <span className="card-icon">🛡️</span>
              </div>
              <div className="threats-total">{securityData.highAlerts + securityData.mediumAlerts + securityData.lowAlerts}</div>
              <div className="threats-breakdown">
                <div className="threat-item high">
                  <span className="threat-count">{securityData.highAlerts}</span>
                  <span className="threat-label">High</span>
                </div>
                <div className="threat-item medium">
                  <span className="threat-count">{securityData.mediumAlerts}</span>
                  <span className="threat-label">Medium</span>
                </div>
                <div className="threat-item low">
                  <span className="threat-count">{securityData.lowAlerts}</span>
                  <span className="threat-label">Low</span>
                </div>
              </div>
            </div>

            {/* Network Monitoring Card */}
            <div className="cyber-card monitoring-card">
              <div className="card-header">
                <h3>NETWORK MONITORING</h3>
              </div>
              <div className="monitoring-ring">
                <svg viewBox="0 0 100 100">
                  <circle className="ring-bg" cx="50" cy="50" r="40"/>
                  <circle 
                    className="ring-progress" 
                    cx="50" 
                    cy="50" 
                    r="40"
                    style={{ strokeDasharray: `${72 * 2.51} 251` }}
                  />
                </svg>
                <div className="ring-value">72%</div>
              </div>
              <div className="monitoring-stats">
                <div className="stat-item">
                  <span className="stat-value">{securityData.secureConnections}</span>
                  <span className="stat-label">Secure connections</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{securityData.monitored}</span>
                  <span className="stat-label">Monitored</span>
                </div>
              </div>
            </div>

            {/* Threats Blocked Card */}
            <div className="cyber-card blocked-card">
              <div className="card-header">
                <h3>THREATS BLOCKED</h3>
                <span className="trend-up">+12</span>
              </div>
              <div className="blocked-value">{securityData.threatsBlocked}</div>
              <div className="blocked-label">Last 30 days</div>
              <div className="mini-chart">
                <div className="chart-bar" style={{height: '60%'}}></div>
                <div className="chart-bar" style={{height: '75%'}}></div>
                <div className="chart-bar" style={{height: '45%'}}></div>
                <div className="chart-bar" style={{height: '85%'}}></div>
                <div className="chart-bar" style={{height: '70%'}}></div>
                <div className="chart-bar" style={{height: '90%'}}></div>
                <div className="chart-bar" style={{height: '65%'}}></div>
              </div>
            </div>

            {/* Training Progress Card */}
            <div className="cyber-card training-card">
              <div className="card-header">
                <h3>TRAINING PROGRESS</h3>
              </div>
              <div className="training-ring">
                <svg viewBox="0 0 100 100">
                  <circle className="ring-bg" cx="50" cy="50" r="40"/>
                  <circle 
                    className="ring-progress" 
                    cx="50" 
                    cy="50" 
                    r="40"
                    style={{ strokeDasharray: `${securityData.trainingProgress * 2.51} 251` }}
                  />
                </svg>
                <div className="ring-value">{securityData.trainingProgress}%</div>
              </div>
              <div className="training-info">
                <div className="info-item">2 courses remaining</div>
                <div className="info-item">On track for completion</div>
              </div>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="section-card">
            <div className="section-header">
              <h2>Recent Security Alerts</h2>
              <button className="view-all">View All →</button>
            </div>
            <div className="alerts-list">
              <div className="alert-item high">
                <div className="alert-left">
                  <div className="alert-severity">HIGH</div>
                  <div className="alert-content">
                    <div className="alert-title">Suspicious Login Attempt</div>
                    <div className="alert-desc">Login attempt from unknown device in New York</div>
                    <div className="alert-time">2 hours ago</div>
                  </div>
                </div>
                <button className="alert-btn">Review</button>
              </div>

              <div className="alert-item medium">
                <div className="alert-left">
                  <div className="alert-severity">MEDIUM</div>
                  <div className="alert-content">
                    <div className="alert-title">Unusual Network Activity</div>
                    <div className="alert-desc">Increased data transfer detected on port 8080</div>
                    <div className="alert-time">5 hours ago</div>
                  </div>
                </div>
                <button className="alert-btn">Investigate</button>
              </div>

              <div className="alert-item low">
                <div className="alert-left">
                  <div className="alert-severity">LOW</div>
                  <div className="alert-content">
                    <div className="alert-title">Password Expiring Soon</div>
                    <div className="alert-desc">Your password will expire in 7 days</div>
                    <div className="alert-time">1 day ago</div>
                  </div>
                </div>
                <button className="alert-btn secondary">Change Password</button>
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
                <span className="action-label">Report Incident</span>
              </button>
              <button className="action-card">
                <span className="action-icon">📊</span>
                <span className="action-label">View Full Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

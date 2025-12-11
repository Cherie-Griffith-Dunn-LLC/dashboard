import React from 'react';
import { useMsal } from '@azure/msal-react';
import './Dashboard.css';

/**
 * Beautiful Dashboard Component
 * Combines working header with gorgeous UI design
 */
function Dashboard() {
  const { instance, accounts } = useMsal();

  const user = accounts[0];
  const userName = user?.name || 'User';

  // Mock data (will be replaced with real API data)
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

  return (
    <div className="dashboard-container">
      {/* Professional Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-logo">CYPROSECURE</h1>
          <span className="dashboard-subtitle">Security Dashboard</span>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
            <span className="user-name">{userName}</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="welcome-content">
            <h1>Welcome back, {userName.split(' ')[0]}! 👋</h1>
            <p>Here's your security overview for today</p>
          </div>
          <div className="security-score-display">
            <div className="score-circle">
              <svg className="score-ring" viewBox="0 0 120 120">
                <circle className="score-ring-bg" cx="60" cy="60" r="52" />
                <circle
                  className="score-ring-progress"
                  cx="60"
                  cy="60"
                  r="52"
                  style={{
                    strokeDasharray: `${employeeData.securityScore * 3.27} 327`,
                  }}
                />
              </svg>
              <div className="score-number">{employeeData.securityScore}</div>
            </div>
            <div className="score-label">
              <div className="score-title">Security Score</div>
              <div className="score-status good">Excellent! 🎉</div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon threats">🛡️</div>
            <div className="metric-content">
              <div className="metric-value">{employeeData.threatsBlocked}</div>
              <div className="metric-label">Threats Blocked</div>
              <div className="metric-change positive">↑ 12 from last week</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon training">🎓</div>
            <div className="metric-content">
              <div className="metric-value">{employeeData.trainingProgress}%</div>
              <div className="metric-label">Training Progress</div>
              <div className="metric-change neutral">2 courses remaining</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon alerts">🚨</div>
            <div className="metric-content">
              <div className="metric-value">{employeeData.activeAlerts}</div>
              <div className="metric-label">Active Alerts</div>
              <div className="metric-change negative">Requires attention</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon status">✅</div>
            <div className="metric-content">
              <div className="metric-value">Protected</div>
              <div className="metric-label">Current Status</div>
              <div className="metric-change positive">All systems secure</div>
            </div>
          </div>
        </div>

        {/* Recent Alerts Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Security Alerts</h2>
            <button className="view-all-btn">View All →</button>
          </div>
          <div className="alerts-list">
            <div className="alert-item medium">
              <div className="alert-severity">⚠️ Medium</div>
              <div className="alert-content">
                <div className="alert-title">Suspicious Login Attempt</div>
                <div className="alert-description">Login attempt from unknown device in New York</div>
                <div className="alert-time">2 hours ago</div>
              </div>
              <button className="alert-action">Review</button>
            </div>

            <div className="alert-item low">
              <div className="alert-severity">ℹ️ Low</div>
              <div className="alert-content">
                <div className="alert-title">Password Expiring Soon</div>
                <div className="alert-description">Your password will expire in 7 days</div>
                <div className="alert-time">1 day ago</div>
              </div>
              <button className="alert-action">Change Password</button>
            </div>

            <div className="alert-item info">
              <div className="alert-severity">✅ Info</div>
              <div className="alert-content">
                <div className="alert-title">Security Update Complete</div>
                <div className="alert-description">Your device has been updated successfully</div>
                <div className="alert-time">2 days ago</div>
              </div>
              <button className="alert-action">Dismiss</button>
            </div>
          </div>
        </div>

        {/* Training Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Assigned Training Courses</h2>
            <button className="view-all-btn">View All →</button>
          </div>
          <div className="training-grid">
            <div className="training-card">
              <div className="training-icon">🔒</div>
              <div className="training-info">
                <h3>Password Security Best Practices</h3>
                <p>Learn how to create and manage strong passwords</p>
                <div className="training-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '60%' }}></div>
                  </div>
                  <span className="progress-text">60% Complete</span>
                </div>
              </div>
              <button className="training-btn">Continue</button>
            </div>

            <div className="training-card new">
              <div className="training-badge">New</div>
              <div className="training-icon">📧</div>
              <div className="training-info">
                <h3>Phishing Awareness</h3>
                <p>Recognize and avoid phishing attacks</p>
                <div className="training-meta">
                  <span>⏱️ 15 min</span>
                  <span>🎯 Due in 3 days</span>
                </div>
              </div>
              <button className="training-btn primary">Start Now</button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-btn">
              <span className="action-icon">🔑</span>
              <span className="action-label">Change Password</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">📱</span>
              <span className="action-label">Enable MFA</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">🆘</span>
              <span className="action-label">Report Issue</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">📊</span>
              <span className="action-label">View Full Report</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

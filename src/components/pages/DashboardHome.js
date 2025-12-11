import React from 'react';

function DashboardHome({ userName, selectedOrg }) {
  // Mock data
  const data = {
    securityScore: 85,
    threatsBlocked: 127,
    activeAlerts: 3,
    trainingProgress: 75,
  };

  return (
    <div className="page-container">
      {/* Hero */}
      <div className="hero-compact">
        <div className="hero-text">
          <h1>Welcome, {userName?.split(' ')[0] || 'User'}</h1>
          <p>Security status: <span className="status-good">Excellent</span></p>
        </div>
        <div className="hero-score-compact">
          <div className="score-ring-small">
            <svg viewBox="0 0 80 80">
              <circle className="ring-bg" cx="40" cy="40" r="35"/>
              <circle 
                className="ring-progress" 
                cx="40" 
                cy="40" 
                r="35"
                style={{ strokeDasharray: `${data.securityScore * 2.2} 220` }}
              />
            </svg>
            <div className="score-num">{data.securityScore}</div>
          </div>
          <div className="score-label-small">Security Score</div>
        </div>
      </div>

      {/* Metrics */}
      <div className="metrics-compact">
        <div className="metric-box">
          <div className="metric-icon-sm">🛡️</div>
          <div className="metric-data">
            <div className="metric-val">{data.threatsBlocked}</div>
            <div className="metric-lbl">Threats Blocked</div>
          </div>
          <div className="metric-trend up">+12</div>
        </div>

        <div className="metric-box">
          <div className="metric-icon-sm">🚨</div>
          <div className="metric-data">
            <div className="metric-val">{data.activeAlerts}</div>
            <div className="metric-lbl">Active Alerts</div>
          </div>
          <div className="metric-trend warning">Action needed</div>
        </div>

        <div className="metric-box">
          <div className="metric-icon-sm">🎓</div>
          <div className="metric-data">
            <div className="metric-val">{data.trainingProgress}%</div>
            <div className="metric-lbl">Training Progress</div>
          </div>
          <div className="metric-trend neutral">2 left</div>
        </div>

        <div className="metric-box success">
          <div className="metric-icon-sm">✅</div>
          <div className="metric-data">
            <div className="metric-val">Protected</div>
            <div className="metric-lbl">Current Status</div>
          </div>
          <div className="metric-trend success">Secure</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="section-compact">
        <div className="section-hdr">
          <h2>Recent Activity</h2>
          <button className="view-all-sm">View All →</button>
        </div>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon success">✅</span>
            <div className="activity-content">
              <div className="activity-title">Training Completed</div>
              <div className="activity-desc">Password Security Best Practices</div>
            </div>
            <span className="activity-time">1 hour ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon warning">⚠️</span>
            <div className="activity-content">
              <div className="activity-title">Security Alert</div>
              <div className="activity-desc">Suspicious login attempt detected</div>
            </div>
            <span className="activity-time">3 hours ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon info">ℹ️</span>
            <div className="activity-content">
              <div className="activity-title">System Update</div>
              <div className="activity-desc">Security patches installed</div>
            </div>
            <span className="activity-time">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;

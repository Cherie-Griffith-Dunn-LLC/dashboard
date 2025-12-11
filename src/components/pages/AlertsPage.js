import React from 'react';

function AlertsPage({ userRole }) {
  const alerts = [
    { id: 1, severity: 'high', title: 'Suspicious Login Attempt', desc: 'Login attempt from unknown device in New York', time: '2 hours ago', status: 'active' },
    { id: 2, severity: 'medium', title: 'Unusual Network Activity', desc: 'Increased data transfer detected on port 8080', time: '5 hours ago', status: 'active' },
    { id: 3, severity: 'high', title: 'Failed MFA Verification', desc: 'Multiple failed authentication attempts', time: '1 day ago', status: 'active' },
    { id: 4, severity: 'low', title: 'Password Expiring Soon', desc: 'Your password will expire in 7 days', time: '1 day ago', status: 'active' },
    { id: 5, severity: 'medium', title: 'Outdated Software Detected', desc: 'System requires security updates', time: '2 days ago', status: 'resolved' },
  ];

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const highAlerts = activeAlerts.filter(a => a.severity === 'high').length;
  const mediumAlerts = activeAlerts.filter(a => a.severity === 'medium').length;
  const lowAlerts = activeAlerts.filter(a => a.severity === 'low').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🚨 Security Alerts</h1>
        <p>Monitor and respond to security events</p>
      </div>

      <div className="alerts-summary">
        <div className="summary-card high">
          <div className="summary-value">{highAlerts}</div>
          <div className="summary-label">High Priority</div>
        </div>
        <div className="summary-card medium">
          <div className="summary-value">{mediumAlerts}</div>
          <div className="summary-label">Medium Priority</div>
        </div>
        <div className="summary-card low">
          <div className="summary-value">{lowAlerts}</div>
          <div className="summary-label">Low Priority</div>
        </div>
        <div className="summary-card total">
          <div className="summary-value">{activeAlerts.length}</div>
          <div className="summary-label">Total Active</div>
        </div>
      </div>

      <div className="alerts-list-page">
        <div className="alerts-header">
          <h2>Active Alerts</h2>
          <div className="alerts-filters">
            <button className="filter-btn active">All</button>
            <button className="filter-btn">High</button>
            <button className="filter-btn">Medium</button>
            <button className="filter-btn">Low</button>
          </div>
        </div>

        {activeAlerts.map(alert => (
          <div key={alert.id} className={`alert-item-full ${alert.severity}`}>
            <div className="alert-severity-badge">{alert.severity.toUpperCase()}</div>
            <div className="alert-details">
              <h3>{alert.title}</h3>
              <p>{alert.desc}</p>
              <span className="alert-timestamp">{alert.time}</span>
            </div>
            <div className="alert-actions">
              <button className="action-btn primary">Investigate</button>
              <button className="action-btn secondary">Dismiss</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlertsPage;

import React from 'react';
import { useMsal } from '@azure/msal-react';
import './Dashboard.css';

/**
 * Simple Dashboard Component - Clean Version
 */
function Dashboard() {
  const { instance, accounts } = useMsal();

  const user = accounts[0];
  const userName = user?.name || 'User';

  const handleLogout = () => {
    instance.logoutPopup().catch((error) => {
      console.error('Logout error:', error);
    });
  };

  return (
    <div className="dashboard-container">
      {/* Simple Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-logo">CYPROSECURE</h1>
        </div>
        <div className="header-right">
          <span className="user-name">Welcome, {userName}</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>🎉 Dashboard is Working!</h2>
          <p>You successfully logged in to CYPROSECURE!</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">🛡️</div>
            <h3>Security Score</h3>
            <div className="card-value">85</div>
            <p className="card-label">Excellent</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🚨</div>
            <h3>Active Alerts</h3>
            <div className="card-value">3</div>
            <p className="card-label">Requires attention</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🎓</div>
            <h3>Training</h3>
            <div className="card-value">75%</div>
            <p className="card-label">In progress</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">✅</div>
            <h3>Threats Blocked</h3>
            <div className="card-value">127</div>
            <p className="card-label">Last 30 days</p>
          </div>
        </div>

        <div className="info-section">
          <h3>✨ What's Next?</h3>
          <p>Your dashboard is now working! We can add the beautiful UI design piece by piece.</p>
          <ul>
            <li>✅ Authentication working</li>
            <li>✅ Dashboard loading</li>
            <li>⏳ Beautiful UI design (Phase 2)</li>
            <li>⏳ Role-based navigation (Phase 2)</li>
            <li>⏳ Real-time metrics (Phase 3)</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

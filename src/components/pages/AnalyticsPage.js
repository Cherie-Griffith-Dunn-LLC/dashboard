import React from 'react';

function AnalyticsPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📈 Analytics</h1>
        <p>View system-wide analytics and trends</p>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Threats Blocked</h3>
          <div className="analytics-value">12,450</div>
          <div className="analytics-change up">↑ 15% from last month</div>
        </div>
        <div className="analytics-card">
          <h3>Average Security Score</h3>
          <div className="analytics-value">89</div>
          <div className="analytics-change up">↑ 3 points</div>
        </div>
        <div className="analytics-card">
          <h3>Training Completion</h3>
          <div className="analytics-value">78%</div>
          <div className="analytics-change down">↓ 2%</div>
        </div>
        <div className="analytics-card">
          <h3>Active Incidents</h3>
          <div className="analytics-value">24</div>
          <div className="analytics-change neutral">→ No change</div>
        </div>
      </div>

      <div className="section-compact">
        <h2>Threat Trends</h2>
        <div className="chart-placeholder">
          <p>📊 Chart visualization coming soon</p>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;

import React from 'react';

function ThreatsPage({ userRole }) {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>⚠️ Threat Detection</h1>
        <p>Monitor and analyze security threats</p>
      </div>

      <div className="threats-summary">
        <div className="summary-card high">
          <div className="summary-value">8</div>
          <div className="summary-label">Critical Threats</div>
        </div>
        <div className="summary-card medium">
          <div className="summary-value">6</div>
          <div className="summary-label">Medium Threats</div>
        </div>
        <div className="summary-card low">
          <div className="summary-value">10</div>
          <div className="summary-label">Low Threats</div>
        </div>
      </div>

      <div className="section-compact">
        <h2>Threat Timeline</h2>
        <p style={{color: 'var(--text-secondary)', padding: '20px', textAlign: 'center'}}>
          Threat monitoring dashboard with real-time detection
        </p>
      </div>
    </div>
  );
}

export default ThreatsPage;

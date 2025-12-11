import React from 'react';

function SecurityScorePage({ userRole }) {
  const score = 85;
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🛡️ Security Score</h1>
        <p>Your comprehensive security assessment</p>
      </div>

      <div className="score-detailed-card">
        <div className="score-main">
          <div className="score-ring-large">
            <svg viewBox="0 0 200 200">
              <circle className="ring-bg" cx="100" cy="100" r="85" strokeWidth="15"/>
              <circle 
                className="ring-progress" 
                cx="100" 
                cy="100" 
                r="85"
                strokeWidth="15"
                style={{ strokeDasharray: `${score * 5.34} 534` }}
              />
            </svg>
            <div className="score-large-num">{score}</div>
          </div>
          <div className="score-rating">
            <h2>Excellent</h2>
            <p>Your security posture is strong</p>
          </div>
        </div>

        <div className="score-breakdown">
          <h3>Score Breakdown</h3>
          <div className="score-category">
            <div className="category-header">
              <span>Password Strength</span>
              <span className="category-score">95/100</span>
            </div>
            <div className="category-bar">
              <div className="category-fill" style={{width: '95%', background: 'var(--success)'}}></div>
            </div>
          </div>
          <div className="score-category">
            <div className="category-header">
              <span>Multi-Factor Authentication</span>
              <span className="category-score">100/100</span>
            </div>
            <div className="category-bar">
              <div className="category-fill" style={{width: '100%', background: 'var(--success)'}}></div>
            </div>
          </div>
          <div className="score-category">
            <div className="category-header">
              <span>Device Security</span>
              <span className="category-score">80/100</span>
            </div>
            <div className="category-bar">
              <div className="category-fill" style={{width: '80%', background: 'var(--alert-medium)'}}></div>
            </div>
          </div>
          <div className="score-category">
            <div className="category-header">
              <span>Training Completion</span>
              <span className="category-score">75/100</span>
            </div>
            <div className="category-bar">
              <div className="category-fill" style={{width: '75%', background: 'var(--alert-low)'}}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="recommendations-section">
        <h2>Recommendations</h2>
        <div className="recommendation-card">
          <span className="rec-icon">🔑</span>
          <div className="rec-content">
            <h3>Enable Biometric Authentication</h3>
            <p>Add an extra layer of security with fingerprint or face recognition</p>
          </div>
          <button className="rec-button">Enable</button>
        </div>
        <div className="recommendation-card">
          <span className="rec-icon">🎓</span>
          <div className="rec-content">
            <h3>Complete Remaining Training</h3>
            <p>2 security training modules are pending completion</p>
          </div>
          <button className="rec-button">View</button>
        </div>
      </div>
    </div>
  );
}

export default SecurityScorePage;

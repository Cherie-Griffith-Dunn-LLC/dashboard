import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import './Login.css';

/**
 * Simple Login Component - Clean Version
 */
function Login() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((error) => {
      console.error('Login error:', error);
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">CYPROSECURE</h1>
          <p className="login-subtitle">Network Security Dashboard</p>
        </div>

        <div className="login-description">
          <p>
            Secure access to your cybersecurity command center.
            Monitor Microsoft Sentinel alerts, Defender threats, and
            network security metrics in real-time.
          </p>
        </div>

        <button className="login-button" onClick={handleLogin}>
          <svg width="21" height="21" viewBox="0 0 21 21" fill="currentColor">
            <path d="M10.5 0C4.701 0 0 4.701 0 10.5S4.701 21 10.5 21 21 16.299 21 10.5 16.299 0 10.5 0zm0 19.11c-4.748 0-8.61-3.862-8.61-8.61s3.862-8.61 8.61-8.61 8.61 3.862 8.61 8.61-3.862 8.61-8.61 8.61z"/>
            <path d="M14.168 6.832h-2.628V5.25c0-.435-.353-.788-.788-.788s-.788.353-.788.788v1.582H7.332c-.435 0-.788.353-.788.788s.353.788.788.788h2.632v2.632c0 .435.353.788.788.788s.788-.353.788-.788V8.408h2.628c.435 0 .788-.353.788-.788s-.353-.788-.788-.788z"/>
          </svg>
          Sign in with Microsoft
        </button>

        <div className="login-footer">
          <div className="login-feature">
            <span className="feature-icon">🔒</span>
            <span>Your credentials are securely managed by Microsoft Azure AD</span>
          </div>
          <div className="login-feature">
            <span className="feature-icon">✓</span>
            <span>Enterprise-grade authentication with MFA support</span>
          </div>
          <div className="login-feature">
            <span className="feature-icon">📊</span>
            <span>GitHub integration for developer workflows</span>
          </div>
        </div>

        <div className="login-help">
          <a href="#help">Need help?</a> Contact your administrator if you're unable to sign in.
        </div>
      </div>
    </div>
  );
}

export default Login;

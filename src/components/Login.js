import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import './Login.css';

/**
 * Login Component with Azure AD Authentication
 * Supports both popup and redirect login flows
 */
function Login() {
  const { instance } = useMsal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle Azure AD Login with Popup
   * Recommended for better user experience
   */
  const handleLoginPopup = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await instance.loginPopup(loginRequest);
      console.log('Login successful:', response);
      instance.setActiveAccount(response.account);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Azure AD Login with Redirect
   * Use this if popup is blocked or for mobile devices
   */
  const handleLoginRedirect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await instance.loginRedirect(loginRequest);
    } catch (err) {
      console.error('Login redirect error:', err);
      setError(err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo and Branding */}
        <div className="login-header">
          <img 
            src="/logo.png" 
            alt="CYPROTECK Logo" 
            className="login-logo"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h1 className="login-title">CYPROSECURE</h1>
          <h2 className="login-subtitle">Network Security Dashboard</h2>
        </div>

        {/* Login Description */}
        <div className="login-description">
          <p>
            Secure access to your cybersecurity command center. 
            Monitor Microsoft Sentinel alerts, Defender threats, and network security metrics in real-time.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="login-error">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Login Buttons */}
        <div className="login-buttons">
          <button
            onClick={handleLoginPopup}
            disabled={loading}
            className="login-button primary"
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/>
                </svg>
                Sign in with Microsoft
              </>
            )}
          </button>

          <button
            onClick={handleLoginRedirect}
            disabled={loading}
            className="login-button secondary"
          >
            Sign in (Redirect Mode)
          </button>
        </div>

        {/* Additional Info */}
        <div className="login-footer">
          <p className="login-info">
            🔒 Your credentials are securely managed by Microsoft Azure AD
          </p>
          <p className="login-info">
            ✓ Enterprise-grade authentication with MFA support
          </p>
          <p className="login-info">
            🔐 GitHub integration for developer workflows
          </p>
        </div>

        {/* Help Text */}
        <div className="login-help">
          <p>
            <strong>Need help?</strong> Contact your administrator if you're unable to sign in.
          </p>
        </div>
      </div>

      {/* Background Effect */}
      <div className="login-background">
        <div className="cyber-grid"></div>
      </div>
    </div>
  );
}

export default Login;

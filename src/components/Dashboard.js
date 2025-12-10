import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { sentinelRequest, defenderRequest, graphConfig } from '../authConfig';
import './Dashboard.css';

/**
 * Main Dashboard Component
 * Displays user info, security metrics, and Microsoft Sentinel/Defender data
 */
function Dashboard() {
  const { instance, accounts } = useMsal();
  const [user, setUser] = useState(null);
  const [githubInfo, setGithubInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Fetch User Profile from Microsoft Graph
   */
  const fetchUserProfile = async () => {
    try {
      const account = accounts[0];
      
      // Get access token for Microsoft Graph
      const response = await instance.acquireTokenSilent({
        scopes: ['User.Read'],
        account: account,
      });

      // Fetch user profile
      const graphResponse = await fetch(graphConfig.graphMeEndpoint, {
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
      });

      const userData = await graphResponse.json();
      setUser(userData);

      // Check for GitHub info in the token claims
      if (account.idTokenClaims) {
        const claims = account.idTokenClaims;
        // GitHub info will be in the claims if configured as identity provider
        if (claims.github_username || claims.preferred_username?.includes('github')) {
          setGithubInfo({
            username: claims.github_username || claims.preferred_username,
            email: claims.email,
          });
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  /**
   * Handle Logout
   */
  const handleLogout = () => {
    instance.logoutPopup().catch((error) => {
      console.error('Logout error:', error);
    });
  };

  /**
   * Fetch Sentinel Data (placeholder for actual implementation)
   */
  const fetchSentinelData = async () => {
    try {
      const account = accounts[0];
      const response = await instance.acquireTokenSilent({
        ...sentinelRequest,
        account: account,
      });

      // TODO: Implement actual Sentinel API calls
      console.log('Sentinel token acquired:', response.accessToken);
      
      // Example API call structure:
      // const sentinelData = await fetch('https://management.azure.com/subscriptions/{subscriptionId}/...', {
      //   headers: { Authorization: `Bearer ${response.accessToken}` }
      // });
      
    } catch (error) {
      console.error('Error fetching Sentinel data:', error);
    }
  };

  /**
   * Fetch Defender Data (placeholder for actual implementation)
   */
  const fetchDefenderData = async () => {
    try {
      const account = accounts[0];
      const response = await instance.acquireTokenSilent({
        ...defenderRequest,
        account: account,
      });

      // TODO: Implement actual Defender API calls
      console.log('Defender token acquired:', response.accessToken);
      
      // Example API call structure:
      // const defenderData = await fetch('https://api.securitycenter.microsoft.com/api/...', {
      //   headers: { Authorization: `Bearer ${response.accessToken}` }
      // });
      
    } catch (error) {
      console.error('Error fetching Defender data:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner-large"></div>
        <p>Loading your security dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">CYPROSECURE</h1>
          <span className="dashboard-subtitle">Security Command Center</span>
        </div>
        
        <div className="header-right">
          {/* User Profile */}
          <div className="user-profile">
            <div className="user-avatar">
              {user?.givenName?.[0]}{user?.surname?.[0]}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.displayName}</div>
              <div className="user-email">{user?.mail || user?.userPrincipalName}</div>
              {githubInfo && (
                <div className="user-github">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                  {githubInfo.username}
                </div>
              )}
            </div>
          </div>
          
          <button onClick={handleLogout} className="logout-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-tab ${activeTab === 'sentinel' ? 'active' : ''}`}
          onClick={() => setActiveTab('sentinel')}
        >
          🛡️ Sentinel Alerts
        </button>
        <button 
          className={`nav-tab ${activeTab === 'defender' ? 'active' : ''}`}
          onClick={() => setActiveTab('defender')}
        >
          🔒 Defender Threats
        </button>
        <button 
          className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="dashboard-section">
            <h2>Security Overview</h2>
            
            {/* Security Metrics */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">🚨</div>
                <div className="metric-value">0</div>
                <div className="metric-label">Active Incidents</div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">⚠️</div>
                <div className="metric-value">0</div>
                <div className="metric-label">High Priority Alerts</div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">🔍</div>
                <div className="metric-value">0</div>
                <div className="metric-label">Investigations</div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">✅</div>
                <div className="metric-value">100%</div>
                <div className="metric-label">System Health</div>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="welcome-section">
              <h3>Welcome, {user?.givenName}! 👋</h3>
              <p>
                Your CYPROSECURE dashboard is now connected to Microsoft Sentinel and Defender.
                Monitor security threats, incidents, and analytics in real-time.
              </p>
              
              <div className="integration-status">
                <div className="status-item">
                  <span className="status-indicator active"></span>
                  <span>Microsoft Sentinel Connected</span>
                </div>
                <div className="status-item">
                  <span className="status-indicator active"></span>
                  <span>Microsoft Defender Connected</span>
                </div>
                <div className="status-item">
                  <span className="status-indicator active"></span>
                  <span>Azure AD Authenticated</span>
                </div>
                {githubInfo && (
                  <div className="status-item">
                    <span className="status-indicator active"></span>
                    <span>GitHub Integration Active</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sentinel' && (
          <div className="dashboard-section">
            <h2>Microsoft Sentinel Alerts</h2>
            <div className="coming-soon">
              <p>🛡️ Sentinel integration is configured and ready.</p>
              <p>Connect your Sentinel workspace to view real-time alerts.</p>
              <button onClick={fetchSentinelData} className="action-button">
                Connect Sentinel Workspace
              </button>
            </div>
          </div>
        )}

        {activeTab === 'defender' && (
          <div className="dashboard-section">
            <h2>Microsoft Defender Threats</h2>
            <div className="coming-soon">
              <p>🔒 Defender integration is configured and ready.</p>
              <p>Connect your Defender instance to view threat analytics.</p>
              <button onClick={fetchDefenderData} className="action-button">
                Connect Defender
              </button>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="dashboard-section">
            <h2>Security Analytics</h2>
            <div className="coming-soon">
              <p>📈 Analytics dashboard coming soon.</p>
              <p>View trends, patterns, and security insights.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;

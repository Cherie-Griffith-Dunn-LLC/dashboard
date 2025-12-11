import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import './Dashboard.css';

/**
 * CYPROSECURE - Professional Refined Dashboard
 * Smaller sizing, Logo integration, World threat map
 */
function Dashboard() {
  const { instance, accounts } = useMsal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState('all');

  const user = accounts[0];
  const userName = user?.name || 'User';

  // Organizations list
  const organizations = [
    { id: 'all', name: 'All Organizations' },
    { id: 'acme', name: 'Acme Healthcare' },
    { id: 'tech', name: 'Tech Solutions Inc' },
    { id: 'finance', name: 'Finance Group LLC' },
  ];

  // Mock data
  const securityData = {
    securityScore: 85,
    threatsBlocked: 127,
    highAlerts: 8,
    mediumAlerts: 6,
    lowAlerts: 10,
    trainingProgress: 75,
    activeAlerts: 3,
    secureConnections: 1523,
    monitored: 32,
  };

  // World threat locations (mock data)
  const threatLocations = [
    { country: 'United States', threats: 45, lat: 37, lng: -95 },
    { country: 'China', threats: 38, lat: 35, lng: 105 },
    { country: 'Russia', threats: 32, lat: 60, lng: 100 },
    { country: 'Germany', threats: 18, lat: 51, lng: 10 },
    { country: 'Brazil', threats: 15, lat: -10, lng: -55 },
    { country: 'India', threats: 12, lat: 20, lng: 77 },
  ];

  const handleLogout = () => {
    instance.logoutPopup().catch((error) => {
      console.error('Logout error:', error);
    });
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleOrgChange = (e) => {
    setSelectedOrg(e.target.value);
  };

  return (
    <div className={`dashboard-layout ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* Sidebar with Logo */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <img 
            src="/logo.png" 
            alt="CYPROSECURE" 
            className="logo-image"
          />
          {!sidebarCollapsed && (
            <div className="logo-text">
              <h2>CYPROSECURE</h2>
              <p>Security Platform</p>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          <a href="#dashboard" className="nav-item active">
            <span className="nav-icon">📊</span>
            {!sidebarCollapsed && <span className="nav-label">Dashboard</span>}
          </a>
          <a href="#security" className="nav-item">
            <span className="nav-icon">🛡️</span>
            {!sidebarCollapsed && <span className="nav-label">Security</span>}
          </a>
          <a href="#threats" className="nav-item">
            <span className="nav-icon">⚠️</span>
            {!sidebarCollapsed && (
              <>
                <span className="nav-label">Threats</span>
                <span className="nav-badge">{securityData.highAlerts}</span>
              </>
            )}
          </a>
          <a href="#training" className="nav-item">
            <span className="nav-icon">🎓</span>
            {!sidebarCollapsed && (
              <>
                <span className="nav-label">Training</span>
                <span className="nav-badge">2</span>
              </>
            )}
          </a>
          <a href="#alerts" className="nav-item">
            <span className="nav-icon">🚨</span>
            {!sidebarCollapsed && (
              <>
                <span className="nav-label">Alerts</span>
                <span className="nav-badge">{securityData.activeAlerts}</span>
              </>
            )}
          </a>
          <a href="#reports" className="nav-item">
            <span className="nav-icon">📈</span>
            {!sidebarCollapsed && <span className="nav-label">Reports</span>}
          </a>
          <a href="#settings" className="nav-item">
            <span className="nav-icon">⚙️</span>
            {!sidebarCollapsed && <span className="nav-label">Settings</span>}
          </a>
        </nav>

        <button className="sidebar-collapse-btn" onClick={toggleSidebar}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            {sidebarCollapsed ? (
              <path d="M7 10l5 5V5l-5 5z"/>
            ) : (
              <path d="M13 10l-5 5V5l5 5z"/>
            )}
          </svg>
        </button>
      </aside>

      {/* Main Content */}
      <div className={`dashboard-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Top Bar */}
        <header className="top-bar">
          <div className="top-bar-left">
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
            <h1 className="page-title">Security Dashboard</h1>
          </div>
          <div className="top-bar-right">
            <button className="theme-toggle" onClick={toggleTheme}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <div className="user-profile">
              <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
              <span className="user-name">{userName}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
              </svg>
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="content-area">
          {/* Organization Selector */}
          <div className="org-selector-top">
            <select value={selectedOrg} onChange={handleOrgChange} className="org-dropdown">
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>

          {/* Compact Hero */}
          <div className="hero-compact">
            <div className="hero-text">
              <h1>Welcome, {userName.split(' ')[0]}</h1>
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
                    style={{ strokeDasharray: `${securityData.securityScore * 2.2} 220` }}
                  />
                </svg>
                <div className="score-num">{securityData.securityScore}</div>
              </div>
              <div className="score-label-small">Security Score</div>
            </div>
          </div>

          {/* Compact Metrics */}
          <div className="metrics-compact">
            <div className="metric-box">
              <div className="metric-icon-sm">🛡️</div>
              <div className="metric-data">
                <div className="metric-val">{securityData.threatsBlocked}</div>
                <div className="metric-lbl">Threats Blocked</div>
              </div>
              <div className="metric-trend up">+12</div>
            </div>

            <div className="metric-box">
              <div className="metric-icon-sm">⚠️</div>
              <div className="metric-data">
                <div className="metric-val">{securityData.highAlerts + securityData.mediumAlerts + securityData.lowAlerts}</div>
                <div className="metric-lbl">Active Threats</div>
              </div>
              <div className="metric-breakdown">
                <span className="high">{securityData.highAlerts}H</span>
                <span className="medium">{securityData.mediumAlerts}M</span>
                <span className="low">{securityData.lowAlerts}L</span>
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-icon-sm">🎓</div>
              <div className="metric-data">
                <div className="metric-val">{securityData.trainingProgress}%</div>
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

          {/* World Threat Map */}
          <div className="section-compact">
            <div className="section-hdr">
              <h2>Global Threat Map</h2>
              <span className="live-indicator">🔴 Live</span>
            </div>
            <div className="world-map-container">
              <div className="world-map">
                <div className="map-overlay">
                  <svg className="connection-lines" viewBox="0 0 1000 500">
                    {/* Connection lines */}
                    <line x1="200" y1="180" x2="500" y2="250" className="threat-line high" strokeDasharray="5,5">
                      <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite"/>
                    </line>
                    <line x1="700" y1="200" x2="500" y2="250" className="threat-line medium" strokeDasharray="5,5">
                      <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite"/>
                    </line>
                    <line x1="400" y1="350" x2="500" y2="250" className="threat-line low" strokeDasharray="5,5">
                      <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite"/>
                    </line>
                  </svg>
                  
                  {/* Threat markers */}
                  <div className="threat-marker high" style={{left: '20%', top: '36%'}} title="US: 45 threats">
                    <div className="marker-pulse"></div>
                  </div>
                  <div className="threat-marker high" style={{left: '70%', top: '40%'}} title="China: 38 threats">
                    <div className="marker-pulse"></div>
                  </div>
                  <div className="threat-marker medium" style={{left: '65%', top: '25%'}} title="Russia: 32 threats">
                    <div className="marker-pulse"></div>
                  </div>
                  <div className="threat-marker medium" style={{left: '48%', top: '30%'}} title="Germany: 18 threats">
                    <div className="marker-pulse"></div>
                  </div>
                  <div className="threat-marker low" style={{left: '40%', top: '70%'}} title="Brazil: 15 threats">
                    <div className="marker-pulse"></div>
                  </div>
                  <div className="threat-marker low" style={{left: '72%', top: '50%'}} title="India: 12 threats">
                    <div className="marker-pulse"></div>
                  </div>
                </div>
                
                {/* World map SVG simplified */}
                <svg viewBox="0 0 1000 500" className="world-svg">
                  <rect width="1000" height="500" fill="transparent"/>
                  {/* Simplified continent shapes */}
                  <text x="500" y="250" textAnchor="middle" fill="var(--text-muted)" fontSize="14" opacity="0.3">
                    🌍 Global Network Monitoring
                  </text>
                </svg>
              </div>
              
              {/* Threat Location List */}
              <div className="threat-locations">
                <h3>Top Threat Sources</h3>
                {threatLocations.map((location, idx) => (
                  <div key={idx} className="location-item">
                    <div className="location-info">
                      <span className="location-name">{location.country}</span>
                      <span className="location-threats">{location.threats} threats</span>
                    </div>
                    <div className="location-bar">
                      <div 
                        className="location-fill" 
                        style={{width: `${(location.threats / 45) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compact Alerts */}
          <div className="section-compact">
            <div className="section-hdr">
              <h2>Recent Alerts</h2>
              <button className="view-all-sm">View All →</button>
            </div>
            <div className="alerts-compact">
              <div className="alert-row high">
                <div className="alert-sev">HIGH</div>
                <div className="alert-info">
                  <div className="alert-ttl">Suspicious Login Attempt</div>
                  <div className="alert-dsc">Unknown device in New York</div>
                </div>
                <div className="alert-tm">2h ago</div>
                <button className="alert-act">Review</button>
              </div>

              <div className="alert-row medium">
                <div className="alert-sev">MED</div>
                <div className="alert-info">
                  <div className="alert-ttl">Unusual Network Activity</div>
                  <div className="alert-dsc">Increased traffic on port 8080</div>
                </div>
                <div className="alert-tm">5h ago</div>
                <button className="alert-act">Check</button>
              </div>

              <div className="alert-row low">
                <div className="alert-sev">LOW</div>
                <div className="alert-info">
                  <div className="alert-ttl">Password Expiring Soon</div>
                  <div className="alert-dsc">7 days remaining</div>
                </div>
                <div className="alert-tm">1d ago</div>
                <button className="alert-act secondary">Update</button>
              </div>
            </div>
          </div>

          {/* Compact Actions */}
          <div className="section-compact">
            <div className="section-hdr">
              <h2>Quick Actions</h2>
            </div>
            <div className="actions-compact">
              <button className="action-btn-sm">
                <span className="action-icon-sm">🔑</span>
                <span>Change Password</span>
              </button>
              <button className="action-btn-sm">
                <span className="action-icon-sm">📱</span>
                <span>Enable MFA</span>
              </button>
              <button className="action-btn-sm">
                <span className="action-icon-sm">🆘</span>
                <span>Report Incident</span>
              </button>
              <button className="action-btn-sm">
                <span className="action-icon-sm">📊</span>
                <span>Full Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

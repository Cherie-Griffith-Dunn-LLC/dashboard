import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import './Dashboard.css';

function Dashboard() {
  const { instance, accounts } = useMsal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // DARK BY DEFAULT
  const [selectedOrg, setSelectedOrg] = useState('all');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const user = accounts[0];
  const userName = user?.name || 'User';
  const tenantId = user?.tenantId || '';
  
  const CYPROTECK_TENANT_ID = 'ff4945f1-e101-4ac8-a78f-798156ea9cdf';
  
  const userRoles = user?.idTokenClaims?.roles || [];
  const userEmail = user?.username || user?.idTokenClaims?.preferred_username || '';
  const isCyproteckEmail = userEmail.toLowerCase().includes('@cyproteck.com');
  
  const hasTenantRole = userRoles.some(role => 
    role === 'Tenant' || role === 'Cyprotenant' || role === 'TenantOwner' ||
    role.toLowerCase() === 'tenant' || role.toLowerCase() === 'tenantowner'
  );
  
  const hasBusinessOwnerRole = userRoles.some(role => 
    role === 'BusinessOwner' || role === 'Businessowner' || role.toLowerCase() === 'businessowner'
  );
  
  const isMSPOwner = tenantId === CYPROTECK_TENANT_ID && (hasTenantRole || isCyproteckEmail);
  const isBusinessOwner = tenantId !== CYPROTECK_TENANT_ID && hasBusinessOwnerRole;

  const securityData = {
    securityScore: 85,
    threatsBlocked: 1247,
    highAlerts: 8,
    mediumAlerts: 23,
    lowAlerts: 45,
    trainingProgress: 67
  };

  const employees = [
    { 
      id: 1, 
      name: 'Sarah Johnson', 
      department: 'Finance',
      riskScore: 85, 
      threats: 5,
      issues: ['Failed MFA login attempts (3)', 'Weak password detected', 'Missing security update'],
      device: 'Windows Laptop',
      lastActive: '5 min ago',
      status: 'high'
    },
    { 
      id: 2, 
      name: 'Michael Chen', 
      department: 'Engineering',
      riskScore: 62, 
      threats: 2,
      issues: ['Phishing email clicked', 'Outdated browser version'],
      device: 'MacBook Pro',
      lastActive: '15 min ago',
      status: 'medium'
    },
    { 
      id: 3, 
      name: 'Emily Rodriguez', 
      department: 'Sales',
      riskScore: 45, 
      threats: 1,
      issues: ['Training incomplete: Phishing Awareness'],
      device: 'Windows Laptop',
      lastActive: '1 hour ago',
      status: 'medium'
    },
    { 
      id: 4, 
      name: 'David Kim', 
      department: 'Marketing',
      riskScore: 28, 
      threats: 0,
      issues: [],
      device: 'MacBook Air',
      lastActive: '30 min ago',
      status: 'low'
    }
  ];

  const globalThreats = [
    { country: 'United States', count: 847, severity: 'high', city: 'Multiple Locations', flag: '🇺🇸' },
    { country: 'China', count: 612, severity: 'high', city: 'Beijing/Shanghai', flag: '🇨🇳' },
    { country: 'Russia', count: 423, severity: 'medium', city: 'Moscow', flag: '🇷🇺' },
    { country: 'Germany', count: 289, severity: 'medium', city: 'Berlin', flag: '🇩🇪' },
    { country: 'Brazil', count: 156, severity: 'low', city: 'São Paulo', flag: '🇧🇷' },
    { country: 'India', count: 134, severity: 'low', city: 'Mumbai', flag: '🇮🇳' }
  ];

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

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

  const renderDashboard = () => (
    <>
      {isMSPOwner && (
        <>
          {/* Organization Dropdown - RESTORED */}
          <div className="org-selector-top">
            <select value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)} className="org-dropdown">
              <option value="all">All Organizations</option>
              <option value="acme">Acme Healthcare</option>
              <option value="tech">Tech Solutions Inc</option>
              <option value="finance">Finance Group LLC</option>
            </select>
          </div>

          {/* Hero Section */}
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

          {/* Metrics */}
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

          {/* Global Threat Ticker */}
          <div className="section-compact">
            <div className="section-hdr">
              <h2>🌍 Global Threat Activity</h2>
              <span className="live-indicator">🔴 Live</span>
            </div>
            
            <div className="threat-ticker">
              {globalThreats.map((threat, idx) => (
                <div key={idx} className={`threat-location-card ${threat.severity}`}>
                  <div className="threat-card-header">
                    <span className="country-flag">{threat.flag}</span>
                    <div className="country-info">
                      <div className="country-name">{threat.country}</div>
                      <div className="country-city">{threat.city}</div>
                    </div>
                    <span className={`severity-dot ${threat.severity}`}></span>
                  </div>
                  <div className="threat-count-large">{threat.count}</div>
                  <div className="threat-label">Active Threats</div>
                  <div className="threat-bar">
                    <div className={`threat-bar-fill ${threat.severity}`} style={{width: `${(threat.count / 847) * 100}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Employee List */}
          <div className="section-compact">
            <div className="section-hdr">
              <h2>👥 Employees Requiring Attention</h2>
              <button className="view-all-sm">View All →</button>
            </div>
            <div className="employees-table">
              {employees.filter(e => e.threats > 0 || e.issues.length > 0).map(employee => (
                <div key={employee.id} className={`employee-card ${employee.status}`}>
                  <div className="employee-header">
                    <div className="employee-info">
                      <div className="employee-avatar">{employee.name.charAt(0)}</div>
                      <div>
                        <div className="employee-name">{employee.name}</div>
                        <div className="employee-dept">{employee.department}</div>
                      </div>
                    </div>
                    <div className="employee-risk">
                      <div className="risk-score-badge">{employee.riskScore}</div>
                      <div className="risk-label">Risk Score</div>
                    </div>
                  </div>
                  <div className="employee-issues">
                    <strong>Issues ({employee.issues.length}):</strong>
                    <ul>
                      {employee.issues.map((issue, idx) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="employee-footer">
                    <span className="employee-device">💻 {employee.device}</span>
                    <span className="employee-active">Last active: {employee.lastActive}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );

  const renderThreatsPage = () => (
    <div className="page-content">
      <h1>⚠️ Threat Management</h1>
      <p className="page-subtitle">Monitor and respond to security threats</p>
      <div className="content-placeholder">
        <p>Threat management dashboard coming soon...</p>
      </div>
    </div>
  );

  const renderTrainingPage = () => (
    <div className="page-content">
      <h1>🎓 Security Training</h1>
      <p className="page-subtitle">Employee training management</p>
      <div className="content-placeholder">
        <p>Training dashboard coming soon...</p>
      </div>
    </div>
  );

  const renderAlertsPage = () => (
    <div className="page-content">
      <h1>🚨 Security Alerts</h1>
      <p className="page-subtitle">Real-time security alerts and notifications</p>
      <div className="content-placeholder">
        <p>Alerts dashboard coming soon...</p>
      </div>
    </div>
  );

  const renderMobilePage = () => (
    <div className="page-content">
      <h1>📱 Mobile Security</h1>
      <p className="page-subtitle">Protect your mobile devices with Microsoft Defender</p>
      
      <div className="mobile-hero">
        <h2>Secure Your Mobile Devices</h2>
        <p>Download Microsoft Defender to protect your iOS and Android devices from threats.</p>
      </div>

      <div className="download-section">
        <div className="download-card ios">
          <div className="download-icon">🍎</div>
          <h3>iOS & iPadOS</h3>
          <p>Protect your iPhone and iPad</p>
          <a 
            href="https://apps.apple.com/us/app/microsoft-defender/id1526737990" 
            target="_blank" 
            rel="noopener noreferrer"
            className="download-btn"
          >
            Download for iOS
          </a>
          <div className="requirements">Requires iOS 15.0 or later</div>
        </div>

        <div className="download-card android">
          <div className="download-icon">🤖</div>
          <h3>Android</h3>
          <p>Protect your Android phone or tablet</p>
          <a 
            href="https://play.google.com/store/apps/details?id=com.microsoft.scmx" 
            target="_blank" 
            rel="noopener noreferrer"
            className="download-btn"
          >
            Download for Android
          </a>
          <div className="requirements">Requires Android 8.0 or later</div>
        </div>
      </div>

      <div className="setup-steps">
        <h2>Setup Instructions</h2>
        <div className="steps-grid">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Download the App</h3>
            <p>Download Microsoft Defender from your device app store</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Sign In</h3>
            <p>Open the app and sign in with your company email</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Enable Permissions</h3>
            <p>Grant necessary permissions for protection</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>You are Protected!</h3>
            <p>Your device is now protected automatically</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportsPage = () => (
    <div className="page-content">
      <h1>📊 Reports & Analytics</h1>
      <p className="page-subtitle">Download comprehensive security reports</p>
      <div className="content-placeholder">
        <p>Reports dashboard coming soon...</p>
      </div>
    </div>
  );

  const renderSettingsPage = () => (
    <div className="page-content">
      <h1>⚙️ Settings</h1>
      <p className="page-subtitle">Dashboard settings and preferences</p>
      <div className="content-placeholder">
        <p>Settings dashboard coming soon...</p>
      </div>
    </div>
  );

  return (
    <div className={`dashboard ${darkMode ? 'dark' : 'light'}`}>
      {/* Sidebar with Collapse Button */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🛡️</span>
            {!sidebarCollapsed && <span className="logo-text">CYPROSECURE 360</span>}
          </div>
          {!sidebarCollapsed && <div className="logo-tagline">Visibility Network Security</div>}
        </div>

        <nav className="sidebar-nav">
          <a 
            href="#dashboard" 
            className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigateTo('dashboard'); }}
          >
            <span className="nav-icon">📊</span>
            {!sidebarCollapsed && <span className="nav-label">Dashboard</span>}
          </a>

          <a 
            href="#threats" 
            className={`nav-item ${currentPage === 'threats' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigateTo('threats'); }}
          >
            <span className="nav-icon">⚠️</span>
            {!sidebarCollapsed && (
              <>
                <span className="nav-label">Threats</span>
                <span className="nav-badge">{isMSPOwner ? securityData.highAlerts : employees.reduce((sum, e) => sum + e.threats, 0)}</span>
              </>
            )}
          </a>

          <a 
            href="#training" 
            className={`nav-item ${currentPage === 'training' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigateTo('training'); }}
          >
            <span className="nav-icon">🎓</span>
            {!sidebarCollapsed && <span className="nav-label">Training</span>}
          </a>

          <a 
            href="#alerts" 
            className={`nav-item ${currentPage === 'alerts' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigateTo('alerts'); }}
          >
            <span className="nav-icon">🚨</span>
            {!sidebarCollapsed && (
              <>
                <span className="nav-label">Alerts</span>
                <span className="nav-badge">3</span>
              </>
            )}
          </a>

          <a 
            href="#mobile" 
            className={`nav-item ${currentPage === 'mobile' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigateTo('mobile'); }}
          >
            <span className="nav-icon">📱</span>
            {!sidebarCollapsed && <span className="nav-label">Mobile Security</span>}
          </a>

          <a 
            href="#reports" 
            className={`nav-item ${currentPage === 'reports' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigateTo('reports'); }}
          >
            <span className="nav-icon">📈</span>
            {!sidebarCollapsed && <span className="nav-label">Reports</span>}
          </a>

          <a 
            href="#settings" 
            className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigateTo('settings'); }}
          >
            <span className="nav-icon">⚙️</span>
            {!sidebarCollapsed && <span className="nav-label">Settings</span>}
          </a>
        </nav>

        {/* SIDEBAR COLLAPSE BUTTON - RESTORED */}
        <button className="sidebar-toggle" onClick={toggleSidebar}>
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
      <div className="main-content">
        <header className="top-bar">
          <div className="top-bar-left">
            <h2 className="page-title">
              {currentPage === 'dashboard' && (isMSPOwner ? 'MSP Security Dashboard' : isBusinessOwner ? 'Business Security Dashboard' : 'My Security Dashboard')}
              {currentPage === 'threats' && 'Threat Management'}
              {currentPage === 'training' && 'Security Training'}
              {currentPage === 'alerts' && 'Security Alerts'}
              {currentPage === 'mobile' && 'Mobile Security'}
              {currentPage === 'reports' && 'Reports & Analytics'}
              {currentPage === 'settings' && 'Settings'}
            </h2>
          </div>
          <div className="top-bar-right">
            {/* THEME TOGGLE - RESTORED */}
            <button className="theme-toggle" onClick={toggleTheme} title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <div className="user-profile">
              <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
              <span className="user-name">{userName}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className="content-area">
          {currentPage === 'dashboard' && renderDashboard()}
          {currentPage === 'threats' && renderThreatsPage()}
          {currentPage === 'training' && renderTrainingPage()}
          {currentPage === 'alerts' && renderAlertsPage()}
          {currentPage === 'mobile' && renderMobilePage()}
          {currentPage === 'reports' && renderReportsPage()}
          {currentPage === 'settings' && renderSettingsPage()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

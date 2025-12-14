import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import './Dashboard.css';

function Dashboard() {
  const { instance, accounts } = useMsal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
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
    { country: 'United States', x: 20, y: 36, count: 847, severity: 'high', city: 'Multiple Locations' },
    { country: 'China', x: 70, y: 40, count: 612, severity: 'high', city: 'Beijing/Shanghai' },
    { country: 'Russia', x: 65, y: 25, count: 423, severity: 'medium', city: 'Moscow' },
    { country: 'Germany', x: 48, y: 30, count: 289, severity: 'medium', city: 'Berlin' },
    { country: 'Brazil', x: 40, y: 70, count: 156, severity: 'low', city: 'São Paulo' },
    { country: 'India', x: 72, y: 50, count: 134, severity: 'low', city: 'Mumbai' }
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
          <div className="org-selector-top">
            <select value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)} className="org-dropdown">
              <option value="all">All Organizations</option>
              <option value="acme">Acme Healthcare</option>
              <option value="tech">Tech Solutions Inc</option>
              <option value="finance">Finance Group LLC</option>
            </select>
          </div>

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

          <div className="section-compact">
            <div className="section-hdr">
              <h2>🌍 Global Threat Heat Map</h2>
              <span className="live-indicator">🔴 Live</span>
            </div>
            <div className="world-map-container">
              <div className="world-map">
                <div className="map-overlay">
                  <svg className="connection-lines" viewBox="0 0 1000 500">
                    <line x1="200" y1="180" x2="500" y2="250" className="threat-line high" strokeDasharray="5,5">
                      <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite"/>
                    </line>
                    <line x1="700" y1="200" x2="500" y2="250" className="threat-line medium" strokeDasharray="5,5">
                      <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite"/>
                    </line>
                  </svg>
                  
                  {globalThreats.map((threat, idx) => (
                    <div 
                      key={idx}
                      className={`threat-marker ${threat.severity}`}
                      style={{left: `${threat.x}%`, top: `${threat.y}%`}} 
                      title={`${threat.country}: ${threat.count} threats`}
                    >
                      <div className="marker-pulse"></div>
                      <div className="marker-count">{threat.count}</div>
                    </div>
                  ))}
                </div>
                
                <svg viewBox="0 0 1000 500" className="world-svg">
                  <rect width="1000" height="500" fill="#f8fafc"/>
                  
                  <path d="M 80,120 L 90,100 L 110,85 L 135,75 L 160,70 L 185,70 L 205,75 L 220,85 L 235,100 L 245,120 L 255,145 L 260,170 L 260,195 L 255,215 L 245,235 L 230,250 L 210,260 L 185,265 L 160,263 L 140,255 L 125,242 L 112,225 L 105,205 L 100,180 L 95,155 L 90,135 Z M 175,90 L 195,85 L 215,87 L 235,95 L 250,107 L 258,122 L 260,140 L 255,155 L 245,167 L 230,175 L 210,178 L 190,175 L 175,167 L 165,155 L 160,140 L 160,125 L 165,110 L 170,100 Z" 
                        fill="#1e3a5f" opacity="0.95"/>
                  
                  <path d="M 185,265 L 195,275 L 202,287 L 205,300 L 203,312 L 198,322 L 190,328 L 180,323 L 175,313 L 173,300 L 175,287 L 178,277 Z"
                        fill="#1e3a5f" opacity="0.95"/>
                  
                  <path d="M 190,330 L 205,328 L 222,333 L 235,343 L 245,358 L 252,378 L 255,400 L 253,422 L 245,440 L 232,453 L 215,460 L 195,462 L 178,458 L 165,448 L 155,433 L 150,415 L 148,395 L 150,375 L 155,355 L 163,340 L 175,332 Z"
                        fill="#1e3a5f" opacity="0.95"/>
                  
                  <path d="M 305,30 L 330,25 L 355,27 L 375,35 L 390,48 L 398,65 L 400,85 L 395,103 L 383,117 L 365,125 L 345,128 L 325,125 L 310,115 L 300,100 L 295,83 L 295,65 L 300,48 Z"
                        fill="#1e3a5f" opacity="0.85"/>
                  
                  <path d="M 455,95 L 470,90 L 488,88 L 505,90 L 520,95 L 533,103 L 543,115 L 548,130 L 548,145 L 543,158 L 533,168 L 518,175 L 500,178 L 482,176 L 467,168 L 457,155 L 452,140 L 452,123 L 455,108 Z M 480,100 L 490,98 L 502,98 L 512,102 L 520,110 L 523,122 L 522,135 L 515,145 L 503,150 L 490,150 L 478,145 L 470,135 L 467,122 L 468,110 L 473,103 Z"
                        fill="#1e3a5f" opacity="0.95"/>
                  
                  <path d="M 490,50 L 505,45 L 520,45 L 532,50 L 540,60 L 545,73 L 545,88 L 538,100 L 525,107 L 510,110 L 495,107 L 485,98 L 480,85 L 480,70 L 483,58 Z"
                        fill="#1e3a5f" opacity="0.9"/>
                  
                  <path d="M 475,180 L 495,177 L 515,180 L 535,188 L 552,200 L 565,218 L 573,240 L 578,265 L 578,290 L 573,315 L 562,338 L 545,358 L 525,372 L 505,380 L 485,382 L 468,378 L 455,368 L 445,353 L 440,335 L 438,315 L 438,290 L 440,265 L 445,240 L 453,218 L 463,200 Z"
                        fill="#1e3a5f" opacity="0.95"/>
                  
                  <path d="M 555,75 L 585,70 L 620,68 L 655,70 L 690,77 L 720,88 L 745,103 L 765,122 L 780,145 L 788,170 L 790,195 L 785,218 L 772,238 L 750,252 L 720,260 L 685,263 L 650,258 L 618,247 L 590,230 L 568,210 L 553,188 L 545,165 L 542,140 L 543,115 L 548,95 Z"
                        fill="#1e3a5f" opacity="0.95"/>
                  
                  <path d="M 720,265 L 738,263 L 755,268 L 768,278 L 775,293 L 778,310 L 775,327 L 765,340 L 750,347 L 733,348 L 718,343 L 708,333 L 703,318 L 703,300 L 708,283 L 713,273 Z"
                        fill="#1e3a5f" opacity="0.9"/>
                  
                  <path d="M 720,355 L 750,352 L 780,355 L 805,365 L 825,380 L 838,398 L 843,418 L 840,438 L 828,453 L 808,463 L 780,467 L 750,465 L 725,458 L 708,445 L 698,428 L 693,408 L 695,388 L 703,372 L 710,363 Z"
                        fill="#1e3a5f" opacity="0.95"/>
                  
                  <path d="M 870,420 L 885,418 L 898,423 L 905,433 L 908,448 L 905,463 L 895,473 L 880,476 L 865,473 L 855,463 L 850,448 L 850,433 L 855,423 Z"
                        fill="#1e3a5f" opacity="0.85"/>
                </svg>
              </div>
              
              <div className="threat-locations">
                <h3>Top Threat Locations</h3>
                <div className="location-list">
                  {globalThreats.slice(0, 6).map((threat, idx) => (
                    <div key={idx} className="location-item">
                      <span className={`location-severity ${threat.severity}`}></span>
                      <div className="location-info">
                        <div className="location-name">{threat.country}</div>
                        <div className="location-detail">{threat.city}</div>
                      </div>
                      <div className="location-count">{threat.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

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
            <button className="theme-toggle" onClick={toggleTheme}>
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

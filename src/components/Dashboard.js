import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import './Dashboard.css';

/**
 * CYPROSECURE - Multi-Tenant Dashboard
 * MSP View (Cyproteck) vs Business Owner View (Clients)
 */
function Dashboard() {
  const { instance, accounts } = useMsal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState('all');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const user = accounts[0];
  const userName = user?.name || 'User';
  
  // Get tenant info from Azure AD
  const tenantId = user?.tenantId || '';
  const companyName = user?.idTokenClaims?.company || user?.idTokenClaims?.organization || 'Your Company';
  
  // Cyproteck MSP tenant ID
  const CYPROTECK_TENANT_ID = 'ff4945f1-e101-4ac8-a78f-798156ea9cdf';
  
  // Check user roles
  const userRoles = user?.idTokenClaims?.roles || [];
  const hasAdminRole = userRoles.some(role => 
    role.toLowerCase().includes('admin') || 
    role.toLowerCase().includes('administrator')
  );
  
  // Determine user type
  const isMSPOwner = tenantId === CYPROTECK_TENANT_ID;
  const isBusinessOwner = !isMSPOwner && hasAdminRole;
  const isEmployee = !isMSPOwner && !hasAdminRole;
  
  // Current user data (for employee view)
  const currentUserData = {
    name: userName,
    riskScore: 71,
    training: {
      completed: 2,
      total: 4,
      courses: [
        { id: 1, name: 'Password Security', status: 'completed', completedDate: '2024-11-15' },
        { id: 2, name: 'Phishing Awareness', status: 'completed', completedDate: '2024-11-28' },
        { id: 3, name: 'Data Protection', status: 'in_progress', progress: 60 },
        { id: 4, name: 'Secure Remote Work', status: 'not_started' },
      ]
    },
    threats: [
      { id: 1, type: 'Suspicious Email Blocked', severity: 'medium', time: '2 hours ago' },
      { id: 2, type: 'Failed Login Attempt', severity: 'high', time: 'Yesterday' },
      { id: 3, type: 'Weak Password Detected', severity: 'low', time: '3 days ago' },
      { id: 4, type: 'Malicious Link Blocked', severity: 'high', time: '5 days ago' },
      { id: 5, type: 'Suspicious Download Prevented', severity: 'medium', time: '1 week ago' },
    ],
    devices: [
      { id: 1, name: 'Windows Laptop', type: 'laptop', status: 'secure', lastSeen: 'Active now' },
      { id: 2, name: 'iPhone 12', type: 'mobile', status: 'needs_update', lastSeen: '2 hours ago' },
    ],
    threatCount: 5,
  };

  // Organizations list (for MSP view)
  const organizations = [
    { id: 'all', name: 'All Organizations' },
    { id: 'acme', name: 'Acme Healthcare' },
    { id: 'tech', name: 'Tech Solutions Inc' },
    { id: 'finance', name: 'Finance Group LLC' },
  ];

  // Mock employee data (for Business Owner view)
  const employees = [
    { id: 1, name: 'Sarah Johnson', status: 'offline', riskScore: 83, training: 'Not Started', threats: 8, lastLogin: '1 day ago', device: 'iPhone 12' },
    { id: 2, name: 'John Doe', status: 'online', riskScore: 71, training: 'In Progress', threats: 5, lastLogin: 'Active now', device: 'Windows Laptop' },
    { id: 3, name: 'Anne Weathers', status: 'online', riskScore: 56, training: 'Completed', threats: 7, lastLogin: '2 min ago', device: 'MacBook Pro' },
    { id: 4, name: 'Michael Brown', status: 'online', riskScore: 42, training: 'Completed', threats: 1, lastLogin: 'Active now', device: 'Android Phone' },
    { id: 5, name: 'Emily White', status: 'offline', riskScore: 77, training: 'In Progress', threats: 2, lastLogin: '3 hours ago', device: 'iPad Air' },
  ];

  // Find highest risk employee and device
  const highestRiskEmployee = [...employees].sort((a, b) => b.riskScore - a.riskScore)[0];
  const highestRiskDevice = highestRiskEmployee;

  // Mock data for MSP view
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

  // World threat locations
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

  const getRiskColor = (score) => {
    if (score >= 70) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={`dashboard-layout ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* Sidebar */}
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
          <a 
            href="#" 
            className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigateTo('dashboard'); }}
          >
            <span className="nav-icon">📊</span>
            {!sidebarCollapsed && <span className="nav-label">Dashboard</span>}
          </a>
          <a 
            href="#" 
            className={`nav-item ${currentPage === 'security' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigateTo('security'); }}
          >
            <span className="nav-icon">🛡️</span>
            {!sidebarCollapsed && <span className="nav-label">Security</span>}
          </a>
          <a 
            href="#" 
            className={`nav-item ${currentPage === 'threats' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigateTo('threats'); }}
          >
            <span className="nav-icon">⚠️</span>
            {!sidebarCollapsed && (
              <>
                <span className="nav-label">Threats</span>
                <span className="nav-badge">{isMSPOwner ? securityData.highAlerts : isBusinessOwner ? employees.reduce((sum, e) => sum + e.threats, 0) : currentUserData.threatCount}</span>
              </>
            )}
          </a>
          <a 
            href="#" 
            className={`nav-item ${currentPage === 'training' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigateTo('training'); }}
          >
            <span className="nav-icon">🎓</span>
            {!sidebarCollapsed && (
              <>
                <span className="nav-label">Training</span>
                <span className="nav-badge">2</span>
              </>
            )}
          </a>
          <a 
            href="#" 
            className={`nav-item ${currentPage === 'alerts' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigateTo('alerts'); }}
          >
            <span className="nav-icon">🚨</span>
            {!sidebarCollapsed && (
              <>
                <span className="nav-label">Alerts</span>
                <span className="nav-badge">{securityData.activeAlerts}</span>
              </>
            )}
          </a>
          <a 
            href="#" 
            className={`nav-item ${currentPage === 'reports' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigateTo('reports'); }}
          >
            <span className="nav-icon">📈</span>
            {!sidebarCollapsed && <span className="nav-label">Reports</span>}
          </a>
          <a 
            href="#" 
            className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigateTo('settings'); }}
          >
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
        <header className="top-bar">
          <div className="top-bar-left">
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
            <h1 className="page-title">
              {isMSPOwner && 'MSP Security Dashboard'}
              {isBusinessOwner && `${companyName} Security Dashboard`}
              {isEmployee && 'My Security Dashboard'}
            </h1>
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
          {/* Dashboard Page */}
          {currentPage === 'dashboard' && (
            <>
              {/* MSP Owner View - Organization Selector */}
              {isMSPOwner && (
                <div className="org-selector-top">
                  <select value={selectedOrg} onChange={handleOrgChange} className="org-dropdown">
                    {organizations.map(org => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                  </select>
                </div>
              )}

          {/* Business Owner View - Risk Highlights */}
          {isBusinessOwner && (
            <div className="risk-highlights">
              <div className="risk-highlight-card high">
                <div className="risk-icon">🔴</div>
                <div className="risk-content">
                  <div className="risk-label">HIGHEST RISK EMPLOYEE TODAY</div>
                  <div className="risk-name">{highestRiskEmployee.name}</div>
                  <div className="risk-detail">Risk Score: {highestRiskEmployee.riskScore} | {highestRiskEmployee.threats} threats</div>
                </div>
                <button className="risk-action">View Details</button>
              </div>

              <div className="risk-highlight-card warning">
                <div className="risk-icon">⚠️</div>
                <div className="risk-content">
                  <div className="risk-label">HIGHEST RISK DEVICE TODAY</div>
                  <div className="risk-name">{highestRiskDevice.device}</div>
                  <div className="risk-detail">{highestRiskDevice.name}'s Device | {highestRiskDevice.threats} threats detected</div>
                </div>
                <button className="risk-action">Lock Device</button>
              </div>
            </div>
          )}

          {/* MSP Owner Content - Heat Map Dashboard */}
          {isMSPOwner && (
            <>
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
                    
                    <svg viewBox="0 0 1000 500" className="world-svg">
                      <rect width="1000" height="500" fill="transparent"/>
                      <text x="500" y="250" textAnchor="middle" fill="var(--text-muted)" fontSize="14" opacity="0.3">
                        🌍 Global Network Monitoring
                      </text>
                    </svg>
                  </div>
                  
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
            </>
          )}

          {/* Business Owner Content - Employee Risk Table */}
          {isBusinessOwner && (
            <>
              {/* Company Overview */}
              <div className="metrics-compact">
                <div className="metric-box">
                  <div className="metric-icon-sm">👥</div>
                  <div className="metric-data">
                    <div className="metric-val">{employees.length}</div>
                    <div className="metric-lbl">Total Employees</div>
                  </div>
                  <div className="metric-trend neutral">{employees.filter(e => e.status === 'online').length} online</div>
                </div>

                <div className="metric-box">
                  <div className="metric-icon-sm">⚠️</div>
                  <div className="metric-data">
                    <div className="metric-val">{employees.filter(e => e.riskScore >= 70).length}</div>
                    <div className="metric-lbl">High Risk Users</div>
                  </div>
                  <div className="metric-trend warning">Needs attention</div>
                </div>

                <div className="metric-box">
                  <div className="metric-icon-sm">🎓</div>
                  <div className="metric-data">
                    <div className="metric-val">{employees.filter(e => e.training !== 'Completed').length}</div>
                    <div className="metric-lbl">Training Needed</div>
                  </div>
                  <div className="metric-trend warning">Send reminders</div>
                </div>

                <div className="metric-box">
                  <div className="metric-icon-sm">🚨</div>
                  <div className="metric-data">
                    <div className="metric-val">{employees.reduce((sum, e) => sum + e.threats, 0)}</div>
                    <div className="metric-lbl">Total Threats</div>
                  </div>
                  <div className="metric-trend up">This week</div>
                </div>
              </div>

              {/* Employee Risk Table */}
              <div className="section-compact">
                <div className="section-hdr">
                  <h2>Employee Security Status</h2>
                  <button className="view-all-sm">Export Report →</button>
                </div>
                <div className="employee-table-container">
                  <table className="employee-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Status</th>
                        <th>Risk Score</th>
                        <th>Training</th>
                        <th>Threats</th>
                        <th>Device</th>
                        <th>Last Login</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map(emp => (
                        <tr key={emp.id} className={emp.riskScore >= 70 ? 'high-risk-row' : ''}>
                          <td>
                            <div className="employee-name">
                              {emp.name}
                              {emp.riskScore >= 70 && <span className="risk-flag">⚠️</span>}
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${emp.status}`}>
                              {emp.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                            </span>
                          </td>
                          <td>
                            <span className={`risk-score ${getRiskColor(emp.riskScore)}`}>
                              {emp.riskScore}
                            </span>
                          </td>
                          <td>
                            <span className={`training-status ${emp.training === 'Completed' ? 'complete' : emp.training === 'In Progress' ? 'progress' : 'incomplete'}`}>
                              {emp.training}
                            </span>
                          </td>
                          <td>
                            <span className="threat-count">
                              {emp.threats}
                            </span>
                          </td>
                          <td className="device-cell">{emp.device}</td>
                          <td className="last-login-cell">{emp.lastLogin}</td>
                          <td>
                            <div className="table-actions">
                              <button className="action-btn-tiny">View</button>
                              <button className="action-btn-tiny primary">Notify</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions for Business Owner */}
              <div className="section-compact">
                <div className="section-hdr">
                  <h2>Quick Actions</h2>
                </div>
                <div className="actions-compact">
                  <button className="action-btn-sm">
                    <span className="action-icon-sm">📧</span>
                    <span>Send Training Reminder</span>
                  </button>
                  <button className="action-btn-sm">
                    <span className="action-icon-sm">🔒</span>
                    <span>Lock High-Risk Devices</span>
                  </button>
                  <button className="action-btn-sm">
                    <span className="action-icon-sm">📊</span>
                    <span>Generate Report</span>
                  </button>
                  <button className="action-btn-sm">
                    <span className="action-icon-sm">⚙️</span>
                    <span>Security Settings</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Employee View - Personal Dashboard */}
          {isEmployee && (
            <>
              {/* Personal Hero */}
              <div className="employee-hero">
                <div className="employee-hero-content">
                  <h1>My Security Dashboard</h1>
                  <p className="employee-subtitle">Welcome back, {userName.split(' ')[0]}!</p>
                </div>
                <div className="employee-score-card">
                  <div className="score-ring-medium">
                    <svg viewBox="0 0 120 120">
                      <circle className="ring-bg" cx="60" cy="60" r="50"/>
                      <circle 
                        className="ring-progress" 
                        cx="60" 
                        cy="60" 
                        r="50"
                        style={{ strokeDasharray: `${currentUserData.riskScore * 3.14} 314` }}
                      />
                    </svg>
                    <div className="score-num-large">{currentUserData.riskScore}</div>
                  </div>
                  <div className="score-status-text">
                    <div className="score-label">Your Security Score</div>
                    <div className={`score-status ${getRiskColor(currentUserData.riskScore)}`}>
                      {currentUserData.riskScore >= 70 ? 'Needs Improvement' : currentUserData.riskScore >= 50 ? 'Good' : 'Excellent'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Metrics */}
              <div className="metrics-compact">
                <div className="metric-box">
                  <div className="metric-icon-sm">🎯</div>
                  <div className="metric-data">
                    <div className="metric-val">{currentUserData.riskScore}</div>
                    <div className="metric-lbl">My Risk Score</div>
                  </div>
                  <div className={`metric-trend ${getRiskColor(currentUserData.riskScore)}`}>
                    {currentUserData.riskScore >= 70 ? 'High' : currentUserData.riskScore >= 50 ? 'Medium' : 'Low'}
                  </div>
                </div>

                <div className="metric-box">
                  <div className="metric-icon-sm">🎓</div>
                  <div className="metric-data">
                    <div className="metric-val">{currentUserData.training.completed}/{currentUserData.training.total}</div>
                    <div className="metric-lbl">Training Complete</div>
                  </div>
                  <div className="metric-trend neutral">
                    {currentUserData.training.total - currentUserData.training.completed} remaining
                  </div>
                </div>

                <div className="metric-box">
                  <div className="metric-icon-sm">⚠️</div>
                  <div className="metric-data">
                    <div className="metric-val">{currentUserData.threatCount}</div>
                    <div className="metric-lbl">Threats Blocked</div>
                  </div>
                  <div className="metric-trend up">This week</div>
                </div>

                <div className="metric-box">
                  <div className="metric-icon-sm">📱</div>
                  <div className="metric-data">
                    <div className="metric-val">{currentUserData.devices.length}</div>
                    <div className="metric-lbl">My Devices</div>
                  </div>
                  <div className="metric-trend neutral">Monitored</div>
                </div>
              </div>

              {/* My Training */}
              <div className="section-compact">
                <div className="section-hdr">
                  <h2>My Training Courses</h2>
                  <span className="training-progress-text">
                    {Math.round((currentUserData.training.completed / currentUserData.training.total) * 100)}% Complete
                  </span>
                </div>
                <div className="training-courses-list">
                  {currentUserData.training.courses.map(course => (
                    <div key={course.id} className={`training-course-item ${course.status}`}>
                      <div className="course-status-icon">
                        {course.status === 'completed' && '✅'}
                        {course.status === 'in_progress' && '🔄'}
                        {course.status === 'not_started' && '⏳'}
                      </div>
                      <div className="course-info">
                        <div className="course-name">{course.name}</div>
                        {course.status === 'completed' && (
                          <div className="course-meta">Completed {course.completedDate}</div>
                        )}
                        {course.status === 'in_progress' && (
                          <div className="course-progress-bar">
                            <div className="progress-fill" style={{width: `${course.progress}%`}}></div>
                          </div>
                        )}
                        {course.status === 'not_started' && (
                          <div className="course-meta">Not started</div>
                        )}
                      </div>
                      <div className="course-action">
                        {course.status === 'completed' && (
                          <button className="course-btn secondary">Review</button>
                        )}
                        {course.status === 'in_progress' && (
                          <button className="course-btn primary">Continue</button>
                        )}
                        {course.status === 'not_started' && (
                          <button className="course-btn primary">Start</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* My Recent Threats */}
              <div className="section-compact">
                <div className="section-hdr">
                  <h2>My Recent Threats</h2>
                  <button className="view-all-sm">View All →</button>
                </div>
                <div className="threats-list">
                  {currentUserData.threats.slice(0, 3).map(threat => (
                    <div key={threat.id} className={`threat-item ${threat.severity}`}>
                      <div className={`threat-severity-badge ${threat.severity}`}>
                        {threat.severity === 'high' && '🔴'}
                        {threat.severity === 'medium' && '🟡'}
                        {threat.severity === 'low' && '🟢'}
                      </div>
                      <div className="threat-content">
                        <div className="threat-type">{threat.type}</div>
                        <div className="threat-time">{threat.time}</div>
                      </div>
                      <button className="threat-action-btn">Details</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* My Devices */}
              <div className="section-compact">
                <div className="section-hdr">
                  <h2>My Devices</h2>
                </div>
                <div className="devices-grid">
                  {currentUserData.devices.map(device => (
                    <div key={device.id} className={`device-card ${device.status}`}>
                      <div className="device-icon">
                        {device.type === 'laptop' && '💻'}
                        {device.type === 'mobile' && '📱'}
                      </div>
                      <div className="device-info">
                        <div className="device-name">{device.name}</div>
                        <div className={`device-status ${device.status}`}>
                          {device.status === 'secure' && '✅ Secure'}
                          {device.status === 'needs_update' && '⚠️ Update Required'}
                        </div>
                        <div className="device-last-seen">Last seen: {device.lastSeen}</div>
                      </div>
                      {device.status === 'needs_update' && (
                        <button className="device-action-btn primary">Update Now</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Quick Actions */}
              <div className="section-compact">
                <div className="section-hdr">
                  <h2>Quick Actions</h2>
                </div>
                <div className="actions-compact">
                  <button className="action-btn-sm">
                    <span className="action-icon-sm">🔑</span>
                    <span>Change My Password</span>
                  </button>
                  <button className="action-btn-sm">
                    <span className="action-icon-sm">📱</span>
                    <span>Enable MFA</span>
                  </button>
                  <button className="action-btn-sm">
                    <span className="action-icon-sm">🎓</span>
                    <span>Continue Training</span>
                  </button>
                  <button className="action-btn-sm">
                    <span className="action-icon-sm">📊</span>
                    <span>View My Report</span>
                  </button>
                </div>
              </div>
            </>
          )}
            </>
          )}

          {/* Other Pages - Simple Placeholders */}
          {currentPage !== 'dashboard' && (
            <div className="page-simple">
              <h1>
                {currentPage === 'security' && '🛡️ Security'}
                {currentPage === 'threats' && '⚠️ Threats'}
                {currentPage === 'training' && '🎓 Training'}
                {currentPage === 'alerts' && '🚨 Alerts'}
                {currentPage === 'reports' && '📈 Reports'}
                {currentPage === 'settings' && '⚙️ Settings'}
              </h1>
              <p>
                {isMSPOwner && 'MSP view'}
                {isBusinessOwner && `${companyName} view`}
                {isEmployee && 'Personal view'}
              </p>
              <div className="coming-soon">This page is coming soon...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import './Dashboard.css';

function Dashboard() {
  const { instance, accounts } = useMsal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState('all');
  const [currentPage, setCurrentPage] = useState('dashboard');
  // MSSP owners can preview the Company Admin and Employee experiences: 'mssp' | 'admin' | 'employee'
  const [viewAs, setViewAs] = useState('mssp');

  const user = accounts[0];
  const userName = user?.name || 'User';
  const tenantId = user?.tenantId || '';
  const userEmail = user?.username?.toLowerCase() || '';
  const companyName = user?.idTokenClaims?.company || user?.idTokenClaims?.organization || 'Your Company';
  
  const CYPROTECK_TENANT_ID = 'ff4945f1-e101-4ac8-a78f-798156ea9cdf';
  const CGD_LLC_TENANT_ID = '0d9acab6-2b9d-4883-8617-f3fdea4b02d6';
  
  const CLIENT_TENANTS = {
    [CGD_LLC_TENANT_ID]: {
      name: 'CGD LLC',
      domain: 'cgdgovsolutions.com',
      employees: 20,
      isActive: true
    },
    'demo-acme-healthcare': {
      name: 'Acme Healthcare',
      domain: 'acmehealthcare.com',
      employees: 250,
      isActive: false,
      isDemo: true
    },
    'demo-tech-solutions': {
      name: 'Tech Solutions Inc',
      domain: 'techsolutions.com',
      employees: 180,
      isActive: false,
      isDemo: true
    },
    'demo-finance-group': {
      name: 'Finance Group LLC',
      domain: 'financegroup.com',
      employees: 95,
      isActive: false,
      isDemo: true
    },
  };
  
  const BUSINESS_OWNER_EMAILS = [
    'user@cgdgovsolutions.com',
    'cherie@cgdgovsolutions.com',
    'admin@cgdgovsolutions.com',
  ];
  
  const clientTenant = CLIENT_TENANTS[tenantId];
  const displayCompanyName = clientTenant?.name || companyName || 'Your Company';
  
  const userRoles = user?.idTokenClaims?.roles || [];
  
  const hasTenantRole = userRoles.some(role => 
    role === 'Tenant' || role === 'Cyprotenant' || role === 'TenantOwner' ||
    role.toLowerCase() === 'tenant' || role.toLowerCase() === 'tenantowner'
  );
  
  const hasBusinessOwnerRole = userRoles.some(role => 
    role === 'BusinessOwner' || role === 'Businessowner' || role.toLowerCase() === 'businessowner'
  );
  
  const isMSPOwner = tenantId === CYPROTECK_TENANT_ID && hasTenantRole;
  
  const isBusinessOwner = clientTenant?.isActive &&
                          (hasBusinessOwnerRole || BUSINESS_OWNER_EMAILS.includes(userEmail));

  // Effective view. MSSP owners (Cyproteck) can preview the Company Admin and
  // Employee experiences via the "View as" switcher; everyone else is locked to
  // the view their identity grants them.
  const effectiveMSP = isMSPOwner && viewAs === 'mssp';
  const effectiveBusiness = isBusinessOwner || (isMSPOwner && viewAs === 'admin');
  const effectiveEmployee = (!isMSPOwner && !isBusinessOwner) || (isMSPOwner && viewAs === 'employee');
  
  console.log('🔍 User Role Check:', {
    userName,
    userEmail,
    tenantId: tenantId === CYPROTECK_TENANT_ID ? 'CYPROTECK' : clientTenant?.name || 'UNKNOWN',
    isRealClient: clientTenant?.isActive || false,
    isDemoClient: clientTenant?.isDemo || false,
    roles: userRoles,
    hasTenantRole,
    hasBusinessOwnerRole,
    isInBusinessOwnerList: BUSINESS_OWNER_EMAILS.includes(userEmail),
    displayCompanyName,
    viewType: isMSPOwner ? '👑 MSSP Owner' : isBusinessOwner ? '🏢 Business Owner' : '👤 Employee'
  });

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

  // Security awareness training catalog (shared across roles)
  const trainingCourses = [
    {
      id: 'phishing-101',
      title: 'Phishing Awareness',
      icon: '🎣',
      category: 'Email Security',
      duration: '25 min',
      lessons: 6,
      level: 'Required',
      description: 'Spot malicious emails, credential harvesting, and business email compromise before you click.',
      enrolled: 156,
      completion: 91,
      status: 'completed'
    },
    {
      id: 'passwords-mfa',
      title: 'Passwords & MFA',
      icon: '🔐',
      category: 'Access Security',
      duration: '20 min',
      lessons: 5,
      level: 'Required',
      description: 'Build strong passphrases, use a password manager, and set up multi-factor authentication.',
      enrolled: 156,
      completion: 85,
      status: 'completed'
    },
    {
      id: 'data-protection',
      title: 'Data Protection & Privacy',
      icon: '🗄️',
      category: 'Compliance',
      duration: '30 min',
      lessons: 7,
      level: 'Required',
      description: 'Handle sensitive data, understand HIPAA/PII obligations, and prevent accidental exposure.',
      enrolled: 156,
      completion: 78,
      status: 'completed'
    },
    {
      id: 'remote-work',
      title: 'Secure Remote Work',
      icon: '🏠',
      category: 'Endpoint Security',
      duration: '22 min',
      lessons: 5,
      level: 'Required',
      description: 'Protect company data on home networks, personal devices, and public Wi-Fi.',
      enrolled: 156,
      completion: 64,
      status: 'in-progress'
    },
    {
      id: 'social-engineering',
      title: 'Social Engineering Defense',
      icon: '🎭',
      category: 'Awareness',
      duration: '28 min',
      lessons: 6,
      level: 'Recommended',
      description: 'Recognize pretexting, vishing, and impersonation tactics used to bypass technical controls.',
      enrolled: 132,
      completion: 42,
      status: 'not-started'
    },
    {
      id: 'incident-response',
      title: 'Incident Reporting',
      icon: '🚨',
      category: 'Response',
      duration: '18 min',
      lessons: 4,
      level: 'Recommended',
      description: 'Know exactly what to do and who to contact the moment you suspect a security incident.',
      enrolled: 118,
      completion: 55,
      status: 'not-started'
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
      {/* MSSP OWNER VIEW */}
      {effectiveMSP && (
        <>
          <div className="org-selector-top">
            <select value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)} className="org-dropdown">
              <option value="all">All Organizations</option>
              {Object.entries(CLIENT_TENANTS).map(([tid, client]) => (
                <option key={tid} value={tid}>
                  {client.name} {client.isDemo ? '(Demo)' : ''}
                </option>
              ))}
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

          <div className="section-compact">
            <div className="section-hdr">
              <h2>🚨 Recent Threat Alerts</h2>
              <button className="view-all-sm">View All →</button>
            </div>
            <div className="threat-alerts-list">
              <div className="threat-alert high">
                <div className="alert-icon">🔴</div>
                <div className="alert-content">
                  <div className="alert-title">Ransomware Attack Blocked</div>
                  <div className="alert-detail">Blocked ransomware attempt on Finance Department - 3 devices protected</div>
                  <div className="alert-time">2 hours ago</div>
                </div>
                <button className="alert-action">Details →</button>
              </div>

              <div className="threat-alert medium">
                <div className="alert-icon">🟠</div>
                <div className="alert-content">
                  <div className="alert-title">Phishing Email Detected</div>
                  <div className="alert-detail">15 employees received suspicious emails - All quarantined</div>
                  <div className="alert-time">5 hours ago</div>
                </div>
                <button className="alert-action">Details →</button>
              </div>

              <div className="threat-alert low">
                <div className="alert-icon">🟡</div>
                <div className="alert-content">
                  <div className="alert-title">Suspicious Login Attempt</div>
                  <div className="alert-detail">Login from unusual location blocked - User notified</div>
                  <div className="alert-time">1 day ago</div>
                </div>
                <button className="alert-action">Details →</button>
              </div>
            </div>
          </div>

          <div className="quick-actions-section">
            <h2>⚡ Quick Actions</h2>
            <div className="quick-actions-grid">
              <button className="quick-action-btn">
                <span className="qa-icon">🔍</span>
                <span className="qa-label">Run Security Scan</span>
              </button>
              <button className="quick-action-btn">
                <span className="qa-icon">📧</span>
                <span className="qa-label">Send Security Alert</span>
              </button>
              <button className="quick-action-btn">
                <span className="qa-icon">👥</span>
                <span className="qa-label">Manage Users</span>
              </button>
              <button className="quick-action-btn">
                <span className="qa-icon">📊</span>
                <span className="qa-label">Generate Report</span>
              </button>
              <button className="quick-action-btn">
                <span className="qa-icon">🔒</span>
                <span className="qa-label">Enforce Policies</span>
              </button>
              <button className="quick-action-btn">
                <span className="qa-icon">⚙️</span>
                <span className="qa-label">System Settings</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* BUSINESS OWNER / COMPANY ADMIN VIEW */}
      {effectiveBusiness && (
        <>
          <div className="company-header">
            <div className="company-info-header">
              <h1>{userName}, welcome {displayCompanyName}</h1>
              <p className="company-subtitle">Your company security overview</p>
            </div>
          </div>

          <div className="metrics-grid-business">
            <div className="metric-card-business">
              <div className="metric-icon-business">🛡️</div>
              <div className="metric-value-business">342</div>
              <div className="metric-label-business">Protected Devices</div>
              <div className="metric-change positive">+12 this month</div>
            </div>

            <div className="metric-card-business">
              <div className="metric-icon-business">👥</div>
              <div className="metric-value-business">{clientTenant?.employees || 156}</div>
              <div className="metric-label-business">Total Employees</div>
              <div className="metric-change neutral">85% trained</div>
            </div>

            <div className="metric-card-business">
              <div className="metric-icon-business">⚠️</div>
              <div className="metric-value-business">23</div>
              <div className="metric-label-business">Active Threats</div>
              <div className="metric-change negative">5 high priority</div>
            </div>

            <div className="metric-card-business">
              <div className="metric-icon-business">📊</div>
              <div className="metric-value-business">88%</div>
              <div className="metric-label-business">Security Score</div>
              <div className="metric-change positive">+3% this week</div>
            </div>
          </div>

          {/* ADDED: Global Threat Activity for Business Owner */}
          <div className="section-business">
            <div className="section-header-business">
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

          <div className="section-business">
            <h2>🔐 Company Security Status</h2>
            <div className="security-status-cards">
              <div className="status-card success">
                <div className="status-icon">✅</div>
                <div className="status-content">
                  <div className="status-title">Firewall Protected</div>
                  <div className="status-detail">All endpoints secured</div>
                </div>
              </div>

              <div className="status-card success">
                <div className="status-icon">🔒</div>
                <div className="status-content">
                  <div className="status-title">Data Encrypted</div>
                  <div className="status-detail">256-bit encryption active</div>
                </div>
              </div>

              <div className="status-card warning">
                <div className="status-icon">⚠️</div>
                <div className="status-content">
                  <div className="status-title">Updates Pending</div>
                  <div className="status-detail">12 devices need updates</div>
                </div>
              </div>

              <div className="status-card success">
                <div className="status-icon">🛡️</div>
                <div className="status-content">
                  <div className="status-title">Threat Detection</div>
                  <div className="status-detail">Real-time monitoring active</div>
                </div>
              </div>
            </div>
          </div>

          <div className="section-business">
            <div className="section-header-business">
              <h2>👥 Team Security Overview</h2>
              <button className="btn-view-all">View All Employees →</button>
            </div>
            <div className="team-stats-grid">
              <div className="team-stat">
                <div className="stat-number">142</div>
                <div className="stat-label">Compliant</div>
                <div className="stat-percentage">91%</div>
              </div>
              <div className="team-stat warning">
                <div className="stat-number">14</div>
                <div className="stat-label">Needs Training</div>
                <div className="stat-percentage">9%</div>
              </div>
              <div className="team-stat">
                <div className="stat-number">132</div>
                <div className="stat-label">MFA Enabled</div>
                <div className="stat-percentage">85%</div>
              </div>
            </div>
          </div>

          <div className="section-business">
            <h2>📋 Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon success">✅</div>
                <div className="activity-content">
                  <div className="activity-title">Security Update Completed</div>
                  <div className="activity-detail">All critical patches installed company-wide</div>
                  <div className="activity-time">1 hour ago</div>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon info">📧</div>
                <div className="activity-content">
                  <div className="activity-title">Training Reminder Sent</div>
                  <div className="activity-detail">Security awareness training due for 14 employees</div>
                  <div className="activity-time">3 hours ago</div>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon warning">⚠️</div>
                <div className="activity-content">
                  <div className="activity-title">Threat Detected & Blocked</div>
                  <div className="activity-detail">Phishing attempt blocked from external source</div>
                  <div className="activity-time">Yesterday</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* EMPLOYEE VIEW */}
      {effectiveEmployee && (
        <>
          <div className="personal-hero">
            <div className="personal-welcome">
              <h1>Hi {userName.split(' ')[0]}! 👋</h1>
              <p>Your personal security dashboard</p>
            </div>
            <div className="personal-score-card">
              <div className="personal-score-ring">
                <svg viewBox="0 0 100 100">
                  <circle className="score-ring-bg" cx="50" cy="50" r="45"/>
                  <circle 
                    className="score-ring-fill" 
                    cx="50" 
                    cy="50" 
                    r="45"
                    style={{ strokeDasharray: `${92 * 2.83} 283` }}
                  />
                </svg>
                <div className="personal-score-value">92</div>
              </div>
              <div className="personal-score-label">Your Security Score</div>
              <div className="personal-score-status good">Great Job!</div>
            </div>
          </div>

          <div className="personal-stats">
            <div className="personal-stat-card">
              <div className="stat-icon">💻</div>
              <div className="stat-info">
                <div className="stat-value">2</div>
                <div className="stat-name">My Devices</div>
              </div>
              <div className="stat-badge success">Protected</div>
            </div>

            <div className="personal-stat-card">
              <div className="stat-icon">🎓</div>
              <div className="stat-info">
                <div className="stat-value">3/4</div>
                <div className="stat-name">Training Complete</div>
              </div>
              <div className="stat-badge warning">1 pending</div>
            </div>

            <div className="personal-stat-card">
              <div className="stat-icon">🛡️</div>
              <div className="stat-info">
                <div className="stat-value">47</div>
                <div className="stat-name">Threats Blocked</div>
              </div>
              <div className="stat-badge info">This month</div>
            </div>
          </div>

          {/* ADDED: Global Threat Activity for Employee */}
          <div className="personal-section">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
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

          <div className="personal-section">
            <h2>💻 My Devices</h2>
            <div className="device-cards">
              <div className="device-card">
                <div className="device-icon">💻</div>
                <div className="device-info">
                  <div className="device-name">Work Laptop</div>
                  <div className="device-model">MacBook Pro 16"</div>
                  <div className="device-status protected">Protected & Up to Date</div>
                </div>
                <div className="device-badge success">✅</div>
              </div>

              <div className="device-card">
                <div className="device-icon">📱</div>
                <div className="device-info">
                  <div className="device-name">Work Phone</div>
                  <div className="device-model">iPhone 14 Pro</div>
                  <div className="device-status protected">Microsoft Defender Active</div>
                </div>
                <div className="device-badge success">✅</div>
              </div>
            </div>
          </div>

          <div className="personal-section">
            <h2>🎓 My Security Training</h2>
            <div className="training-progress">
              <div className="training-item completed">
                <div className="training-icon">✅</div>
                <div className="training-info">
                  <div className="training-name">Password Security</div>
                  <div className="training-date">Completed Nov 15, 2024</div>
                </div>
                <button className="training-btn review">Review</button>
              </div>

              <div className="training-item completed">
                <div className="training-icon">✅</div>
                <div className="training-info">
                  <div className="training-name">Phishing Awareness</div>
                  <div className="training-date">Completed Nov 28, 2024</div>
                </div>
                <button className="training-btn review">Review</button>
              </div>

              <div className="training-item completed">
                <div className="training-icon">✅</div>
                <div className="training-info">
                  <div className="training-name">Data Protection</div>
                  <div className="training-date">Completed Dec 5, 2024</div>
                </div>
                <button className="training-btn review">Review</button>
              </div>

              <div className="training-item pending">
                <div className="training-icon">📚</div>
                <div className="training-info">
                  <div className="training-name">Secure Remote Work</div>
                  <div className="training-date">Due Dec 20, 2024</div>
                </div>
                <button className="training-btn start">Start Now</button>
              </div>
            </div>
          </div>

          <div className="personal-section">
            <h2>💡 Security Tips for You</h2>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">🔐</div>
                <div className="tip-title">Enable MFA</div>
                <div className="tip-description">Add an extra layer of security to your accounts</div>
                <button className="tip-btn">Set Up Now</button>
              </div>

              <div className="tip-card">
                <div className="tip-icon">📱</div>
                <div className="tip-title">Secure Your Phone</div>
                <div className="tip-description">Install Microsoft Defender on your mobile device</div>
                <button className="tip-btn">Download App</button>
              </div>

              <div className="tip-card">
                <div className="tip-icon">🔑</div>
                <div className="tip-title">Update Password</div>
                <div className="tip-description">Last changed 45 days ago - Consider updating</div>
                <button className="tip-btn">Change Password</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  const renderThreatsPage = () => (
    <div className="page-content">
      <h1>⚠️ Active Threats</h1>
      <p className="page-subtitle">Real-time threat monitoring and analysis</p>
      <div className="content-placeholder">
        <p>Threat management dashboard coming soon...</p>
      </div>
    </div>
  );

  const renderTrainingPage = () => {
    const statusLabel = {
      'completed': 'Completed',
      'in-progress': 'In Progress',
      'not-started': effectiveEmployee ? 'Start Course' : 'Assign'
    };

    return (
      <div className="training-page">
        <div className="training-hero">
          <div>
            <h1>🎓 Security Awareness Training</h1>
            <p className="page-subtitle">
              {effectiveMSP && 'Training compliance across all managed organizations'}
              {effectiveBusiness && `Assign and track security training for ${displayCompanyName}`}
              {effectiveEmployee && 'Complete your assigned courses to stay secure and compliant'}
            </p>
          </div>
        </div>

        {/* Training stats — role aware */}
        <div className="training-stats">
          {effectiveEmployee ? (
            <>
              <div className="training-stat-card">
                <div className="tstat-value">3<span className="tstat-total">/6</span></div>
                <div className="tstat-label">Courses Completed</div>
              </div>
              <div className="training-stat-card">
                <div className="tstat-value">1</div>
                <div className="tstat-label">In Progress</div>
              </div>
              <div className="training-stat-card warning">
                <div className="tstat-value">Dec 20</div>
                <div className="tstat-label">Next Due Date</div>
              </div>
              <div className="training-stat-card success">
                <div className="tstat-value">92%</div>
                <div className="tstat-label">Avg. Quiz Score</div>
              </div>
            </>
          ) : (
            <>
              <div className="training-stat-card">
                <div className="tstat-value">{effectiveMSP ? '4' : '1'}</div>
                <div className="tstat-label">{effectiveMSP ? 'Organizations' : 'Company'}</div>
              </div>
              <div className="training-stat-card success">
                <div className="tstat-value">{effectiveMSP ? '82%' : '85%'}</div>
                <div className="tstat-label">Overall Completion</div>
              </div>
              <div className="training-stat-card warning">
                <div className="tstat-value">{effectiveMSP ? '58' : '14'}</div>
                <div className="tstat-label">Overdue Learners</div>
              </div>
              <div className="training-stat-card">
                <div className="tstat-value">{trainingCourses.length}</div>
                <div className="tstat-label">Active Courses</div>
              </div>
            </>
          )}
        </div>

        {/* Course catalog */}
        <div className="section-compact">
          <div className="section-hdr">
            <h2>📚 Course Catalog</h2>
            {!effectiveEmployee && <button className="view-all-sm">+ Assign Courses</button>}
          </div>
          <div className="courses-grid">
            {trainingCourses.map(course => (
              <div key={course.id} className={`course-card ${course.status}`}>
                <div className="course-top">
                  <span className="course-icon">{course.icon}</span>
                  <span className={`course-level ${course.level === 'Required' ? 'required' : 'recommended'}`}>
                    {course.level}
                  </span>
                </div>
                <h3 className="course-title">{course.title}</h3>
                <div className="course-category">{course.category}</div>
                <p className="course-desc">{course.description}</p>
                <div className="course-meta">
                  <span>⏱️ {course.duration}</span>
                  <span>📖 {course.lessons} lessons</span>
                </div>

                {effectiveEmployee ? (
                  <>
                    {course.status === 'in-progress' && (
                      <div className="course-progress-bar">
                        <div className="course-progress-fill" style={{ width: '60%' }}></div>
                      </div>
                    )}
                    <button className={`course-btn ${course.status}`}>
                      {course.status === 'completed' && '✅ Review'}
                      {course.status === 'in-progress' && '▶ Continue'}
                      {course.status === 'not-started' && 'Start Course'}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="course-completion">
                      <div className="course-completion-head">
                        <span>Team completion</span>
                        <span>{course.completion}%</span>
                      </div>
                      <div className="course-progress-bar">
                        <div
                          className="course-progress-fill"
                          style={{ width: `${course.completion}%` }}
                        ></div>
                      </div>
                      <div className="course-enrolled">{course.enrolled} learners enrolled</div>
                    </div>
                    <button className="course-btn manage">{statusLabel[course.status]}</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAlertsPage = () => (
    <div className="page-content">
      <h1>🚨 Security Alerts</h1>
      <p className="page-subtitle">Recent security notifications and warnings</p>
      <div className="content-placeholder">
        <p>Alerts dashboard coming soon...</p>
      </div>
    </div>
  );

  const renderMobilePage = () => (
    <div className="mobile-security-page">
      <div className="mobile-hero">
        <h1>📱 Mobile Security</h1>
        <p>Protect your mobile devices with Microsoft Defender</p>
      </div>

      <div className="mobile-downloads">
        <div className="download-card ios">
          <div className="download-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </div>
          <h3>iOS App</h3>
          <p>Available for iPhone and iPad</p>
          <p className="requirements">Requires iOS 15.0 or later</p>
          <a href="https://apps.apple.com/app/microsoft-defender/id1526737990" className="download-btn">
            Download on App Store
          </a>
        </div>

        <div className="download-card android">
          <div className="download-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-2.86-1.21-6.08-1.21-8.94 0L5.65 5.67c-.19-.28-.55-.37-.84-.22-.3.16-.42.54-.26.85L6.4 9.48C3.3 11.25 1.28 14.44 1 18h22c-.28-3.56-2.3-6.75-5.4-8.52M7 15.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25m10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25"/>
            </svg>
          </div>
          <h3>Android App</h3>
          <p>Available for Android devices</p>
          <p className="requirements">Requires Android 8.0 or later</p>
          <a href="https://play.google.com/store/apps/details?id=com.microsoft.scmx" className="download-btn">
            Get it on Google Play
          </a>
        </div>
      </div>

      <div className="mobile-setup-guide">
        <h2>📲 Setup Instructions</h2>
        <div className="setup-steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Download the App</h3>
            <p>Get Microsoft Defender from the App Store or Google Play</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Sign In</h3>
            <p>Use your company Microsoft account to sign in</p>
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
            <span className="logo-icon" aria-hidden="true">
              <svg viewBox="0 0 48 56" width="34" height="40" role="img" aria-label="CyproSecure 360 shield">
                <path
                  d="M24 2 L44 10 V26 C44 40 35 50 24 54 C13 50 4 40 4 26 V10 Z"
                  fill="var(--accent-primary)"
                />
                <path
                  d="M24 6.5 L39.5 12.7 V26 C39.5 37.5 32 46 24 49.4 C16 46 8.5 37.5 8.5 26 V12.7 Z"
                  fill="var(--bg-secondary)"
                />
                <path
                  d="M16 27 l6 6 l11 -13"
                  fill="none"
                  stroke="var(--accent-primary)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {!sidebarCollapsed && (
              <span className="logo-text">
                CYPRO<span className="logo-accent">SECURE</span> 360
              </span>
            )}
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
                <span className="nav-badge">{effectiveMSP ? securityData.highAlerts : employees.reduce((sum, e) => sum + e.threats, 0)}</span>
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
              {currentPage === 'dashboard' && (effectiveMSP ? 'MSSP Security Dashboard' : effectiveBusiness ? 'Company Security Dashboard' : 'My Security Dashboard')}
              {currentPage === 'threats' && 'Threat Management'}
              {currentPage === 'training' && 'Security Training'}
              {currentPage === 'alerts' && 'Security Alerts'}
              {currentPage === 'mobile' && 'Mobile Security'}
              {currentPage === 'reports' && 'Reports & Analytics'}
              {currentPage === 'settings' && 'Settings'}
            </h2>
          </div>
          <div className="top-bar-right">
            {/* MSSP owners can preview the Company Admin and Employee experiences */}
            {isMSPOwner && (
              <div className="view-as-switcher" role="group" aria-label="Preview dashboard as role">
                <span className="view-as-label">View as</span>
                <button
                  className={`view-as-btn ${viewAs === 'mssp' ? 'active' : ''}`}
                  onClick={() => setViewAs('mssp')}
                >
                  MSSP
                </button>
                <button
                  className={`view-as-btn ${viewAs === 'admin' ? 'active' : ''}`}
                  onClick={() => setViewAs('admin')}
                >
                  Company Admin
                </button>
                <button
                  className={`view-as-btn ${viewAs === 'employee' ? 'active' : ''}`}
                  onClick={() => setViewAs('employee')}
                >
                  Employee
                </button>
              </div>
            )}
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

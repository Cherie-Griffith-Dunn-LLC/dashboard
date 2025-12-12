import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import './Dashboard.css';

/**
 * CYPROSECURE - Complete Multi-Tenant Dashboard
 * All pages built out with navigation
 */
function Dashboard() {
  const { instance, accounts } = useMsal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState('all');
  const [currentPage, setCurrentPage] = useState('dashboard'); // Navigation state
  
  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your CYPROSECURE support assistant. I can help with:\n\n• Microsoft 365 (Excel, Word, Teams, Outlook, etc.)\n• Device issues (Windows, Mac, Mobile)\n• Security questions\n• General IT support\n\nWhat can I help you with today?"
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const user = accounts[0];
  const userName = user?.name || 'User';
  
  // Get tenant info from Azure AD
  const tenantId = user?.tenantId || '';
  const companyName = user?.idTokenClaims?.company || user?.idTokenClaims?.organization || 'Your Company';
  
  // Cyproteck MSSP tenant ID
  const CYPROTECK_TENANT_ID = 'ff4945f1-e101-4ac8-a78f-798156ea9cdf';
  
  // Check user roles from Azure AD
  const userRoles = user?.idTokenClaims?.roles || [];
  const userEmail = user?.username || user?.idTokenClaims?.preferred_username || '';
  const isCyproteckEmail = userEmail.toLowerCase().includes('@cyproteck.com');
  
  // Map Azure AD roles - SUPPORTS BOTH APP REGISTRATIONS
  // App 1 ("CYPROTECK"): Tenant, BusinessOwner, Cyproemployee, Businessemployee
  // App 2 ("Portals-CYPROTECK CYPROSECURE"): TenantOwner, Businessowner, CyproteckEmployee, CustomerEmployee
  
  const hasTenantRole = userRoles.some(role => 
    role === 'Tenant' || 
    role === 'Cyprotenant' ||
    role === 'TenantOwner' ||
    role.toLowerCase() === 'tenant' ||
    role.toLowerCase() === 'tenantowner'
  );
  
  const hasBusinessOwnerRole = userRoles.some(role => 
    role === 'BusinessOwner' ||
    role === 'Businessowner' ||
    role.toLowerCase() === 'businessowner'
  );
  
  // Determine user type
  const isMSSPOwner = (tenantId === CYPROTECK_TENANT_ID && (hasTenantRole || isCyproteckEmail));
  const isBusinessOwner = (tenantId !== CYPROTECK_TENANT_ID && hasBusinessOwnerRole);
  const isEmployee = !isMSSPOwner && !isBusinessOwner;

  // Mock data - Company threat rollup for MSSP view
  const companyThreats = [
    { 
      id: 1, 
      name: 'Acme Healthcare', 
      status: 'critical',
      activeThreats: 24,
      highAlerts: 8,
      mediumAlerts: 12,
      lowAlerts: 4,
      employees: 245,
      riskScore: 82,
      lastIncident: '2 hours ago',
      contact: 'john.doe@acme-health.com'
    },
    { 
      id: 2, 
      name: 'Tech Solutions Inc', 
      status: 'medium',
      activeThreats: 12,
      highAlerts: 2,
      mediumAlerts: 8,
      lowAlerts: 2,
      employees: 156,
      riskScore: 65,
      lastIncident: '1 day ago',
      contact: 'sarah.smith@techsolutions.com'
    },
    { 
      id: 3, 
      name: 'Finance Group LLC', 
      status: 'low',
      activeThreats: 5,
      highAlerts: 0,
      mediumAlerts: 3,
      lowAlerts: 2,
      employees: 89,
      riskScore: 42,
      lastIncident: '5 days ago',
      contact: 'mike.jones@financegroup.com'
    },
  ];

  // Calculate rolled-up metrics
  const totalCompanyThreats = companyThreats.reduce((sum, c) => sum + c.activeThreats, 0);
  const totalHighAlerts = companyThreats.reduce((sum, c) => sum + c.highAlerts, 0);
  const totalMediumAlerts = companyThreats.reduce((sum, c) => sum + c.mediumAlerts, 0);
  const totalLowAlerts = companyThreats.reduce((sum, c) => sum + c.lowAlerts, 0);
  const criticalCompanies = companyThreats.filter(c => c.status === 'critical').length;
  const mediumCompanies = companyThreats.filter(c => c.status === 'medium').length;

  // Navigation handlers
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Helper functions
  const getRiskColor = (score) => {
    if (score >= 70) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  };

  const getStatusColor = (status) => {
    if (status === 'critical') return 'danger';
    if (status === 'medium') return 'warning';
    return 'success';
  };

  // Render different pages based on currentPage state
  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return renderDashboard();
      case 'security':
        return renderSecurityPage();
      case 'threats':
        return renderThreatsPage();
      case 'training':
        return renderTrainingPage();
      case 'alerts':
        return renderAlertsPage();
      case 'mobile':
        return renderMobileSecurityPage();
      case 'reports':
        return renderReportsPage();
      case 'settings':
        return renderSettingsPage();
      default:
        return renderDashboard();
    }
  };

  // DASHBOARD PAGE
  const renderDashboard = () => (
    <>
      {/* Universal Welcome */}
      <div className="universal-welcome">
        <div className="welcome-flex">
          <div className="welcome-text-side">
            <h1>Welcome back, {userName.split(' ')[0]}! 👋</h1>
            <p className="welcome-subtitle">
              {isMSSPOwner ? 'MSSP Security Dashboard' : isBusinessOwner ? 'Business Security Dashboard' : 'My Security Dashboard'}
            </p>
          </div>
          <div className="welcome-score-side">
            <div className="score-ring-large">
              <svg viewBox="0 0 120 120">
                <circle className="ring-bg" cx="60" cy="60" r="50"/>
                <circle 
                  className="ring-progress" 
                  cx="60" 
                  cy="60" 
                  r="50"
                  style={{ strokeDasharray: `${(isMSSPOwner ? 85 : 71) * 3.14} 314` }}
                />
              </svg>
              <div className="score-num-large">{isMSSPOwner ? 85 : 71}</div>
            </div>
            <div className="score-label-side">
              <div className="score-title">Security Score</div>
              <div className={`score-status ${isMSSPOwner ? 'good' : 'medium'}`}>
                {isMSSPOwner ? 'Excellent' : 'Needs Improvement'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MSSP Owner: Company Alert Dashboard */}
      {isMSSPOwner && (
        <>
          {/* Rolled-up Metrics */}
          <div className="metrics-compact">
            <div className="metric-box">
              <div className="metric-icon-sm">🏢</div>
              <div className="metric-data">
                <div className="metric-val">{companyThreats.length}</div>
                <div className="metric-lbl">Active Clients</div>
              </div>
              <div className="metric-trend neutral">Monitored</div>
            </div>

            <div className="metric-box">
              <div className="metric-icon-sm">⚠️</div>
              <div className="metric-data">
                <div className="metric-val">{totalCompanyThreats}</div>
                <div className="metric-lbl">Total Threats</div>
              </div>
              <div className="metric-breakdown">
                <span className="high">{totalHighAlerts}H</span>
                <span className="medium">{totalMediumAlerts}M</span>
                <span className="low">{totalLowAlerts}L</span>
              </div>
            </div>

            <div className="metric-box danger">
              <div className="metric-icon-sm">🚨</div>
              <div className="metric-data">
                <div className="metric-val">{criticalCompanies}</div>
                <div className="metric-lbl">Critical Alert</div>
              </div>
              <div className="metric-trend danger">Immediate Action</div>
            </div>

            <div className="metric-box warning">
              <div className="metric-icon-sm">⚡</div>
              <div className="metric-data">
                <div className="metric-val">{mediumCompanies}</div>
                <div className="metric-lbl">Medium Alert</div>
              </div>
              <div className="metric-trend warning">Review Soon</div>
            </div>
          </div>

          {/* Company Alert Table */}
          <div className="section-compact">
            <div className="section-hdr">
              <h2>Client Security Status - Action Required</h2>
              <button className="view-all-sm" onClick={() => navigateTo('threats')}>View All Threats →</button>
            </div>
            <div className="company-alerts-table">
              {companyThreats.map(company => (
                <div key={company.id} className={`company-alert-card ${company.status}`}>
                  <div className="company-alert-header">
                    <div className="company-info">
                      <h3>{company.name}</h3>
                      <span className={`status-badge-lg ${getStatusColor(company.status)}`}>
                        {company.status === 'critical' ? '🚨 CRITICAL' : 
                         company.status === 'medium' ? '⚠️ MEDIUM RISK' : 
                         '✅ LOW RISK'}
                      </span>
                    </div>
                    <div className="company-metrics-mini">
                      <div className="metric-mini">
                        <div className="metric-mini-val">{company.activeThreats}</div>
                        <div className="metric-mini-lbl">Active Threats</div>
                      </div>
                      <div className="metric-mini">
                        <div className="metric-mini-val">{company.riskScore}</div>
                        <div className="metric-mini-lbl">Risk Score</div>
                      </div>
                      <div className="metric-mini">
                        <div className="metric-mini-val">{company.employees}</div>
                        <div className="metric-mini-lbl">Employees</div>
                      </div>
                    </div>
                  </div>
                  <div className="company-alert-body">
                    <div className="threat-breakdown">
                      <span className="threat-stat high">{company.highAlerts} High</span>
                      <span className="threat-stat medium">{company.mediumAlerts} Medium</span>
                      <span className="threat-stat low">{company.lowAlerts} Low</span>
                    </div>
                    <div className="last-incident">
                      Last incident: {company.lastIncident}
                    </div>
                  </div>
                  <div className="company-alert-actions">
                    <button className="action-btn-sm primary">📞 Contact: {company.contact}</button>
                    <button className="action-btn-sm">📊 View Details</button>
                    <button className="action-btn-sm">🔒 Enforce Policies</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );

  // THREATS PAGE
  const renderThreatsPage = () => (
    <div className="page-container">
      <div className="page-header">
        <h1>🚨 Threat Management</h1>
        <p className="page-subtitle">Monitor, analyze, and respond to security threats across your organization</p>
      </div>

      <div className="info-section">
        <h2>What are Security Threats?</h2>
        <p>Security threats are potential risks or attacks targeting your organization's digital assets, data, or systems. They can come from various sources including malware, phishing attempts, unauthorized access attempts, and more.</p>
        
        <div className="threat-types-grid">
          <div className="threat-type-card">
            <div className="threat-icon">🦠</div>
            <h3>Malware</h3>
            <p>Malicious software designed to harm or exploit devices, including viruses, ransomware, and spyware.</p>
          </div>
          <div className="threat-type-card">
            <div className="threat-icon">🎣</div>
            <h3>Phishing</h3>
            <p>Fraudulent attempts to obtain sensitive information by disguising as trustworthy entities in emails or messages.</p>
          </div>
          <div className="threat-type-card">
            <div className="threat-icon">🔓</div>
            <h3>Unauthorized Access</h3>
            <p>Attempts to gain access to systems, accounts, or data without proper authentication or authorization.</p>
          </div>
          <div className="threat-type-card">
            <div className="threat-icon">📡</div>
            <h3>Network Attacks</h3>
            <p>Attempts to disrupt, intercept, or manipulate network traffic and communications.</p>
          </div>
        </div>
      </div>

      {isMSSPOwner && (
        <div className="section-compact">
          <h2>Active Threats Across All Clients</h2>
          <div className="threat-list">
            {companyThreats.map(company => (
              <div key={company.id} className="threat-company-section">
                <h3>{company.name} - {company.activeThreats} Active Threats</h3>
                {/* Threat details would go here */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // MOBILE SECURITY PAGE
  const renderMobileSecurityPage = () => (
    <div className="page-container">
      <div className="page-header">
        <h1>📱 Mobile Security</h1>
        <p className="page-subtitle">Protect your mobile devices with Microsoft Defender</p>
      </div>

      <div className="mobile-security-hero">
        <div className="mobile-hero-content">
          <h2>Secure Your Mobile Devices</h2>
          <p>Microsoft Defender for mobile provides comprehensive protection for your iOS and Android devices, defending against phishing, malware, and unsafe network connections.</p>
        </div>
      </div>

      <div className="download-section-large">
        <h2>Download Microsoft Defender</h2>
        <div className="download-cards">
          <div className="download-card ios">
            <div className="download-icon">🍎</div>
            <h3>iOS & iPadOS</h3>
            <p>Protect your iPhone and iPad</p>
            <a 
              href="https://apps.apple.com/us/app/microsoft-defender/id1526737990" 
              target="_blank" 
              rel="noopener noreferrer"
              className="download-btn-large"
            >
              Download for iOS
            </a>
            <div className="requirements">
              Requires iOS 15.0 or later
            </div>
          </div>

          <div className="download-card android">
            <div className="download-icon">🤖</div>
            <h3>Android</h3>
            <p>Protect your Android phone or tablet</p>
            <a 
              href="https://play.google.com/store/apps/details?id=com.microsoft.scmx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="download-btn-large"
            >
              Download for Android
            </a>
            <div className="requirements">
              Requires Android 8.0 or later
            </div>
          </div>
        </div>
      </div>

      <div className="setup-instructions">
        <h2>Setup Instructions</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Download the App</h3>
              <p>Download Microsoft Defender from the App Store (iOS) or Google Play Store (Android)</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Sign In</h3>
              <p>Open the app and sign in with your company email address</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Enable Permissions</h3>
              <p>Grant necessary permissions for web protection, VPN, and notifications</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>You're Protected!</h3>
              <p>Your device is now protected. The app runs in the background to keep you safe</p>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>Protection Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon">🔗</span>
            <h4>Web Protection</h4>
            <p>Blocks malicious websites and phishing attempts</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🦠</span>
            <h4>Malware Scanning</h4>
            <p>Detects and removes malicious apps</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📧</span>
            <h4>Phishing Protection</h4>
            <p>Identifies fraudulent emails and messages</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🛡️</span>
            <h4>Real-time Protection</h4>
            <p>Continuous monitoring and threat prevention</p>
          </div>
        </div>
      </div>
    </div>
  );

  // REPORTS PAGE
  const renderReportsPage = () => (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Reports & Analytics</h1>
        <p className="page-subtitle">Generate and download comprehensive security and training reports</p>
      </div>

      <div className="reports-grid">
        {/* Training Reports */}
        <div className="report-card">
          <div className="report-icon">🎓</div>
          <h3>Training Completion Report</h3>
          <p>View who has completed required security training and who still needs to complete courses</p>
          <div className="report-stats">
            <div className="stat">
              <span className="stat-value">67%</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat">
              <span className="stat-value">15</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
          <button className="download-report-btn">
            📥 Download Training Report
          </button>
        </div>

        {/* Incomplete Training */}
        <div className="report-card">
          <div className="report-icon">⏳</div>
          <h3>Incomplete Training Report</h3>
          <p>List of employees who haven't completed required training with their progress status</p>
          <div className="report-stats">
            <div className="stat">
              <span className="stat-value">15</span>
              <span className="stat-label">Employees</span>
            </div>
            <div className="stat">
              <span className="stat-value">3</span>
              <span className="stat-label">Overdue</span>
            </div>
          </div>
          <button className="download-report-btn">
            📥 Download Incomplete Training
          </button>
        </div>

        {/* Threat Summary */}
        <div className="report-card">
          <div className="report-icon">⚠️</div>
          <h3>Threat Summary Report</h3>
          <p>Most common security threats and incidents detected across your organization</p>
          <div className="report-stats">
            <div className="stat">
              <span className="stat-value">127</span>
              <span className="stat-label">Total Threats</span>
            </div>
            <div className="stat">
              <span className="stat-value">14</span>
              <span className="stat-label">Critical</span>
            </div>
          </div>
          <button className="download-report-btn">
            📥 Download Threat Report
          </button>
        </div>

        {/* Outliers Report */}
        <div className="report-card">
          <div className="report-icon">📈</div>
          <h3>Security Outliers Report</h3>
          <p>Identify employees or departments with unusual security patterns or elevated risk</p>
          <div className="report-stats">
            <div className="stat">
              <span className="stat-value">8</span>
              <span className="stat-label">Outliers</span>
            </div>
            <div className="stat">
              <span className="stat-value">3</span>
              <span className="stat-label">High Risk</span>
            </div>
          </div>
          <button className="download-report-btn">
            📥 Download Outliers Report
          </button>
        </div>

        {/* Compliance Report */}
        <div className="report-card">
          <div className="report-icon">✅</div>
          <h3>Compliance Report</h3>
          <p>Overall security compliance status including policies, training, and device security</p>
          <div className="report-stats">
            <div className="stat">
              <span className="stat-value">92%</span>
              <span className="stat-label">Compliant</span>
            </div>
            <div className="stat">
              <span className="stat-value">5</span>
              <span className="stat-label">Issues</span>
            </div>
          </div>
          <button className="download-report-btn">
            📥 Download Compliance Report
          </button>
        </div>

        {/* Executive Summary */}
        <div className="report-card">
          <div className="report-icon">📋</div>
          <h3>Executive Summary</h3>
          <p>High-level overview of security posture, incidents, and key metrics for leadership</p>
          <div className="report-stats">
            <div className="stat">
              <span className="stat-value">Monthly</span>
              <span className="stat-label">Updated</span>
            </div>
          </div>
          <button className="download-report-btn primary">
            📥 Download Executive Summary
          </button>
        </div>
      </div>

      {isMSSPOwner && (
        <div className="section-compact">
          <h2>Multi-Client Reports</h2>
          <p>Generate consolidated reports across all client organizations</p>
          <button className="download-report-btn-lg primary">
            📥 Download Multi-Client Report Package
          </button>
        </div>
      )}
    </div>
  );

  // Placeholder pages
  const renderSecurityPage = () => (
    <div className="page-container">
      <h1>🛡️ Security Overview</h1>
      <p>Security overview and posture management</p>
    </div>
  );

  const renderTrainingPage = () => (
    <div className="page-container">
      <h1>🎓 Security Training</h1>
      <p>Employee training management and progress tracking</p>
    </div>
  );

  const renderAlertsPage = () => (
    <div className="page-container">
      <h1>🚨 Security Alerts</h1>
      <p>Real-time security alerts and notifications</p>
    </div>
  );

  const renderSettingsPage = () => (
    <div className="page-container">
      <h1>⚙️ Settings</h1>
      <p>Dashboard settings and preferences</p>
    </div>
  );

  // Main render
  return (
    <div className={`dashboard ${darkMode ? 'dark' : 'light'}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🛡️</span>
            {!sidebarCollapsed && <span className="logo-text">CYPROSECURE</span>}
          </div>
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
            href="#security" 
            className={`nav-item ${currentPage === 'security' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigateTo('security'); }}
          >
            <span className="nav-icon">🛡️</span>
            {!sidebarCollapsed && <span className="nav-label">Security</span>}
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
                <span className="nav-badge">{isMSSPOwner ? totalCompanyThreats : 23}</span>
              </>
            )}
          </a>
          <a 
            href="#training" 
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

        <button className="sidebar-collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
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
        {/* Header */}
        <header className="top-header">
          <div className="header-left">
            <h2 className="page-title">
              {currentPage === 'dashboard' && isMSSPOwner && 'MSSP Security Dashboard'}
              {currentPage === 'dashboard' && isBusinessOwner && 'Business Security Dashboard'}
              {currentPage === 'dashboard' && isEmployee && 'My Security Dashboard'}
              {currentPage === 'security' && 'Security Overview'}
              {currentPage === 'threats' && 'Threat Management'}
              {currentPage === 'training' && 'Security Training'}
              {currentPage === 'alerts' && 'Security Alerts'}
              {currentPage === 'mobile' && 'Mobile Security'}
              {currentPage === 'reports' && 'Reports & Analytics'}
              {currentPage === 'settings' && 'Settings'}
            </h2>
          </div>
          <div className="header-right">
            <button className="header-btn">☀️</button>
            <button className="header-btn">🔔</button>
            <div className="user-menu">
              <div className="user-avatar">C</div>
              <span className="user-name">{companyName}</span>
              <button className="logout-btn" onClick={() => instance.logoutRedirect()}>
                ↪️ Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {isMSSPOwner && currentPage === 'dashboard' && (
            <div className="org-selector-top">
              <select value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)} className="org-dropdown">
                <option value="all">All Organizations</option>
                <option value="acme">Acme Healthcare</option>
                <option value="tech">Tech Solutions Inc</option>
                <option value="finance">Finance Group LLC</option>
              </select>
            </div>
          )}

          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

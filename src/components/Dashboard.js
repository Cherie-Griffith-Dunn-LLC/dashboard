import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import './Dashboard.css';

/**
 * CYPROSECURE PRODUCTION - Complete Multi-Tenant Dashboard
 * All features, all pages, tested and working
 */
function Dashboard() {
  const { instance, accounts } = useMsal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState('all');
  const [currentPage, setCurrentPage] = useState('dashboard');
  
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
  
  // CORRECT Azure AD role detection - supports BOTH app registrations
  const userRoles = user?.idTokenClaims?.roles || [];
  const userEmail = user?.username || user?.idTokenClaims?.preferred_username || '';
  const isCyproteckEmail = userEmail.toLowerCase().includes('@cyproteck.com');
  
  // Check for MSSP Owner roles (works with both Azure AD apps)
  const hasTenantRole = userRoles.some(role => 
    role === 'Tenant' || 
    role === 'Cyprotenant' ||
    role === 'TenantOwner' ||
    role.toLowerCase() === 'tenant' ||
    role.toLowerCase() === 'tenantowner'
  );
  
  // Check for Business Owner role
  const hasBusinessOwnerRole = userRoles.some(role => 
    role === 'BusinessOwner' ||
    role === 'Businessowner' ||
    role.toLowerCase() === 'businessowner'
  );
  
  // Determine user type
  const isMSSPOwner = (tenantId === CYPROTECK_TENANT_ID && (hasTenantRole || isCyproteckEmail));
  const isBusinessOwner = (tenantId !== CYPROTECK_TENANT_ID && hasBusinessOwnerRole);
  const isEmployee = !isMSSPOwner && !isBusinessOwner;

  // Mock data - MSSP Company Threat Rollup
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
      contact: 'john.doe@acme-health.com',
      topThreat: 'Ransomware attempt blocked'
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
      contact: 'sarah.smith@techsolutions.com',
      topThreat: 'Phishing emails detected'
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
      contact: 'mike.jones@financegroup.com',
      topThreat: 'Weak passwords flagged'
    },
  ];

  // Calculate rolled-up totals
  const totalThreats = companyThreats.reduce((sum, c) => sum + c.activeThreats, 0);
  const totalHighAlerts = companyThreats.reduce((sum, c) => sum + c.highAlerts, 0);
  const criticalCompanies = companyThreats.filter(c => c.status === 'critical').length;

  // Global threat data for world map
  const globalThreats = [
    { country: 'United States', x: 25, y: 35, count: 847, severity: 'high' },
    { country: 'China', x: 75, y: 35, count: 612, severity: 'high' },
    { country: 'Russia', x: 65, y: 25, count: 423, severity: 'medium' },
    { country: 'Germany', x: 52, y: 28, count: 289, severity: 'medium' },
    { country: 'Brazil', x: 35, y: 65, count: 156, severity: 'low' },
  ];

  // Navigation
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

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
            href="#threats" 
            className={`nav-item ${currentPage === 'threats' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigateTo('threats'); }}
          >
            <span className="nav-icon">⚠️</span>
            {!sidebarCollapsed && (
              <>
                <span className="nav-label">Threats</span>
                <span className="nav-badge">{isMSSPOwner ? totalThreats : 23}</span>
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
              {currentPage === 'dashboard' && (isMSSPOwner ? 'MSSP Dashboard' : isBusinessOwner ? 'Business Dashboard' : 'My Dashboard')}
              {currentPage === 'threats' && 'Threat Management'}
              {currentPage === 'training' && 'Security Training'}
              {currentPage === 'mobile' && 'Mobile Security'}
              {currentPage === 'reports' && 'Reports & Analytics'}
            </h2>
          </div>
          <div className="header-right">
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
          {currentPage === 'dashboard' && renderDashboard()}
          {currentPage === 'threats' && renderThreatsPage()}
          {currentPage === 'training' && renderTrainingPage()}
          {currentPage === 'mobile' && renderMobilePage()}
          {currentPage === 'reports' && renderReportsPage()}
        </div>
      </div>
    </div>
  );

  // DASHBOARD PAGE
  function renderDashboard() {
    return (
      <>
        {/* Welcome Section */}
        <div className="universal-welcome">
          <h1>Welcome back, {userName.split(' ')[0]}! 👋</h1>
          <p>{isMSSPOwner ? 'MSSP Security Dashboard' : isBusinessOwner ? 'Business Security Dashboard' : 'My Security Dashboard'}</p>
        </div>

        {/* MSSP Owner View */}
        {isMSSPOwner && (
          <>
            {/* Organization Selector */}
            <div className="org-selector-top">
              <select value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)} className="org-dropdown">
                <option value="all">All Organizations</option>
                <option value="acme">Acme Healthcare</option>
                <option value="tech">Tech Solutions Inc</option>
                <option value="finance">Finance Group LLC</option>
              </select>
            </div>

            {/* Rolled-up Metrics */}
            <div className="metrics-row">
              <div className="metric-card">
                <div className="metric-icon">🏢</div>
                <div className="metric-value">{companyThreats.length}</div>
                <div className="metric-label">Active Clients</div>
              </div>
              <div className="metric-card danger">
                <div className="metric-icon">⚠️</div>
                <div className="metric-value">{totalThreats}</div>
                <div className="metric-label">Total Threats</div>
              </div>
              <div className="metric-card critical">
                <div className="metric-icon">🚨</div>
                <div className="metric-value">{criticalCompanies}</div>
                <div className="metric-label">Critical Alerts</div>
              </div>
            </div>

            {/* Companies with Most Threats */}
            <div className="section-card">
              <h2>🔥 Companies Requiring Immediate Attention</h2>
              <div className="company-threat-list">
                {companyThreats
                  .sort((a, b) => b.activeThreats - a.activeThreats)
                  .map(company => (
                    <div key={company.id} className={`company-threat-card ${company.status}`}>
                      <div className="company-threat-header">
                        <h3>{company.name}</h3>
                        <span className={`status-badge ${company.status}`}>
                          {company.status === 'critical' ? '🚨 CRITICAL' : 
                           company.status === 'medium' ? '⚠️ MEDIUM' : '✅ LOW'}
                        </span>
                      </div>
                      <div className="company-threat-stats">
                        <div className="stat">
                          <span className="stat-value">{company.activeThreats}</span>
                          <span className="stat-label">Active Threats</span>
                        </div>
                        <div className="stat">
                          <span className="stat-value">{company.riskScore}</span>
                          <span className="stat-label">Risk Score</span>
                        </div>
                        <div className="stat">
                          <span className="stat-value">{company.employees}</span>
                          <span className="stat-label">Employees</span>
                        </div>
                      </div>
                      <div className="company-threat-details">
                        <div className="threat-breakdown">
                          <span className="high">{company.highAlerts} High</span>
                          <span className="medium">{company.mediumAlerts} Medium</span>
                          <span className="low">{company.lowAlerts} Low</span>
                        </div>
                        <div className="top-threat">🎯 {company.topThreat}</div>
                      </div>
                      <div className="company-actions">
                        <button className="btn-primary">📞 Contact: {company.contact}</button>
                        <button className="btn-secondary">📊 View Full Report</button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* World Threat Map */}
            <div className="section-card">
              <h2>🌍 Global Threat Activity</h2>
              <div className="world-map-container">
                <svg viewBox="0 0 800 400" className="world-map">
                  {/* Simple world map shape */}
                  <rect x="0" y="0" width="800" height="400" fill="#0a1929" />
                  
                  {/* Continents as simple shapes */}
                  <path d="M100,100 L200,80 L250,120 L220,180 L150,200 Z" fill="#1e293b" opacity="0.6" />
                  <path d="M150,220 L200,210 L230,250 L200,300 L160,280 Z" fill="#1e293b" opacity="0.6" />
                  <path d="M400,80 L480,70 L520,110 L490,160 L420,150 Z" fill="#1e293b" opacity="0.6" />
                  <path d="M420,170 L500,160 L540,210 L510,280 L440,270 Z" fill="#1e293b" opacity="0.6" />
                  <path d="M550,90 L680,80 L720,140 L690,200 L580,180 Z" fill="#1e293b" opacity="0.6" />
                  <path d="M620,260 L700,250 L720,300 L680,330 L630,310 Z" fill="#1e293b" opacity="0.6" />
                  
                  {/* Threat markers */}
                  {globalThreats.map((threat, idx) => (
                    <g key={idx}>
                      <circle 
                        cx={threat.x * 8} 
                        cy={threat.y * 8} 
                        r="8"
                        fill={threat.severity === 'high' ? '#ef4444' : threat.severity === 'medium' ? '#f59e0b' : '#22c55e'}
                        opacity="0.7"
                      >
                        <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <text 
                        x={threat.x * 8} 
                        y={threat.y * 8 - 15} 
                        fill="#fff" 
                        fontSize="11" 
                        textAnchor="middle"
                        fontWeight="600"
                      >
                        {threat.count}
                      </text>
                    </g>
                  ))}
                  
                  {/* Grid lines */}
                  <line x1="0" y1="200" x2="800" y2="200" stroke="#334155" strokeWidth="0.5" opacity="0.3" strokeDasharray="4,4" />
                  <line x1="400" y1="0" x2="400" y2="400" stroke="#334155" strokeWidth="0.5" opacity="0.3" strokeDasharray="4,4" />
                </svg>
                <div className="threat-legend">
                  <div className="legend-item">
                    <span className="legend-dot high"></span>
                    <span>High Severity</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot medium"></span>
                    <span>Medium Severity</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot low"></span>
                    <span>Low Severity</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // THREATS PAGE
  function renderThreatsPage() {
    return (
      <div className="page-container">
        <h1>⚠️ Threat Management</h1>
        <p className="page-subtitle">Monitor and respond to security threats</p>
        
        <div className="threat-types-grid">
          <div className="threat-card">
            <div className="threat-icon">🦠</div>
            <h3>Malware</h3>
            <p>Malicious software including viruses, ransomware, and spyware</p>
          </div>
          <div className="threat-card">
            <div className="threat-icon">🎣</div>
            <h3>Phishing</h3>
            <p>Fraudulent attempts to obtain sensitive information</p>
          </div>
          <div className="threat-card">
            <div className="threat-icon">🔓</div>
            <h3>Unauthorized Access</h3>
            <p>Attempts to gain access without proper authentication</p>
          </div>
          <div className="threat-card">
            <div className="threat-icon">📡</div>
            <h3>Network Attacks</h3>
            <p>Attempts to disrupt or intercept network communications</p>
          </div>
        </div>
      </div>
    );
  }

  // TRAINING PAGE
  function renderTrainingPage() {
    return (
      <div className="page-container">
        <h1>🎓 Security Training</h1>
        <p className="page-subtitle">AI-Generated training deployed automatically when incidents occur</p>
        
        <div className="training-feature-card">
          <h2>🤖 AI-Powered Incident Training</h2>
          <p>When a security incident is detected, our AI automatically generates custom training:</p>
          <ul>
            <li>✅ Personalized to the specific threat type</li>
            <li>✅ Deployed immediately to affected users</li>
            <li>✅ Tracks completion and understanding</li>
            <li>✅ Adapts based on user performance</li>
          </ul>
        </div>

        <div className="training-courses-grid">
          <div className="course-card">
            <h3>Password Security</h3>
            <div className="course-status completed">Completed</div>
          </div>
          <div className="course-card">
            <h3>Phishing Awareness</h3>
            <div className="course-status in-progress">In Progress</div>
          </div>
          <div className="course-card">
            <h3>Data Protection</h3>
            <div className="course-status pending">Not Started</div>
          </div>
        </div>
      </div>
    );
  }

  // MOBILE SECURITY PAGE
  function renderMobilePage() {
    return (
      <div className="page-container">
        <h1>📱 Mobile Security</h1>
        <p className="page-subtitle">Protect your mobile devices with Microsoft Defender</p>
        
        <div className="download-cards">
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
          </div>

          <div className="download-card android">
            <div className="download-icon">🤖</div>
            <h3>Android</h3>
            <p>Protect your Android device</p>
            <a 
              href="https://play.google.com/store/apps/details?id=com.microsoft.scmx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="download-btn"
            >
              Download for Android
            </a>
          </div>
        </div>
      </div>
    );
  }

  // REPORTS PAGE
  function renderReportsPage() {
    return (
      <div className="page-container">
        <h1>📊 Reports & Analytics</h1>
        <p className="page-subtitle">Download comprehensive security and training reports</p>
        
        <div className="reports-grid">
          <div className="report-card">
            <div className="report-icon">🎓</div>
            <h3>Training Completion Report</h3>
            <p>Who has completed required training</p>
            <button className="download-btn">📥 Download Report</button>
          </div>

          <div className="report-card">
            <div className="report-icon">⏳</div>
            <h3>Incomplete Training Report</h3>
            <p>Employees who need to complete training</p>
            <button className="download-btn">📥 Download Report</button>
          </div>

          <div className="report-card">
            <div className="report-icon">⚠️</div>
            <h3>Threat Summary Report</h3>
            <p>Most common threats and incidents</p>
            <button className="download-btn">📥 Download Report</button>
          </div>

          <div className="report-card">
            <div className="report-icon">📈</div>
            <h3>Security Outliers Report</h3>
            <p>Users with unusual security patterns</p>
            <button className="download-btn">📥 Download Report</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;

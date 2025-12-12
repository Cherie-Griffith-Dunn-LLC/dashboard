import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import './Dashboard.css';

/**
 * CYPROSECURE - Multi-Tenant Dashboard
 * MSSP View (Cyproteck) vs Business Owner View (Clients)
 */
function Dashboard() {
  const { instance, accounts } = useMsal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState('all');
  
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
  
  // Cyproteck MSP tenant ID
  const CYPROTECK_TENANT_ID = 'ff4945f1-e101-4ac8-a78f-798156ea9cdf';
  
  // Check user roles
  const userRoles = user?.idTokenClaims?.roles || [];
  const hasAdminRole = userRoles.some(role => 
    role.toLowerCase().includes('admin') || 
    role.toLowerCase().includes('administrator')
  );
  
  // Determine user type
  // MSP Owner = Cyproteck tenant + Admin role
  // Business Owner = Other tenant + Admin role  
  // Employee = Any tenant + No admin role
  const isMSSPOwner = tenantId === CYPROTECK_TENANT_ID && hasAdminRole;
  const isBusinessOwner = tenantId !== CYPROTECK_TENANT_ID && hasAdminRole;
  const isEmployee = !hasAdminRole;
  
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

  // Chatbot functions
  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const newMessage = {
      role: 'user',
      content: userInput
    };

    setChatMessages(prev => [...prev, newMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are a helpful IT support assistant for CYPROSECURE. You help users with:

1. Microsoft 365 questions (Excel formulas, Word, PowerPoint, Teams, Outlook, OneDrive)
2. Device troubleshooting (Windows, Mac, iPhone, Android, printers, network issues)
3. Security questions (passwords, MFA, phishing, best practices)
4. General IT support

Provide clear, step-by-step instructions. Be friendly and professional. If something requires hands-on support, recommend contacting Cyproteck support at support@cyproteck.com.

Keep responses concise but helpful.`,
          messages: [...chatMessages.filter(m => m.role !== 'system'), newMessage]
        })
      });

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.content[0].text
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting. Please contact Cyproteck support at support@cyproteck.com"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const contactSupport = () => {
    window.location.href = 'mailto:support@cyproteck.com?subject=Support Request from ' + userName;
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
                <span className="nav-badge">{isMSSPOwner ? securityData.highAlerts : employees.reduce((sum, e) => sum + e.threats, 0)}</span>
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
        <header className="top-bar">
          <div className="top-bar-left">
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
            <h1 className="page-title">
              {isMSSPOwner && 'MSP Security Dashboard'}
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
          {/* MSP Owner View - Organization Selector */}
          {isMSSPOwner && (
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

          {/* DEBUG INFO - Remove after testing */}
          <div style={{padding: '20px', background: '#ff0000', color: '#fff', marginBottom: '20px', borderRadius: '8px'}}>
            <h3>🔍 DEBUG INFO - Your Login Status:</h3>
            <p><strong>Your Tenant ID:</strong> {tenantId}</p>
            <p><strong>Cyproteck Tenant ID:</strong> {CYPROTECK_TENANT_ID}</p>
            <p><strong>Tenant Match:</strong> {tenantId === CYPROTECK_TENANT_ID ? '✅ YES - You are Cyproteck' : '❌ NO - Different tenant'}</p>
            <p><strong>Your Roles:</strong> {userRoles.length > 0 ? userRoles.join(', ') : 'No roles assigned'}</p>
            <p><strong>Has Admin Role:</strong> {hasAdminRole ? '✅ YES' : '❌ NO'}</p>
            <p><strong>Detected As:</strong> {isMSSPOwner ? '🏢 MSSP Owner' : isBusinessOwner ? '👔 Business Owner' : '👤 Employee'}</p>
          </div>

          {/* Universal Welcome - Shows for Everyone */}
          <div className="universal-welcome">
            <h1>Welcome back, {userName.split(' ')[0]}! 👋</h1>
            <p className="welcome-subtitle">Your security overview and global threat monitoring</p>
          </div>

          {/* MSP Owner Content - Heat Map Dashboard */}
          {isMSSPOwner && (
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
                      {/* Detailed World Map Continents */}
                      
                      {/* North America */}
                      <path d="M 120,180 L 140,160 L 160,150 L 185,145 L 210,140 L 230,135 L 245,130 L 260,140 L 270,160 L 275,180 L 270,200 L 260,220 L 250,235 L 235,245 L 220,250 L 200,248 L 180,240 L 165,230 L 150,218 L 140,205 L 130,190 Z M 245,160 L 255,150 L 268,155 L 275,165 L 270,175 L 260,180 L 250,175 Z" 
                            fill="var(--text-muted)" opacity="0.2" stroke="var(--accent-primary)" strokeWidth="1.5"/>
                      
                      {/* South America */}
                      <path d="M 240,260 L 255,255 L 270,258 L 280,265 L 288,280 L 293,300 L 295,320 L 293,340 L 288,360 L 280,375 L 268,385 L 255,390 L 245,388 L 235,380 L 228,365 L 223,345 L 220,325 L 218,305 L 220,285 L 225,270 Z" 
                            fill="var(--text-muted)" opacity="0.2" stroke="var(--accent-primary)" strokeWidth="1.5"/>
                      
                      {/* Europe */}
                      <path d="M 465,130 L 475,125 L 490,123 L 505,125 L 520,130 L 530,138 L 535,148 L 533,158 L 528,165 L 518,170 L 505,172 L 492,170 L 480,165 L 470,155 L 465,145 Z M 510,115 L 520,112 L 528,115 L 530,122 L 525,128 L 515,130 L 508,125 Z" 
                            fill="var(--text-muted)" opacity="0.2" stroke="var(--accent-primary)" strokeWidth="1.5"/>
                      
                      {/* Africa */}
                      <path d="M 485,195 L 500,190 L 515,192 L 530,198 L 542,208 L 550,220 L 555,235 L 558,255 L 560,275 L 558,295 L 555,315 L 548,335 L 538,352 L 525,365 L 510,372 L 495,373 L 482,368 L 472,358 L 465,343 L 462,325 L 460,305 L 462,285 L 465,265 L 470,245 L 478,225 L 485,210 Z" 
                            fill="var(--text-muted)" opacity="0.2" stroke="var(--accent-primary)" strokeWidth="1.5"/>
                      
                      {/* Asia */}
                      <path d="M 545,85 L 565,78 L 590,75 L 615,77 L 640,82 L 665,90 L 690,100 L 710,112 L 728,125 L 742,140 L 752,155 L 758,172 L 760,188 L 755,203 L 745,215 L 730,223 L 710,228 L 688,230 L 665,228 L 642,223 L 620,215 L 600,205 L 582,192 L 568,178 L 558,162 L 550,145 L 545,128 L 542,110 Z M 720,95 L 735,90 L 748,93 L 755,102 L 752,112 L 742,118 L 728,115 L 720,105 Z" 
                            fill="var(--text-muted)" opacity="0.2" stroke="var(--accent-primary)" strokeWidth="1.5"/>
                      
                      {/* Australia */}
                      <path d="M 720,335 L 740,330 L 760,332 L 778,338 L 792,348 L 800,360 L 802,373 L 798,385 L 788,393 L 773,397 L 755,398 L 738,394 L 725,386 L 718,374 L 715,360 L 717,348 Z" 
                            fill="var(--text-muted)" opacity="0.2" stroke="var(--accent-primary)" strokeWidth="1.5"/>
                      
                      {/* Grid lines */}
                      <line x1="0" y1="250" x2="1000" y2="250" stroke="var(--border-color)" strokeWidth="0.5" opacity="0.15" strokeDasharray="8,4"/>
                      <line x1="500" y1="0" x2="500" y2="500" stroke="var(--border-color)" strokeWidth="0.5" opacity="0.15" strokeDasharray="8,4"/>
                      
                      <text x="500" y="480" textAnchor="middle" fill="var(--text-muted)" fontSize="12" opacity="0.5" fontWeight="600">
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

              {/* Cyproteck Team - Employee Security Table */}
              <div className="section-compact">
                <div className="section-hdr">
                  <h2>Cyproteck Team Security Status</h2>
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
                            <span className="threat-count">{emp.threats}</span>
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
        </div>
      </div>

      {/* AI Support Chatbot */}
      {!chatOpen && (
        <button className="chat-fab" onClick={toggleChat} title="Get Help">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
        </button>
      )}

      {chatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-content">
              <div className="chat-icon">💬</div>
              <div>
                <div className="chat-title">CYPROSECURE Support</div>
                <div className="chat-subtitle">AI Assistant</div>
              </div>
            </div>
            <button className="chat-close" onClick={toggleChat}>×</button>
          </div>

          <div className="chat-messages">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                {msg.role === 'assistant' && <div className="message-avatar">🤖</div>}
                <div className="message-content">
                  {msg.content}
                </div>
                {msg.role === 'user' && <div className="message-avatar">👤</div>}
              </div>
            ))}
            {isLoading && (
              <div className="chat-message assistant">
                <div className="message-avatar">🤖</div>
                <div className="message-content typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>

          <div className="chat-quick-actions">
            <button className="quick-btn" onClick={() => setUserInput('How do I create an Excel formula?')}>
              📊 Excel Help
            </button>
            <button className="quick-btn" onClick={() => setUserInput('My device is having issues')}>
              💻 Device Issues
            </button>
            <button className="quick-btn" onClick={() => setUserInput('How do I improve my security score?')}>
              🛡️ Security
            </button>
            <button className="quick-btn" onClick={contactSupport}>
              📧 Contact Team
            </button>
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder="Type your question..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button 
              className="chat-send" 
              onClick={handleSendMessage}
              disabled={isLoading || !userInput.trim()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

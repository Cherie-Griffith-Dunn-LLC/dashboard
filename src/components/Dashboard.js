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
  
  // Check user roles from Azure AD
  const userRoles = user?.idTokenClaims?.roles || [];
  
  // Check user email
  const userEmail = user?.username || user?.idTokenClaims?.preferred_username || '';
  const isCyproteckEmail = userEmail.toLowerCase().includes('@cyproteck.com');
  
  // Map Azure AD roles to dashboard roles
  // Actual role values from Azure AD app registration:
  // - "Tenant" or "Cyprotenant" = MSSP Owner (Cyproteck admins)
  // - "BusinessOwner" = Business Owner (Client admins)
  // - "Cyproemployee" = Cyproteck Employee
  // - "Businessemployee" = Client Employee
  
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
  
  const hasCyproemployeeRole = userRoles.some(role => 
    role === 'Cyproemployee' ||
    role.toLowerCase() === 'cyproemployee'
  );
  
  const hasBusinessemployeeRole = userRoles.some(role => 
    role === 'Businessemployee' ||
    role.toLowerCase() === 'businessemployee'
  );
  
  // Determine user type based on actual Azure AD roles
  // MSSP Owner = Cyproteck tenant + (Tenant role OR @cyproteck.com email)
  // Business Owner = Other tenant + BusinessOwner role
  // Employee = Everyone else
  const isMSSPOwner = (tenantId === CYPROTECK_TENANT_ID && (hasTenantRole || isCyproteckEmail));
  const isBusinessOwner = (tenantId !== CYPROTECK_TENANT_ID && hasBusinessOwnerRole);
  const isEmployee = !isMSSPOwner && !isBusinessOwner;
  
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
            <p><strong>Your Email:</strong> {userEmail}</p>
            <p><strong>Cyproteck Email:</strong> {isCyproteckEmail ? '✅ YES' : '❌ NO'}</p>
            <p><strong>Your Roles:</strong> {userRoles.length > 0 ? userRoles.join(', ') : 'No roles assigned'}</p>
            <p><strong>Has Tenant Role:</strong> {hasTenantRole ? '✅ YES' : '❌ NO'}</p>
            <p><strong>Has BusinessOwner Role:</strong> {hasBusinessOwnerRole ? '✅ YES' : '❌ NO'}</p>
            <p><strong>Detected As:</strong> {isMSSPOwner ? '🏢 MSSP Owner' : isBusinessOwner ? '👔 Business Owner' : '👤 Employee'}</p>
          </div>

          {/* Universal Welcome - Shows for Everyone */}
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
                      style={{ strokeDasharray: `${(isMSSPOwner ? securityData.securityScore : currentUserData.riskScore) * 3.14} 314` }}
                    />
                  </svg>
                  <div className="score-num-large">{isMSSPOwner ? securityData.securityScore : currentUserData.riskScore}</div>
                </div>
                <div className="score-label-side">
                  <div className="score-title">Security Score</div>
                  <div className={`score-status ${isMSSPOwner ? 'good' : getRiskColor(currentUserData.riskScore)}`}>
                    {isMSSPOwner ? 'Excellent' : currentUserData.riskScore >= 70 ? 'Needs Improvement' : currentUserData.riskScore >= 50 ? 'Good' : 'Excellent'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MSSP Owner Content - Metrics and Heat Map */}
          {isMSSPOwner && (
            <>
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
                      {/* Realistic Flat World Map - Better Continent Shapes */}
                      
                      {/* North America - More realistic shape */}
                      <path d="M 80,80 L 90,70 L 105,65 L 120,62 L 140,60 L 160,60 L 175,62 L 190,65 L 205,70 L 220,78 L 235,88 L 245,100 L 252,115 L 255,130 L 255,145 L 252,160 L 245,175 L 235,188 L 222,198 L 205,205 L 188,208 L 170,208 L 155,205 L 142,198 L 132,188 L 125,175 L 120,160 L 118,145 L 118,130 L 120,115 L 125,100 L 132,88 Z M 190,75 L 200,70 L 212,68 L 225,68 L 238,70 L 248,75 L 255,82 L 258,92 L 258,102 L 255,112 L 248,120 L 238,125 L 225,127 L 212,127 L 200,125 L 192,120 L 188,112 L 185,102 L 185,92 L 188,82 Z" 
                            fill="#2c3e50" opacity="0.8" stroke="#5de4c7" strokeWidth="1.5"/>
                      
                      {/* Central America connection */}
                      <path d="M 205,205 L 212,215 L 218,225 L 222,235 L 224,245 L 224,255 L 222,260 L 218,265 L 212,268 L 205,270 L 198,268 L 192,265 L 188,260 L 185,255 L 185,245 L 188,235 L 192,225 L 198,215 Z"
                            fill="#2c3e50" opacity="0.8" stroke="#5de4c7" strokeWidth="1.5"/>
                      
                      {/* South America - Better shape */}
                      <path d="M 218,270 L 228,275 L 238,282 L 245,292 L 250,305 L 253,320 L 254,335 L 253,350 L 250,365 L 245,378 L 238,388 L 228,395 L 215,400 L 200,402 L 185,400 L 172,395 L 162,388 L 155,378 L 150,365 L 147,350 L 146,335 L 147,320 L 150,305 L 155,292 L 162,282 L 172,275 L 185,270 Z M 165,295 L 158,300 L 154,308 L 152,318 L 152,328 L 154,338 L 158,346 L 165,352 L 175,355 L 185,355 L 195,352 L 202,346 L 206,338 L 208,328 L 208,318 L 206,308 L 202,300 L 195,295 L 185,292 L 175,292 Z"
                            fill="#2c3e50" opacity="0.8" stroke="#5de4c7" strokeWidth="1.5"/>
                      
                      {/* Europe - More detailed */}
                      <path d="M 460,110 L 470,105 L 482,102 L 495,100 L 508,100 L 520,102 L 530,105 L 538,110 L 544,118 L 548,128 L 548,138 L 544,148 L 538,156 L 530,162 L 520,166 L 508,168 L 495,168 L 482,166 L 470,162 L 462,156 L 456,148 L 452,138 L 452,128 L 456,118 Z M 485,115 L 478,118 L 474,123 L 472,130 L 472,137 L 474,144 L 478,149 L 485,152 L 495,154 L 505,152 L 512,149 L 516,144 L 518,137 L 518,130 L 516,123 L 512,118 L 505,115 Z"
                            fill="#2c3e50" opacity="0.8" stroke="#5de4c7" strokeWidth="1.5"/>
                      
                      {/* Scandinavia */}
                      <path d="M 490,60 L 498,55 L 508,52 L 518,52 L 526,55 L 532,60 L 536,68 L 536,78 L 532,86 L 526,92 L 518,96 L 508,98 L 498,96 L 492,92 L 488,86 L 486,78 L 486,68 Z"
                            fill="#2c3e50" opacity="0.8" stroke="#5de4c7" strokeWidth="1.5"/>
                      
                      {/* Africa - Recognizable shape */}
                      <path d="M 475,172 L 488,170 L 502,170 L 515,172 L 527,176 L 538,182 L 547,190 L 554,200 L 559,212 L 562,226 L 564,242 L 564,258 L 562,274 L 559,288 L 554,300 L 547,310 L 538,318 L 527,324 L 515,328 L 502,330 L 488,330 L 475,328 L 463,324 L 453,318 L 445,310 L 439,300 L 434,288 L 431,274 L 429,258 L 429,242 L 431,226 L 434,212 L 439,200 L 445,190 L 453,182 L 463,176 Z M 470,200 L 465,205 L 462,212 L 460,222 L 460,234 L 460,246 L 462,256 L 465,264 L 470,272 L 477,278 L 486,282 L 496,284 L 507,282 L 516,278 L 523,272 L 528,264 L 531,256 L 533,246 L 533,234 L 533,222 L 531,212 L 528,205 L 523,200 L 516,196 L 507,194 L 496,194 L 486,196 L 477,200 Z"
                            fill="#2c3e50" opacity="0.8" stroke="#5de4c7" strokeWidth="1.5"/>
                      
                      {/* Asia - Large detailed continent */}
                      <path d="M 545,65 L 560,62 L 578,60 L 598,60 L 618,62 L 638,66 L 656,72 L 672,80 L 686,90 L 698,102 L 708,116 L 716,132 L 722,148 L 726,164 L 728,180 L 728,196 L 726,210 L 722,222 L 716,232 L 708,240 L 698,246 L 686,250 L 672,252 L 656,252 L 638,250 L 618,246 L 598,240 L 578,232 L 560,222 L 545,210 L 534,196 L 526,180 L 521,164 L 518,148 L 517,132 L 518,116 L 521,102 L 526,90 L 534,80 Z M 595,90 L 585,92 L 577,96 L 571,102 L 567,110 L 565,120 L 565,132 L 567,144 L 571,154 L 577,162 L 585,168 L 595,172 L 607,174 L 619,172 L 629,168 L 637,162 L 643,154 L 647,144 L 649,132 L 649,120 L 647,110 L 643,102 L 637,96 L 629,92 L 619,90 L 607,88 Z M 685,100 L 695,98 L 705,98 L 713,100 L 719,104 L 723,110 L 725,118 L 725,128 L 723,136 L 719,142 L 713,146 L 705,148 L 695,148 L 687,146 L 681,142 L 677,136 L 675,128 L 675,118 L 677,110 L 681,104 Z"
                            fill="#2c3e50" opacity="0.8" stroke="#5de4c7" strokeWidth="1.5"/>
                      
                      {/* Southeast Asia */}
                      <path d="M 720,240 L 728,242 L 736,246 L 742,252 L 746,260 L 748,270 L 748,280 L 746,288 L 742,294 L 736,298 L 728,300 L 720,300 L 712,298 L 706,294 L 702,288 L 700,280 L 700,270 L 702,260 L 706,252 L 712,246 Z"
                            fill="#2c3e50" opacity="0.8" stroke="#5de4c7" strokeWidth="1.5"/>
                      
                      {/* Australia - Recognizable oval */}
                      <path d="M 720,315 L 735,312 L 750,310 L 765,310 L 780,312 L 793,316 L 804,322 L 812,330 L 818,340 L 822,352 L 824,365 L 824,378 L 822,390 L 818,400 L 812,408 L 804,414 L 793,418 L 780,420 L 765,420 L 750,418 L 735,414 L 723,408 L 713,400 L 706,390 L 702,378 L 700,365 L 700,352 L 702,340 L 706,330 L 713,322 Z M 750,335 L 742,338 L 736,343 L 732,350 L 730,360 L 730,372 L 732,382 L 736,389 L 742,394 L 750,397 L 760,399 L 772,397 L 780,394 L 786,389 L 790,382 L 792,372 L 792,360 L 790,350 L 786,343 L 780,338 L 772,335 L 760,333 Z"
                            fill="#2c3e50" opacity="0.8" stroke="#5de4c7" strokeWidth="1.5"/>
                      
                      {/* New Zealand */}
                      <path d="M 850,385 L 858,383 L 865,385 L 870,390 L 873,398 L 873,408 L 870,416 L 865,421 L 858,423 L 850,423 L 843,421 L 838,416 L 835,408 L 835,398 L 838,390 L 843,385 Z"
                            fill="#2c3e50" opacity="0.7" stroke="#5de4c7" strokeWidth="1"/>
                      
                      {/* Greenland */}
                      <path d="M 310,35 L 325,32 L 342,30 L 358,30 L 373,32 L 385,36 L 394,42 L 400,50 L 404,60 L 405,72 L 404,84 L 400,94 L 394,102 L 385,108 L 373,112 L 358,114 L 342,114 L 325,112 L 312,108 L 302,102 L 295,94 L 290,84 L 288,72 L 290,60 L 295,50 L 302,42 Z"
                            fill="#2c3e50" opacity="0.6" stroke="#5de4c7" strokeWidth="1.5"/>
                      
                      {/* Grid lines - latitude/longitude */}
                      <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(93, 228, 199, 0.2)" strokeWidth="1" strokeDasharray="10,5"/>
                      <line x1="0" y1="125" x2="1000" y2="125" stroke="rgba(93, 228, 199, 0.1)" strokeWidth="0.5" strokeDasharray="8,4"/>
                      <line x1="0" y1="375" x2="1000" y2="375" stroke="rgba(93, 228, 199, 0.1)" strokeWidth="0.5" strokeDasharray="8,4"/>
                      
                      <line x1="250" y1="0" x2="250" y2="500" stroke="rgba(93, 228, 199, 0.1)" strokeWidth="0.5" strokeDasharray="8,4"/>
                      <line x1="500" y1="0" x2="500" y2="500" stroke="rgba(93, 228, 199, 0.2)" strokeWidth="1" strokeDasharray="10,5"/>
                      <line x1="750" y1="0" x2="750" y2="500" stroke="rgba(93, 228, 199, 0.1)" strokeWidth="0.5" strokeDasharray="8,4"/>
                      
                      <text x="500" y="485" textAnchor="middle" fill="var(--accent-primary)" fontSize="13" opacity="0.6" fontWeight="700">
                        🌍 Global Threat Monitoring
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

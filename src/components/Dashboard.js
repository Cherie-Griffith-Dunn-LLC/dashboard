import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import './Dashboard.css';

function Dashboard() {
  const { instance, accounts } = useMsal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState('all');
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your CYPROSECURE 360 AI assistant. I can help you with:\n\n🔒 Security Questions\n💼 Microsoft 365 Issues\n🛠️ Tier 1 Help Desk Support\n🛡️ Defender & Sentinel Insights\n\nHow can I assist you today?"
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const user = accounts[0];
  const userName = user?.name || 'User';
  const tenantId = user?.tenantId || '';
  const companyName = user?.idTokenClaims?.company || user?.idTokenClaims?.organization || 'Your Company';
  
  // Tenant IDs
  const CYPROTECK_TENANT_ID = 'ff4945f1-e101-4ac8-a78f-798156ea9cdf';
  const CGD_LLC_TENANT_ID = '0d9acab6-2b9d-4883-8617-f3fdea4b02d6';
  
  // Tenant to Company Name Mapping
  const TENANT_COMPANY_NAMES = {
    [CYPROTECK_TENANT_ID]: 'Cyproteck Technologies Inc',
    [CGD_LLC_TENANT_ID]: 'CGD LLC',
  };
  
  const displayCompanyName = TENANT_COMPANY_NAMES[tenantId] || companyName || 'Your Company';
  
  const userRoles = user?.idTokenClaims?.roles || [];
  
  const hasTenantRole = userRoles.some(role => 
    role === 'Tenant' || role === 'Cyprotenant' || role === 'TenantOwner' ||
    role.toLowerCase() === 'tenant' || role.toLowerCase() === 'tenantowner'
  );
  
  const hasBusinessOwnerRole = userRoles.some(role => 
    role === 'BusinessOwner' || role === 'Businessowner' || role.toLowerCase() === 'businessowner'
  );
  
  const isMSPOwner = tenantId === CYPROTECK_TENANT_ID && hasTenantRole;
  const isBusinessOwner = tenantId !== CYPROTECK_TENANT_ID && hasBusinessOwnerRole;
  
  console.log('🔍 User Role Check:', {
    userName,
    userEmail: user?.username,
    tenantId: tenantId === CYPROTECK_TENANT_ID ? 'CYPROTECK' : tenantId === CGD_LLC_TENANT_ID ? 'CGD LLC' : 'OTHER',
    roles: userRoles,
    hasTenantRole,
    hasBusinessOwnerRole,
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

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newMessage = { role: 'user', content: userInput };
    setChatMessages(prev => [...prev, newMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const systemPrompt = `You are the CYPROSECURE 360 AI Assistant, an expert cybersecurity and IT support chatbot.

# YOUR EXPERTISE:
1. **Microsoft 365 Security** - Defender, Sentinel, Intune, Azure AD
2. **Tier 1 Help Desk** - Common IT issues, password resets, MFA, device setup
3. **Security Best Practices** - Phishing, malware, compliance, incident response
4. **Network Security** - Firewalls, VPNs, endpoint protection

# HELP DESK KNOWLEDGE BASE:

## Password & MFA Issues:
- **Password Reset**: Guide user to portal.office.com → Security Info → Change Password
- **MFA Setup**: Install Microsoft Authenticator app → portal.office.com → Security Info → Add method
- **MFA Not Working**: Try "I have a code instead" or contact admin for temporary bypass
- **Locked Account**: Wait 30 minutes for auto-unlock or contact admin immediately

## Microsoft 365 Common Issues:
- **Outlook Not Syncing**: Check internet → Sign out/in → File → Account Settings → Clear cache → Restart app
- **Teams Call Issues**: Check microphone permissions → Update Teams → Test in web version (teams.microsoft.com)
- **OneDrive Not Syncing**: Restart OneDrive → Check storage quota → Re-link account in settings
- **Can't Access SharePoint**: Check permissions with team owner → Clear browser cache → Try incognito mode

## Security Incidents:
- **Phishing Email**: DON'T click links → Report as phishing in Outlook → Delete immediately → Check recent account activity
- **Ransomware Suspected**: Disconnect from network IMMEDIATELY → Don't pay ransom → Contact IT urgently → Don't touch any files
- **Compromised Account**: Change password NOW → Enable MFA immediately → Review recent activity at portal.office.com/account
- **Malware Detected**: Don't ignore → Run full Microsoft Defender scan → Isolate device from network if spreading

## Device Issues:
- **Slow Computer**: Check if Defender scan is running → Close unused apps → Restart device → Check for Windows updates
- **Can't Connect to VPN**: Verify credentials → Update VPN client → Check internet connection → Try different network
- **Printer Not Working**: Check physical connection → Restart printer and computer → Update/reinstall drivers

# RESPONSE STYLE:
- Be concise and actionable (2-4 sentences)
- Use emojis sparingly (🔒 security, ✅ success, ⚠️ warning, 🛠️ technical)
- Provide step-by-step instructions when needed
- If issue requires escalation, say so clearly
- Always be professional and helpful
- Never make up information - if unsure, say "Contact your IT administrator for help with this specific issue"

Respond to this query: ${userInput}`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2048,
          system: systemPrompt,
          messages: [
            ...chatMessages.filter(m => m.role !== 'system'),
            newMessage
          ]
        })
      });

      const data = await response.json();
      
      if (data.content && data.content[0]) {
        const assistantMessage = {
          role: 'assistant',
          content: data.content[0].text
        };
        setChatMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Sorry, I encountered an error. Please try again or contact your IT administrator if the issue persists.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDashboard = () => (
    <>
      {/* MSSP OWNER VIEW - HAS DROPDOWN */}
      {isMSPOwner && (
        <>
          {/* Organization Dropdown - ONLY MSSP SEES THIS */}
          <div className="org-selector-top">
            <select value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)} className="org-dropdown">
              <option value="all">All Organizations</option>
              <option value="cgd">CGD LLC</option>
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

          {/* Employee List - ALL COMPANIES */}
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

          {/* Recent Threat Alerts */}
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

          {/* Quick Actions */}
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

      {/* BUSINESS OWNER VIEW - NO DROPDOWN, ONLY THEIR COMPANY */}
      {isBusinessOwner && (
        <>
          <div className="company-header">
            <div className="company-info-header">
              <h1>{userName}, welcome to {displayCompanyName}</h1>
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
              <div className="metric-value-business">156</div>
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

      {/* EMPLOYEE VIEW - NO DROPDOWN, PERSONAL ONLY */}
      {!isMSPOwner && !isBusinessOwner && (
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

  const renderTrainingPage = () => (
    <div className="page-content">
      <h1>🎓 Security Training</h1>
      <p className="page-subtitle">Complete required security awareness training</p>
      <div className="content-placeholder">
        <p>Training dashboard coming soon...</p>
      </div>
    </div>
  );

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

      {/* ENHANCED CHATBOT WITH SUGGESTED QUESTIONS */}
      <div className={`chatbot-widget ${chatOpen ? 'open' : ''}`}>
        {chatOpen ? (
          <div className="chatbot-container">
            <div className="chatbot-header">
              <div className="chatbot-title">
                <span className="bot-icon">🤖</span>
                <span>CYPROSECURE AI Assistant</span>
              </div>
              <button className="chatbot-close" onClick={() => setChatOpen(false)}>✕</button>
            </div>

            <div className="chatbot-messages">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.role}`}>
                  <div className="message-content">{msg.content}</div>
                </div>
              ))}
              {isLoading && (
                <div className="chat-message assistant">
                  <div className="message-content typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Questions - Show only at start */}
            {chatMessages.length <= 2 && (
              <div className="suggested-questions">
                <div className="suggestions-label">Quick Help:</div>
                <div className="suggestions-grid">
                  <button className="suggestion-btn" onClick={() => setUserInput("How do I reset my password?")}>
                    🔐 Reset Password
                  </button>
                  <button className="suggestion-btn" onClick={() => setUserInput("I received a suspicious email, what should I do?")}>
                    📧 Phishing Email
                  </button>
                  <button className="suggestion-btn" onClick={() => setUserInput("My Outlook isn't syncing, how do I fix it?")}>
                    💻 Outlook Issues
                  </button>
                  <button className="suggestion-btn" onClick={() => setUserInput("How do I enable MFA?")}>
                    🔒 Enable MFA
                  </button>
                  <button className="suggestion-btn" onClick={() => setUserInput("My computer is running slow")}>
                    🐌 Slow Computer
                  </button>
                  <button className="suggestion-btn" onClick={() => setUserInput("I think my account was compromised")}>
                    ⚠️ Account Compromised
                  </button>
                </div>
              </div>
            )}

            <form className="chatbot-input" onSubmit={handleChatSubmit}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || !userInput.trim()}>
                ➤
              </button>
            </form>
          </div>
        ) : (
          <button className="chatbot-toggle" onClick={() => setChatOpen(true)}>
            <span className="bot-icon-large">🤖</span>
            <span className="chat-label">Need Help?</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

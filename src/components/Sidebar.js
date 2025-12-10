import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

/**
 * Sidebar Navigation Component
 * Shows different navigation items based on user role
 */
function Sidebar({ collapsed, userRole, onToggle }) {
  
  // Navigation items based on user role
  const navigationItems = {
    cyproteck_admin: [
      { icon: '🏠', label: 'Dashboard', path: '/dashboard', badge: null },
      { icon: '👥', label: 'Customers', path: '/customers', badge: null },
      { icon: '📊', label: 'Analytics', path: '/analytics', badge: null },
      { icon: '🎓', label: 'Training', path: '/training', badge: null },
      { icon: '🔔', label: 'Alerts', path: '/alerts', badge: 12 },
      { icon: '⚙️', label: 'Settings', path: '/settings', badge: null },
    ],
    customer_admin: [
      { icon: '🏠', label: 'Dashboard', path: '/dashboard', badge: null },
      { icon: '👥', label: 'Users', path: '/users', badge: null },
      { icon: '🛡️', label: 'Security', path: '/security', badge: 5 },
      { icon: '📊', label: 'Reports', path: '/reports', badge: null },
      { icon: '🎓', label: 'Training', path: '/training', badge: null },
      { icon: '💼', label: 'Microsoft 365', path: '/m365', badge: null },
      { icon: '🔍', label: 'Vulnerability Scan', path: '/vulnerabilities', badge: null },
      { icon: '🆘', label: 'IT Helpdesk', path: '/helpdesk', badge: 2 },
      { icon: '⚙️', label: 'Settings', path: '/settings', badge: null },
    ],
    employee: [
      { icon: '🏠', label: 'My Dashboard', path: '/dashboard', badge: null },
      { icon: '🎯', label: 'My Security Score', path: '/my-score', badge: null },
      { icon: '🎓', label: 'My Training', path: '/my-training', badge: 1 },
      { icon: '🚨', label: 'My Alerts', path: '/my-alerts', badge: 3 },
      { icon: '🆘', label: 'Get Help', path: '/help', badge: null },
      { icon: '⚙️', label: 'My Profile', path: '/profile', badge: null },
    ],
  };

  const navItems = navigationItems[userRole] || navigationItems.employee;

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo Section */}
      <div className="sidebar-logo">
        <img 
          src="/logo.png" 
          alt="CYPROSECURE" 
          className="sidebar-logo-img"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        {!collapsed && (
          <div className="sidebar-logo-text">
            <h2>CYPROSECURE</h2>
            <p>Security Dashboard</p>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            title={collapsed ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && (
              <>
                <span className="nav-label">{item.label}</span>
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Role Badge */}
      {!collapsed && (
        <div className="sidebar-role-badge">
          <div className="role-badge-content">
            <span className="role-icon">
              {userRole === 'cyproteck_admin' && '👑'}
              {userRole === 'customer_admin' && '👔'}
              {userRole === 'employee' && '👤'}
            </span>
            <div className="role-text">
              <div className="role-label">Role</div>
              <div className="role-name">
                {userRole === 'cyproteck_admin' && 'Cyproteck Admin'}
                {userRole === 'customer_admin' && 'Customer Admin'}
                {userRole === 'employee' && 'Employee'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <button 
        className="sidebar-collapse-btn" 
        onClick={onToggle}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          {collapsed ? (
            <path d="M7 10l5 5V5l-5 5z"/>
          ) : (
            <path d="M13 10l-5 5V5l5 5z"/>
          )}
        </svg>
      </button>
    </aside>
  );
}

export default Sidebar;

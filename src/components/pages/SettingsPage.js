import React from 'react';

function SettingsPage({ userRole }) {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>⚙️ Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="settings-sections">
        <div className="settings-section">
          <h2>Profile Settings</h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Email Notifications</h3>
              <p>Receive alerts and updates via email</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Two-Factor Authentication</h3>
              <p>Add an extra layer of security</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>Security Settings</h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Change Password</h3>
              <p>Update your account password</p>
            </div>
            <button className="setting-btn">Change</button>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Active Sessions</h3>
              <p>Manage devices logged into your account</p>
            </div>
            <button className="setting-btn">View</button>
          </div>
        </div>

        <div className="settings-section">
          <h2>Preferences</h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Language</h3>
              <p>Choose your preferred language</p>
            </div>
            <select className="setting-select">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Time Zone</h3>
              <p>Set your local time zone</p>
            </div>
            <select className="setting-select">
              <option>Eastern Time (ET)</option>
              <option>Pacific Time (PT)</option>
              <option>Central Time (CT)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;

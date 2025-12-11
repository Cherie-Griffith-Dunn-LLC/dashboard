import React from 'react';

function UsersPage() {
  const users = [
    { id: 1, name: 'John Smith', email: 'john.smith@company.com', role: 'Employee', status: 'active', score: 88 },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.j@company.com', role: 'Employee', status: 'active', score: 92 },
    { id: 3, name: 'Michael Chen', email: 'm.chen@company.com', role: 'Manager', status: 'active', score: 95 },
    { id: 4, name: 'Emily Davis', email: 'emily.d@company.com', role: 'Employee', status: 'inactive', score: 78 },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>👥 User Management</h1>
        <p>Manage users in your organization</p>
      </div>

      <div className="users-actions">
        <button className="action-btn primary">➕ Add User</button>
        <button className="action-btn secondary">📤 Export List</button>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Security Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td><strong>{user.name}</strong></td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td><span className={`status-badge ${user.status}`}>{user.status}</span></td>
                <td><span className="score-badge">{user.score}</span></td>
                <td>
                  <button className="table-action">Edit</button>
                  <button className="table-action">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersPage;

import React from 'react';

function CustomersPage() {
  const customers = [
    { id: 1, name: 'Acme Healthcare', users: 450, status: 'active', alerts: 12, score: 92 },
    { id: 2, name: 'Tech Solutions Inc', users: 280, status: 'active', alerts: 5, score: 88 },
    { id: 3, name: 'Finance Group LLC', users: 620, status: 'active', alerts: 8, score: 95 },
    { id: 4, name: 'Education Systems', users: 150, status: 'trial', alerts: 3, score: 85 },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🏢 Customers</h1>
        <p>Manage customer organizations</p>
      </div>

      <div className="customers-stats">
        <div className="stat-card">
          <div className="stat-value">{customers.length}</div>
          <div className="stat-label">Total Customers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{customers.reduce((sum, c) => sum + c.users, 0)}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{customers.reduce((sum, c) => sum + c.alerts, 0)}</div>
          <div className="stat-label">Active Alerts</div>
        </div>
      </div>

      <div className="customers-table">
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Users</th>
              <th>Status</th>
              <th>Alerts</th>
              <th>Security Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td><strong>{customer.name}</strong></td>
                <td>{customer.users}</td>
                <td><span className={`status-badge ${customer.status}`}>{customer.status}</span></td>
                <td><span className="alert-count">{customer.alerts}</span></td>
                <td><span className="score-badge">{customer.score}</span></td>
                <td>
                  <button className="table-action">View</button>
                  <button className="table-action">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomersPage;

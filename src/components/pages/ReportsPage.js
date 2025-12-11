import React from 'react';

function ReportsPage({ userRole }) {
  const reports = [
    { id: 1, title: 'Monthly Security Report', date: '2024-12-01', type: 'PDF', size: '2.4 MB' },
    { id: 2, title: 'Threat Analysis Summary', date: '2024-11-30', type: 'PDF', size: '1.8 MB' },
    { id: 3, title: 'Training Completion Report', date: '2024-11-28', type: 'Excel', size: '856 KB' },
    { id: 4, title: 'Incident Response Log', date: '2024-11-25', type: 'PDF', size: '3.2 MB' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📄 Reports</h1>
        <p>Access your security reports and analytics</p>
      </div>

      <div className="reports-actions">
        <button className="action-btn primary">📊 Generate New Report</button>
        <button className="action-btn secondary">📅 Schedule Report</button>
      </div>

      <div className="reports-grid">
        {reports.map(report => (
          <div key={report.id} className="report-card">
            <div className="report-icon">📑</div>
            <div className="report-info">
              <h3>{report.title}</h3>
              <div className="report-meta">
                <span>{report.date}</span>
                <span>•</span>
                <span>{report.type}</span>
                <span>•</span>
                <span>{report.size}</span>
              </div>
            </div>
            <div className="report-actions">
              <button className="icon-btn" title="Download">⬇️</button>
              <button className="icon-btn" title="Share">📤</button>
              <button className="icon-btn" title="View">👁️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReportsPage;

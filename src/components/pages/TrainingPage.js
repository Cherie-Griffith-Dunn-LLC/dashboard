import React from 'react';

function TrainingPage({ userRole }) {
  const courses = [
    { id: 1, title: 'Password Security Best Practices', progress: 60, duration: '15 min', dueIn: 'Completed' },
    { id: 2, title: 'Phishing Awareness', progress: 0, duration: '20 min', dueIn: '3 days', isNew: true },
    { id: 3, title: 'Data Protection & Privacy', progress: 0, duration: '25 min', dueIn: '5 days', isNew: true },
    { id: 4, title: 'Secure Remote Work', progress: 100, duration: '18 min', dueIn: 'Completed' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🎓 Training Center</h1>
        <p>Enhance your security awareness</p>
      </div>

      <div className="training-stats">
        <div className="stat-card">
          <div className="stat-value">75%</div>
          <div className="stat-label">Overall Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">2/4</div>
          <div className="stat-label">Courses Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">2</div>
          <div className="stat-label">Pending Courses</div>
        </div>
      </div>

      <div className="courses-grid">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            {course.isNew && <span className="new-badge">NEW</span>}
            <div className="course-icon">📚</div>
            <h3>{course.title}</h3>
            <div className="course-meta">
              <span>⏱️ {course.duration}</span>
              <span>🎯 Due: {course.dueIn}</span>
            </div>
            {course.progress > 0 && course.progress < 100 && (
              <div className="course-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: `${course.progress}%`}}></div>
                </div>
                <span className="progress-text">{course.progress}% Complete</span>
              </div>
            )}
            <button className={`course-btn ${course.progress === 0 ? 'primary' : course.progress === 100 ? 'completed' : ''}`}>
              {course.progress === 0 ? 'Start Course' : course.progress === 100 ? 'Review' : 'Continue'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrainingPage;

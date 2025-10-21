// ChartsComponent.jsx
import React from 'react';

// Define three colors that will be used throughout the app
const APP_COLORS = {
  primary: '#3498db',    // Blue
  secondary: '#2ecc71',  // Green
  accent: '#e74c3c'      // Red
};

const ChartsComponent = ({ reports, courses, user }) => {
  // Calculate metrics
  const totalReports = reports.length;
  const totalRatings = reports.reduce((sum, report) => sum + (report.total_ratings || 0), 0);
  const averageRating = reports.length > 0 
    ? (reports.reduce((sum, report) => sum + (report.average_rating || 0), 0) / reports.length).toFixed(1)
    : 0;
  
  const reportsWithFeedback = reports.filter(report => report.has_feedback).length;
  const totalCourses = courses.length;
  
  // Reports by faculty
  const facultyReports = reports.reduce((acc, report) => {
    const faculty = report.faculty_name || 'Unknown';
    acc[faculty] = (acc[faculty] || 0) + 1;
    return acc;
  }, {});

  // Calculate percentages for bar charts
  const maxFacultyReports = Math.max(...Object.values(facultyReports), 1);
  
  // Rating distribution
  const ratingCounts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
  reports.forEach(report => {
    if (report.average_rating) {
      const rating = Math.round(report.average_rating);
      if (rating >= 1 && rating <= 5) {
        ratingCounts[rating]++;
      }
    }
  });

  // Function to get color based on index (cycle through 3 colors)
  const getColorByIndex = (index) => {
    const colorKeys = Object.keys(APP_COLORS);
    return APP_COLORS[colorKeys[index % colorKeys.length]];
  };

  return (
    <div className="row mt-4">
      {/* Quick Stats Cards */}
      <div className="col-12 mb-4">
        <h5 className="mb-3">System Overview</h5>
        <div className="row">
          <div className="col-md-3 mb-3">
            <div className="card text-white" style={{ backgroundColor: APP_COLORS.primary }}>
              <div className="card-body text-center">
                <h4>{totalReports}</h4>
                <p className="mb-0">Total Reports</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-white" style={{ backgroundColor: APP_COLORS.secondary }}>
              <div className="card-body text-center">
                <h4>{totalRatings}</h4>
                <p className="mb-0">Total Ratings</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-white" style={{ backgroundColor: APP_COLORS.accent }}>
              <div className="card-body text-center">
                <h4>{averageRating}/5</h4>
                <p className="mb-0">Average Rating</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-white" style={{ backgroundColor: APP_COLORS.primary }}>
              <div className="card-body text-center">
                <h4>{totalCourses}</h4>
                <p className="mb-0">Total Courses</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reports by Faculty - Bar Chart */}
      <div className="col-md-6 mb-4">
        <div className="card shadow-sm">
          <div className="card-header text-white" style={{ backgroundColor: APP_COLORS.primary }}>
            <h6 className="mb-0">Reports by Faculty</h6>
          </div>
          <div className="card-body">
            {Object.entries(facultyReports).map(([faculty, count], index) => (
              <div key={faculty} className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small">{faculty}</span>
                  <span className="small">{count} reports</span>
                </div>
                <div className="progress" style={{ height: '20px' }}>
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${(count / maxFacultyReports) * 100}%`,
                      backgroundColor: getColorByIndex(index)
                    }}
                  >
                    {count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="col-md-6 mb-4">
        <div className="card shadow-sm">
          <div className="card-header text-white" style={{ backgroundColor: APP_COLORS.secondary }}>
            <h6 className="mb-0">Rating Distribution</h6>
          </div>
          <div className="card-body">
            {[5, 4, 3, 2, 1].map((stars, index) => (
              <div key={stars} className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small">
                    {stars} {stars === 1 ? 'star' : 'stars'}
                  </span>
                  <span className="small">{ratingCounts[stars]} reports</span>
                </div>
                <div className="progress" style={{ height: '20px' }}>
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${totalReports > 0 ? (ratingCounts[stars] / totalReports) * 100 : 0}%`,
                      backgroundColor: getColorByIndex(index)
                    }}
                  >
                    {ratingCounts[stars]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Status */}
      <div className="col-md-6 mb-4">
        <div className="card shadow-sm">
          <div className="card-header text-white" style={{ backgroundColor: APP_COLORS.accent }}>
            <h6 className="mb-0">Feedback Status</h6>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span className="small">Reports with Feedback</span>
                <span className="small">{reportsWithFeedback} of {totalReports}</span>
              </div>
              <div className="progress" style={{ height: '25px' }}>
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${totalReports > 0 ? (reportsWithFeedback / totalReports) * 100 : 0}%`,
                    backgroundColor: APP_COLORS.secondary
                  }}
                >
                  {totalReports > 0 ? ((reportsWithFeedback / totalReports) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="d-flex justify-content-between mb-1">
                <span className="small">Reports without Feedback</span>
                <span className="small">{totalReports - reportsWithFeedback} of {totalReports}</span>
              </div>
              <div className="progress" style={{ height: '25px' }}>
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${totalReports > 0 ? ((totalReports - reportsWithFeedback) / totalReports) * 100 : 0}%`,
                    backgroundColor: APP_COLORS.accent
                  }}
                >
                  {totalReports > 0 ? (((totalReports - reportsWithFeedback) / totalReports) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Courses */}
      <div className="col-md-6 mb-4">
        <div className="card shadow-sm">
          <div className="card-header text-white" style={{ backgroundColor: APP_COLORS.primary }}>
            <h6 className="mb-0">Top Courses</h6>
          </div>
          <div className="card-body">
            {Object.entries(
              reports.reduce((acc, report) => {
                const course = report.course_name || 'Unknown';
                acc[course] = (acc[course] || 0) + 1;
                return acc;
              }, {})
            )
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([course, count], index) => (
                <div key={course} className="mb-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="small text-truncate" style={{ maxWidth: '60%' }}>
                      {course}
                    </span>
                    <div className="d-flex align-items-center">
                      <span 
                        className="badge text-white me-2" 
                        style={{ backgroundColor: getColorByIndex(index) }}
                      >
                        {count}
                      </span>
                      <small className="text-muted">
                        {totalReports > 0 ? ((count / totalReports) * 100).toFixed(1) : 0}%
                      </small>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="col-12">
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="card text-white" style={{ backgroundColor: APP_COLORS.primary }}>
              <div className="card-body text-center">
                <h5>{reports.filter(r => r.actual_students_present > 0).length}</h5>
                <p className="mb-0">Active Classes</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card text-white" style={{ backgroundColor: APP_COLORS.secondary }}>
              <div className="card-body text-center">
                <h5>
                  {reports.length > 0 
                    ? (reports.reduce((sum, r) => sum + (r.actual_students_present || 0), 0) / reports.length).toFixed(0)
                    : 0
                  }
                </h5>
                <p className="mb-0">Avg Attendance</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card text-white" style={{ backgroundColor: APP_COLORS.accent }}>
              <div className="card-body text-center">
                <h5>
                  {new Set(reports.map(r => r.lecturer_name)).size}
                </h5>
                <p className="mb-0">Active Lecturers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsComponent;
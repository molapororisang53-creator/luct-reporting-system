
import React from 'react';

const ReportsList = ({ reports, searchTerm, setSearchTerm, viewReportDetails, setPage, user, fetchReports }) => {
  const canGiveFeedback = user?.role === 'prl';
  const canRate = user?.role === 'student';
  const canDelete = user?.role === 'pl' || user?.role === 'prl';

  const handleDeleteReport = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:8081/reports/${reportId}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.error) {
          alert('Delete failed: ' + data.error);
        } else {
          alert('Report deleted successfully!');
          // Refresh the reports list
          if (fetchReports) {
            fetchReports();
          }
        }
      } catch (error) {
        alert('Delete failed: ' + error.message);
      }
    }
  };

  const handleViewRatings = async (reportId) => {
    try {
      const response = await fetch(`http://localhost:8081/ratings/report/${reportId}`);
      const data = await response.json();
      
      if (data.error) {
        alert('Error fetching ratings: ' + data.error);
      } else {
        const ratingsText = data.length > 0 
          ? data.map(rating => `${rating.user_name}: ${rating.rating_value} stars - ${rating.comments || 'No comments'}`).join('\n')
          : 'No ratings yet';
        alert(`Ratings for this report:\n\n${ratingsText}`);
      }
    } catch (error) {
      alert('Error fetching ratings: ' + error.message);
    }
  };

  // Filter reports based on search term
  const filteredReports = reports.filter(report =>
    report.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.lecturer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.class_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.topic_taught?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Reports</h3>
        <div>
          {canGiveFeedback && (
            <button className="btn btn-info me-2" onClick={() => setPage('feedback')}>
              Provide Feedback
            </button>
          )}
          {canRate && (
            <button className="btn btn-success me-2" onClick={() => setPage('rating')}>
              Rate Reports
            </button>
          )}
          <button className="btn btn-primary" onClick={() => setPage('reporting')}>
            Create New Report
          </button>
        </div>
      </div>
      
      <div className="mb-3">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Search reports by course, lecturer, class, or topic..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <small className="text-muted">
          Showing {filteredReports.length} of {reports.length} reports
        </small>
      </div>
      
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Course</th>
              <th>Class</th>
              <th>Date</th>
              <th>Lecturer</th>
              <th>Students</th>
              <th>Rating</th>
              <th>Feedback</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-muted py-4">
                  {reports.length === 0 ? 'No reports available' : 'No reports match your search'}
                </td>
              </tr>
            ) : (
              filteredReports.map(report => (
                <tr key={report.id}>
                  <td>{report.course_name} ({report.course_code})</td>
                  <td>{report.class_name}</td>
                  <td>{report.date_of_lecture ? new Date(report.date_of_lecture).toLocaleDateString() : 'N/A'}</td>
                  <td>{report.lecturer_name}</td>
                  <td>{report.actual_students_present}/{report.total_registered_students}</td>
                  <td>
                    {report.average_rating > 0 ? (
                      <span 
                        className="badge bg-success"
                        style={{cursor: 'pointer'}}
                        onClick={() => handleViewRatings(report.id)}
                        title="Click to view all ratings"
                      >
                        {report.average_rating}/5 ({report.total_ratings || 0})
                      </span>
                    ) : (
                      <span className="text-muted">Not rated</span>
                    )}
                  </td>
                  <td>
                    {report.has_feedback ? (
                      <span className="badge bg-info">Feedback Given</span>
                    ) : (
                      <span className="text-muted">No feedback</span>
                    )}
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-info me-1"
                      onClick={() => viewReportDetails(report.id)}
                      title="View report details"
                    >
                      View
                    </button>
                    {canGiveFeedback && !report.has_feedback && (
                      <button 
                        className="btn btn-sm btn-warning me-1"
                        onClick={() => {
                          // You might want to pre-select this report in the feedback form
                          setPage('feedback');
                        }}
                        title="Provide feedback"
                      >
                        Feedback
                      </button>
                    )}
                    {canRate && (
                      <button 
                        className="btn btn-sm btn-success me-1"
                        onClick={() => setPage('rating')}
                        title="Rate this report"
                      >
                        Rate
                      </button>
                    )}
                    {canDelete && (
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteReport(report.id)}
                        title="Delete this report"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsList;
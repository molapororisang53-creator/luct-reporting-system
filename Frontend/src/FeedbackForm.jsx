
import React from 'react';

const FeedbackForm = ({ feedbackForm, handleFeedbackChange, handleFeedbackSubmit, setPage, reports, user }) => {
  // Only PRLs can give feedback
  if (user?.role !== 'prl') {
    return (
      <div className="card p-4">
        <div className="alert alert-warning">
          <h4>Access Denied</h4>
          <p>Only Principal Lecturers (PRLs) can provide feedback on reports.</p>
          <button className="btn btn-primary" onClick={() => setPage('reports')}>
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-4">
      <h3>Provide Feedback on Report</h3>
      <p className="text-muted">As a Principal Lecturer, you can provide feedback on lecture reports.</p>
      
      <form onSubmit={handleFeedbackSubmit}>
        <div className="mb-3">
          <label className="form-label">Select Report *</label>
          <select 
            className="form-select" 
            name="report_id"
            value={feedbackForm.report_id}
            onChange={handleFeedbackChange}
            required
          >
            <option value="">Choose a report to provide feedback...</option>
            {reports.map(report => (
              <option key={report.id} value={report.id}>
                {report.course_name} by {report.lecturer_name} ({new Date(report.date_of_lecture).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Feedback *</label>
          <textarea 
            className="form-control" 
            name="feedback_text"
            value={feedbackForm.feedback_text}
            onChange={handleFeedbackChange}
            rows="5"
            placeholder="Provide constructive feedback for the lecturer..."
            required 
          />
        </div>
        
        <input type="hidden" name="prl_id" value={user?.id} />
        
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">Submit Feedback</button>
          <button type="button" className="btn btn-secondary" onClick={() => setPage('reports')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
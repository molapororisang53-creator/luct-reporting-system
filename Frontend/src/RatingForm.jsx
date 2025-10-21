
import React from 'react';

const RatingForm = ({ ratingForm, handleRatingChange, handleRatingSubmit, setPage, reports, user }) => {
  // Only students can rate
  if (user?.role !== 'student') {
    return (
      <div className="card p-4">
        <div className="alert alert-warning">
          <h4>Access Denied</h4>
          <p>Only students can rate reports.</p>
          <button className="btn btn-primary" onClick={() => setPage('reports')}>
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-4">
      <h3>Rate a Lecture Report</h3>
      <p className="text-muted">As a student, you can rate lecture reports.</p>
      
      <form onSubmit={handleRatingSubmit}>
        <div className="mb-3">
          <label className="form-label">Select Report to Rate *</label>
          <select 
            className="form-select" 
            name="report_id"
            value={ratingForm.report_id}
            onChange={handleRatingChange}
            required
          >
            <option value="">Choose a lecture report...</option>
            {reports.map(report => (
              <option key={report.id} value={report.id}>
                {report.course_name} by {report.lecturer_name} ({new Date(report.date_of_lecture).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Your Rating *</label>
          <div className="d-flex align-items-center gap-3">
            {[1, 2, 3, 4, 5].map(star => (
              <div key={star} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="rating_value"
                  id={`star-${star}`}
                  value={star}
                  checked={ratingForm.rating_value === star.toString()}
                  onChange={handleRatingChange}
                  required
                />
                <label className="form-check-label" htmlFor={`star-${star}`}>
                  {star} {star === 1 ? 'star' : 'stars'}
                </label>
              </div>
            ))}
          </div>
          <small className="text-muted">1 = Poor, 5 = Excellent</small>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Comments (Optional)</label>
          <textarea 
            className="form-control" 
            name="comments"
            value={ratingForm.comments}
            onChange={handleRatingChange}
            rows="3"
            placeholder="Any additional comments..."
          />
        </div>
        
        <input type="hidden" name="user_id" value={user?.id} />
        
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">Submit Rating</button>
          <button type="button" className="btn btn-secondary" onClick={() => setPage('reports')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RatingForm;
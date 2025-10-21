
import React from 'react';

const ReportForm = ({ reportForm, handleReportChange, handleReportSubmit, user, classes, faculties }) => {
  return (
    <div className="card p-4">
      <h3>Lecturer Reporting Form</h3>
      {user && <p className="text-muted">Logged in as: <strong>{user.name}</strong> ({user.role})</p>}
      
      <form onSubmit={handleReportSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Faculty Name *</label>
              <select
                className="form-control"
                name="faculty_name"
                value={reportForm.faculty_name}
                onChange={handleReportChange}
                required
              >
                <option value="">Select a faculty</option>
                {(faculties || []).map(fac => (
                  <option key={fac.faculty_id} value={fac.faculty_name}>
                    {fac.faculty_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Class Name *</label>
              <select
                className="form-control"
                name="class_name"
                value={reportForm.class_name}
                onChange={handleReportChange}
                required
              >
                <option value="">Select a class</option>
                {(classes || []).map(cls => (
                  <option key={cls.id} value={cls.class_name}>
                    {cls.class_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Week of Reporting *</label>
              <input 
                type="text" 
                className="form-control" 
                name="week_of_reporting"
                value={reportForm.week_of_reporting}
                onChange={handleReportChange}
                placeholder="e.g., Week 5"
                required 
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Date of Lecture *</label>
              <input 
                type="date" 
                className="form-control" 
                name="date_of_lecture"
                value={reportForm.date_of_lecture}
                onChange={handleReportChange}
                required 
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Course Name *</label>
              <input 
                type="text" 
                className="form-control" 
                name="course_name"
                value={reportForm.course_name}
                onChange={handleReportChange}
                required 
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Course Code *</label>
              <input 
                type="text" 
                className="form-control" 
                name="course_code"
                value={reportForm.course_code}
                onChange={handleReportChange}
                required 
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Lecturer's Name *</label>
              <input 
                type="text" 
                className="form-control" 
                name="lecturer_name"
                value={reportForm.lecturer_name}
                onChange={handleReportChange}
                required 
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Actual Students Present *</label>
              <input 
                type="number" 
                className="form-control" 
                name="actual_students_present"
                value={reportForm.actual_students_present}
                onChange={handleReportChange}
                min="0"
                required 
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Total Registered Students *</label>
              <input 
                type="number" 
                className="form-control" 
                name="total_registered_students"
                value={reportForm.total_registered_students}
                onChange={handleReportChange}
                min="0"
                required 
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Venue *</label>
              <input 
                type="text" 
                className="form-control" 
                name="venue"
                value={reportForm.venue}
                onChange={handleReportChange}
                required 
              />
            </div>
          </div>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Scheduled Time *</label>
          <input 
            type="time" 
            className="form-control" 
            name="scheduled_time"
            value={reportForm.scheduled_time}
            onChange={handleReportChange}
            required 
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Topic Taught *</label>
          <textarea 
            className="form-control" 
            name="topic_taught"
            value={reportForm.topic_taught}
            onChange={handleReportChange}
            rows="3"
            required 
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Learning Outcomes *</label>
          <textarea 
            className="form-control" 
            name="learning_outcomes"
            value={reportForm.learning_outcomes}
            onChange={handleReportChange}
            rows="3"
            required 
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Lecturer's Recommendations</label>
          <textarea 
            className="form-control" 
            name="recommendations"
            value={reportForm.recommendations}
            onChange={handleReportChange}
            rows="3"
          />
        </div>
        
        <button type="submit" className="btn btn-primary">Submit Report</button>
      </form>
    </div>
  );
};

export default ReportForm;
import React from 'react';

const AssignCourseForm = ({ assignCourseForm, handleAssignCourseChange, handleAssignCourseSubmit, setPage, courses, users }) => {
  const lecturers = users.filter(user => user.role === 'lecturer');

  return (
    <div className="card p-4">
      <h3>Assign Course to Lecturer</h3>
      
      <form onSubmit={handleAssignCourseSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Select Lecturer *</label>
              <select 
                className="form-select" 
                name="lecturer_id"
                value={assignCourseForm.lecturer_id}
                onChange={handleAssignCourseChange}
                required
              >
                <option value="">Choose a lecturer</option>
                {lecturers && lecturers.length > 0 ? (
                  lecturers.map(lecturer => (
                    <option key={lecturer.id} value={lecturer.id}>
                      {lecturer.name} ({lecturer.email})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No lecturers available</option>
                )}
              </select>
              {!lecturers || lecturers.length === 0 && (
                <small className="text-danger">No lecturers found. Please register lecturers first.</small>
              )}
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Select Course *</label>
              <select 
                className="form-select" 
                name="course_id"
                value={assignCourseForm.course_id}
                onChange={handleAssignCourseChange}
                required
              >
                <option value="">Choose a course</option>
                {courses && courses.length > 0 ? (
                  courses.map(course => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.course_name} ({course.course_code})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No courses available</option>
                )}
              </select>
              {!courses || courses.length === 0 && (
                <small className="text-danger">No courses found. Please add courses first.</small>
              )}
            </div>
          </div>
        </div>
        
        <div className="d-flex gap-2">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!lecturers || lecturers.length === 0 || !courses || courses.length === 0}
          >
            Assign Course
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setPage('lectures')}>
            Cancel
          </button>
        </div>

        {/* Current assignments preview */}
        <div className="mt-4 p-3 bg-light rounded">
          <h6>Current Course Assignments:</h6>
          {lecturers && lecturers.length > 0 ? (
            <div className="small">
              {lecturers.map(lecturer => (
                <div key={lecturer.id} className="mb-2">
                  <strong>{lecturer.name}:</strong> {lecturer.assigned_courses || 'No courses assigned'}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted small">No lecturers available</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AssignCourseForm;
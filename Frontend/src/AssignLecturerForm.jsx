import React from 'react';

const AssignLecturerForm = ({ assignForm, handleAssignChange, handleAssignSubmit, setPage, classes, users }) => {
  const lecturers = users.filter(user => user.role === 'lecturer');
  const unassignedClasses = classes.filter(cls => !cls.lecturer_id);

  return (
    <div className="card p-4">
      <h3>Assign Lecturer to Class</h3>
      
      <form onSubmit={handleAssignSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Select Class *</label>
              <select 
                className="form-select" 
                name="class_id"
                value={assignForm.class_id}
                onChange={handleAssignChange}
                required
              >
                <option value="">Choose a class</option>
                {unassignedClasses && unassignedClasses.length > 0 ? (
                  unassignedClasses.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.class_name} 
                      {cls.course_name && ` - ${cls.course_name}`}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No unassigned classes available</option>
                )}
              </select>
              {(!unassignedClasses || unassignedClasses.length === 0) && (
                <small className="text-danger">All classes already have lecturers assigned</small>
              )}
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Select Lecturer *</label>
              <select 
                className="form-select" 
                name="lecturer_id"
                value={assignForm.lecturer_id}
                onChange={handleAssignChange}
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
            </div>
          </div>
        </div>
        
        <div className="d-flex gap-2">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!unassignedClasses || unassignedClasses.length === 0 || !lecturers || lecturers.length === 0}
          >
            Assign Lecturer
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setPage('classes')}>
            Cancel
          </button>
        </div>

        {/* Current assignments preview */}
        <div className="mt-4 p-3 bg-light rounded">
          <h6>Current Class Assignments:</h6>
          {classes && classes.filter(cls => cls.lecturer_name).length > 0 ? (
            <div className="small">
              {classes.filter(cls => cls.lecturer_name).map(cls => (
                <div key={cls.id} className="mb-2">
                  <strong>{cls.class_name}:</strong> {cls.lecturer_name}
                  {cls.course_name && ` - ${cls.course_name}`}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted small">No classes have lecturers assigned yet</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AssignLecturerForm;
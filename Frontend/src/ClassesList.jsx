import React from 'react';

const ClassesList = ({ classes, setPage, user }) => {
  // Ensure classes is always an array and handle loading state
  const classList = Array.isArray(classes) ? classes : [];

  // Filter classes based on user role
  let filteredClasses = classList;
  if (user?.role === 'lecturer') {
    filteredClasses = classList.filter(cls => cls.lecturer_id === user.id);
  }

  const hasData = filteredClasses.length > 0;

  const handleRemoveLecturer = async (classId, className) => {
    if (window.confirm(`Are you sure you want to remove the lecturer from ${className}?`)) {
      try {
        const response = await fetch(`http://localhost:8081/remove-lecturer-from-class/${classId}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        alert(data.message);
        window.location.reload(); // Refresh to show updated data
      } catch (error) {
        alert('Failed to remove lecturer: ' + error.message);
      }
    }
  };

  return (
    <div className="card p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Classes Management</h3>
        {user?.role === 'pl' && (
          <div>
            <button className="btn btn-success me-2" onClick={() => setPage('assignLecturer')}>
              <i className="fas fa-user-plus me-2"></i>Assign Lecturer
            </button>
            <button className="btn btn-primary" onClick={() => setPage('addClass')}>
              <i className="fas fa-plus me-2"></i>Add New Class
            </button>
          </div>
        )}
      </div>
      
      {hasData ? (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Class ID</th>
                <th>Class Name</th>
                <th>Course</th>
                <th>Faculty</th>
                <th>Lecturer</th>
                <th>Venue</th>
                <th>Schedule</th>
                {user?.role === 'pl' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((cls, index) => (
                <tr key={cls.id || index}>
                  <td>{cls.id || 'N/A'}</td>
                  <td>
                    <strong>{cls.class_name || 'Unnamed Class'}</strong>
                  </td>
                  <td>
                    {cls.course_name ? (
                      <span>
                        {cls.course_name} 
                        {cls.course_code && ` (${cls.course_code})`}
                      </span>
                    ) : (
                      <span className="text-muted">No course</span>
                    )}
                  </td>
                  <td>{cls.faculty_name || cls.faculty_id || 'No faculty'}</td>
                  <td>
                    {cls.lecturer_name ? (
                      <div>
                        <div className="fw-bold">{cls.lecturer_name}</div>
                        {cls.lecturer_email && (
                          <small className="text-muted">{cls.lecturer_email}</small>
                        )}
                      </div>
                    ) : (
                      <span className="text-warning">
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        Not assigned
                      </span>
                    )}
                  </td>
                  <td>{cls.venue || 'No venue'}</td>
                  <td>{cls.schedule || 'No schedule'}</td>
                  {user?.role === 'pl' && (
                    <td>
                      <div className="btn-group">
                        {cls.lecturer_name ? (
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveLecturer(cls.id, cls.class_name)}
                            title="Remove Lecturer"
                          >
                            <i className="fas fa-user-times"></i>
                          </button>
                        ) : (
                          <button 
                            className="btn btn-sm btn-outline-success"
                            onClick={() => setPage('assignLecturer')}
                            title="Assign Lecturer"
                          >
                            <i className="fas fa-user-plus"></i>
                          </button>
                        )}
                        <button className="btn btn-sm btn-outline-warning" title="Edit">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" title="Delete">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="fas fa-users fa-3x text-muted mb-3"></i>
          <h5>No Classes Found</h5>
          <p className="text-muted">
            {user?.role === 'pl' 
              ? 'Create your first class or assign lecturers to existing classes.' 
              : 'No classes have been assigned to you yet.'
            }
          </p>
          {user?.role === 'pl' && (
            <button className="btn btn-primary mt-2" onClick={() => setPage('addClass')}>
              Create Your First Class
            </button>
          )}
        </div>
      )}

      {/* Classes Summary */}
      {hasData && (
        <div className="mt-3 p-3 bg-light rounded">
          <h6>Classes Summary:</h6>
          <div className="row">
            <div className="col-md-3">
              <strong>Total Classes:</strong> {filteredClasses.length}
            </div>
            <div className="col-md-3">
              <strong>With Lecturers:</strong> {filteredClasses.filter(cls => cls.lecturer_name).length}
            </div>
            <div className="col-md-3">
              <strong>Without Lecturers:</strong> {filteredClasses.filter(cls => !cls.lecturer_name).length}
            </div>
            <div className="col-md-3">
              <strong>Assignment Rate:</strong> {filteredClasses.length > 0 ? Math.round((filteredClasses.filter(cls => cls.lecturer_name).length / filteredClasses.length) * 100) : 0}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesList;
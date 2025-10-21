import React from 'react';

const LecturesManagement = ({ users, setPage, user }) => {
  const lecturers = users.filter(u => u.role === 'lecturer');
  const hasLecturers = lecturers && lecturers.length > 0;

  const handleAssignCourse = (lecturerId) => {
    setPage('assignCourse');
  };

  return (
    <div className="card p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Lectures Management</h3>
        {user?.role === 'pl' && (
          <div>
            <button className="btn btn-primary me-2" onClick={() => setPage('assignCourse')}>
              <i className="fas fa-tasks me-2"></i>Assign Courses
            </button>
          </div>
        )}
      </div>
      
      {hasLecturers ? (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Assigned Courses</th>
                <th>Status</th>
                {user?.role === 'pl' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {lecturers.map(lecturer => (
                <tr key={lecturer.id}>
                  <td>{lecturer.id}</td>
                  <td>{lecturer.name}</td>
                  <td>{lecturer.email}</td>
                  <td>
                    {lecturer.assigned_courses ? (
                      <div>
                        {lecturer.assigned_courses.split(',').map((course, index) => (
                          <span key={index} className="badge bg-primary me-1 mb-1">
                            {course.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">No courses assigned</span>
                    )}
                  </td>
                  <td>
                    <span className="badge bg-success">Active</span>
                  </td>
                  {user?.role === 'pl' && (
                    <td>
                      <button 
                        className="btn btn-sm btn-warning me-1" 
                        title="Assign Course"
                        onClick={() => handleAssignCourse(lecturer.id)}
                      >
                        <i className="fas fa-book me-1"></i>Assign
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="fas fa-chalkboard-teacher fa-3x text-muted mb-3"></i>
          <h5>No Lecturers Found</h5>
          <p className="text-muted">
            No lecturers are currently registered in the system.
          </p>
        </div>
      )}

      <div className="mt-3 p-3 bg-light rounded">
        <h6>Lecturers Summary:</h6>
        <p className="mb-0">
          <strong>Total Lecturers:</strong> {hasLecturers ? lecturers.length : '0'}
        </p>
        <p className="mb-0">
          <strong>Lecturers with Assignments:</strong> {hasLecturers ? lecturers.filter(l => l.assigned_courses).length : '0'}
        </p>
      </div>
    </div>
  );
};

export default LecturesManagement;
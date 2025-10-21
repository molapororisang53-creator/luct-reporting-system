import React from 'react';

const CoursesList = ({ courses, setPage, user }) => {
  const hasData = courses && courses.length > 0;

  return (
    <div className="card p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Courses Management</h3>
        {user && (user.role === 'pl' || user.role === 'prl') && (
          <button className="btn btn-primary" onClick={() => setPage('addCourse')}>
            Add New Course
          </button>
        )}
      </div>
      
      {hasData ? (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Faculty</th>
                {user && (user.role === 'pl' || user.role === 'prl') && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.course_id}>
                  <td>{course.course_id}</td>
                  <td>{course.course_code}</td>
                  <td>{course.course_name}</td>
                  <td>{course.faculty_name || course.faculty_id || 'No faculty'}</td>
                  {user && (user.role === 'pl' || user.role === 'prl') && (
                    <td>
                      <button className="btn btn-sm btn-warning me-1">Edit</button>
                      <button className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="fas fa-book fa-3x text-muted mb-3"></i>
          <h5>No Courses Found</h5>
          <p className="text-muted">
            {(user?.role === 'pl' || user?.role === 'prl') 
              ? 'Create your first course using the "Add New Course" button above.' 
              : 'No courses are currently available.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default CoursesList;
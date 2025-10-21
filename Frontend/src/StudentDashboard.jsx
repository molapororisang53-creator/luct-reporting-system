import React, { useState, useEffect } from 'react';

const StudentDashboard = ({ user, setPage, classes, courses, reports }) => {
  const [studentEnrollments, setStudentEnrollments] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    fetchStudentEnrollments();
  }, [user.id]);

  // Update available classes whenever classes prop changes
  useEffect(() => {
    if (classes && Array.isArray(classes)) {
      setAvailableClasses(classes);
    }
  }, [classes]);

  const fetchStudentEnrollments = async () => {
    try {
      const response = await fetch(`http://localhost:8081/student-enrollments/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setStudentEnrollments(data);
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const handleRegisterForClass = async () => {
    if (!selectedClass) {
      alert('Please select a class to register for.');
      return;
    }

    setLoading(true);
    try {
      const classToAdd = availableClasses.find(cls => cls.id === parseInt(selectedClass));
      if (!classToAdd) {
        alert('Selected class not found.');
        return;
      }

      // Check if already registered
      if (studentEnrollments.some(en => en.class_id === parseInt(selectedClass))) {
        alert('You are already registered for this class.');
        return;
      }

      const response = await fetch('http://localhost:8081/student-enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: user.id,
          class_id: parseInt(selectedClass)
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Successfully registered for ${classToAdd.class_name}`);
        setSelectedClass('');
        fetchStudentEnrollments(); // Refresh the list
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to register for class');
      }
    } catch (error) {
      console.error('Error registering for class:', error);
      alert('Failed to register for class. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnregisterFromClass = async (enrollmentId) => {
    if (window.confirm('Are you sure you want to unregister from this class?')) {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8081/student-enrollments/${enrollmentId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const data = await response.json();
          alert(data.message || 'Successfully unregistered from class');
          fetchStudentEnrollments(); // Refresh the list
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'Failed to unregister from class');
        }
      } catch (error) {
        console.error('Error unregistering from class:', error);
        alert('Failed to unregister from class. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getReportsForStudentClasses = () => {
    const studentClassNames = studentEnrollments.map(en => en.class_name);
    return reports.filter(report => 
      studentClassNames.includes(report.class_name)
    );
  };

  const studentReports = getReportsForStudentClasses();

  return (
    <div className="card p-4">
      <h3>Student Dashboard</h3>
      <div className="alert alert-info">
        <i className="fas fa-info-circle me-2"></i>
        Hello, <strong>{user.name}</strong>! (Role: Student)
      </div>

      {/* Class Registration Section */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-book me-2"></i>Register for Classes
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Select Class to Register</label>
                <select 
                  className="form-select"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="">Choose a class...</option>
                  {availableClasses.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.class_name} - {cls.course_name} ({cls.course_code})
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="btn btn-success w-100"
                onClick={handleRegisterForClass}
                disabled={!selectedClass || loading}
              >
                <i className="fas fa-user-plus me-2"></i>
                {loading ? 'Registering...' : 'Register for Class'}
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>My Registered Classes
              </h5>
            </div>
            <div className="card-body">
              {studentEnrollments.length === 0 ? (
                <p className="text-muted">You haven't registered for any classes yet.</p>
              ) : (
                <div className="list-group">
                  {studentEnrollments.map(en => (
                    <div key={en.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{en.class_name}</strong>
                        <br />
                        <small className="text-muted">
                          {en.course_name} ({en.course_code})
                        </small>
                        <br />
                        <small>Lecturer: {en.lecturer_name || 'Not assigned'}</small>
                      </div>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleUnregisterFromClass(en.id)}
                        title="Unregister from class"
                        disabled={loading}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-primary">
            <div className="card-body text-center">
              <h4>{studentEnrollments.length}</h4>
              <p className="mb-0">Registered Classes</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-success">
            <div className="card-body text-center">
              <h4>{studentReports.length}</h4>
              <p className="mb-0">Available Reports</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-info">
            <div className="card-body text-center">
              <h4>
                {studentReports.length > 0
                  ? studentReports.filter(report => report.average_rating > 0).length
                  : 0
                }
              </h4>
              <p className="mb-0">Rated Reports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card h-100 border-0 bg-light">
            <div className="card-body text-center">
              <i className="fas fa-list fa-2x mb-3 text-primary"></i>
              <h5>View Reports</h5>
              <p className="text-muted small">
                {studentEnrollments.length === 0 
                  ? 'Register for classes to view reports' 
                  : `View ${studentReports.length} reports from your classes`
                }
              </p>
              <button 
                className="btn btn-primary" 
                onClick={() => setPage('reports')}
                disabled={studentEnrollments.length === 0}
              >
                View Reports
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card h-100 border-0 bg-light">
            <div className="card-body text-center">
              <i className="fas fa-star fa-2x mb-3 text-warning"></i>
              <h5>Rate Lectures</h5>
              <p className="text-muted small">
                {studentReports.length === 0 
                  ? 'No reports available to rate' 
                  : 'Provide ratings for lectures you attended'
                }
              </p>
              <button 
                className="btn btn-warning text-white" 
                onClick={() => setPage('rating')}
                disabled={studentReports.length === 0}
              >
                Rate Reports
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card h-100 border-0 bg-light">
            <div className="card-body text-center">
              <i className="fas fa-chart-bar fa-2x mb-3 text-info"></i>
              <h5>Progress Monitoring</h5>
              <p className="text-muted small">
                {studentEnrollments.length === 0 
                  ? 'Register for classes to monitor progress' 
                  : 'Track your learning progress'
                }
              </p>
              <button 
                className="btn btn-info" 
                onClick={() => setPage('reports')}
                disabled={studentEnrollments.length === 0}
              >
                Monitor Progress
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports Preview */}
      {studentReports.length > 0 && (
        <div className="mt-4">
          <div className="card">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">
                <i className="fas fa-clock me-2"></i>Recent Reports from Your Classes
              </h5>
            </div>
            <div className="card-body">
              <div className="list-group">
                {studentReports.slice(0, 3).map(report => (
                  <div key={report.id} className="list-group-item">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">{report.course_name}</h6>
                      <small>{new Date(report.date_of_lecture).toLocaleDateString()}</small>
                    </div>
                    <p className="mb-1">{report.topic_taught}</p>
                    <small className="text-muted">
                      Lecturer: {report.lecturer_name} | 
                      Class: {report.class_name} | 
                      Rating: {report.average_rating > 0 ? `${report.average_rating}/5` : 'Not rated'}
                    </small>
                  </div>
                ))}
              </div>
              {studentReports.length > 3 && (
                <div className="text-center mt-3">
                  <button className="btn btn-outline-primary btn-sm" onClick={() => setPage('reports')}>
                    View All {studentReports.length} Reports
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
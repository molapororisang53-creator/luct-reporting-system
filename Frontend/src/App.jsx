import React, { useEffect, useState } from "react";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ReportForm from './ReportForm';
import ReportsList from './ReportsList';
import CoursesList from './CoursesList';
import AddCourseForm from './AddCourseForm';
import RatingForm from './RatingForm';
import FeedbackForm from './FeedbackForm';
import StudentDashboard from './StudentDashboard';
import ChartsComponent from './ChartsComponent';
import ClassesList from './ClassesList';
import AddClassForm from './AddClassForm';
import LecturesManagement from './LecturesManagement';
import AssignCourseForm from './AssignCourseForm';
import AssignLecturerForm from './AssignLecturerForm';


const APP_COLORS = {
  primary: '#3498db',    // Blue
  secondary: '#2ecc71',  // Green
  accent: '#e74c3c'      // Red
};

// API base URL for easier configuration
const API_BASE = 'https://luct-reporting-system-zbqa.onrender.com';

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    username: '', 
    password: '', 
    role: '', 
    name: '', 
    email: '' 
  });
  const [reportForm, setReportForm] = useState({
    faculty_name: '',
    class_name: '',
    week_of_reporting: '',
    date_of_lecture: '',
    course_name: '',
    course_code: '',
    lecturer_name: '',
    actual_students_present: '',
    total_registered_students: '',
    venue: '',
    scheduled_time: '',
    topic_taught: '',
    learning_outcomes: '',
    recommendations: ''
  });
  const [reports, setReports] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseForm, setCourseForm] = useState({
    course_name: '',
    course_code: '',
    faculty_id: ''
  });
  const [classForm, setClassForm] = useState({
    class_name: '',
    faculty_id: '',
    course_id: '',
    lecturer_id: '',
    venue: '',
    schedule: ''
  });
  const [assignCourseForm, setAssignCourseForm] = useState({
    lecturer_id: '',
    course_id: ''
  });
  const [ratingForm, setRatingForm] = useState({
    report_id: '',
    rating_value: '',
    comments: '',
    user_id: ''
  });
  const [feedbackForm, setFeedbackForm] = useState({
    report_id: '',
    feedback_text: '',
    prl_id: ''
  });
  const [studentEnrollments, setStudentEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add to your state variables
  const [assignLecturerForm, setAssignLecturerForm] = useState({
    class_id: '',
    lecturer_id: ''
  });

  // Check for existing user session on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Enhanced fetchClassesWithLecturers function
  const fetchClassesWithLecturers = async () => {
    try {
      console.log(' Fetching classes from API...');
      const data = await apiCall('/classes-with-lecturers');
      
      if (data && Array.isArray(data)) {
        console.log(` Successfully loaded ${data.length} classes:`, data);
        setClasses(data);
      } else {
        console.error(' Invalid data format received:', data);
        setClasses([]);
      }
    } catch (error) {
      console.error(' Error fetching classes with lecturers:', error);
      setClasses([]);
    }
  };

  // Fetch data when user changes or page changes
  useEffect(() => {
    if (user) {
      if (user.role === 'student') {
        fetchStudentEnrollments();
      }
      if (page === 'reports' || page === 'rating') {
        fetchReports();
      }
      if (page === 'courses' || page === 'addCourse' || page === 'assignCourse') {
        fetchCourses();
        fetchFaculties();
      }
      if (page === 'classes' || page === 'addClass' || page === 'assignLecturer' || (user.role === 'student' && page === 'home')) {
        fetchClassesWithLecturers(); // Use the new function
        fetchFaculties();
        fetchCourses();
        fetchUsers();
      }
      if (page === 'lectures' || page === 'assignCourse') {
        fetchUsers();
      }
      if (page === 'reporting') {
        fetchFaculties();
        fetchClassesWithLecturers();
      }
    }
  }, [user, page]);

  // Enhanced API call function with error handling
  const apiCall = async (endpoint, options = {}) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch functions 
  const fetchReports = async () => {
    try {
      const data = await apiCall('/reports');
      if (data && !data.error) {
        setReports(data);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await apiCall('/courses');
      if (data && !data.error) {
        setCourses(data);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  const fetchFaculties = async () => {
    try {
      const data = await apiCall('/faculty');
      if (data && !data.error) {
        setFaculties(data);
      } else {
        setFaculties([]);
      }
    } catch (error) {
      console.error('Error fetching faculties:', error);
      setFaculties([]);
    }
  };

  const fetchClasses = async () => {
    try {
      const data = await apiCall('/classes');
      if (data && !data.error) {
        setClasses(data);
      } else {
        setClasses([]);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      setClasses([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await apiCall('/users');
      if (data && !data.error) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const fetchStudentEnrollments = async () => {
    if (!user || user.role !== 'student') return;
    try {
      const data = await apiCall(`/student-enrollments/${user.id}`);
      if (data && !data.error) {
        setStudentEnrollments(data);
      } else {
        setStudentEnrollments([]);
      }
    } catch (error) {
      console.error('Error fetching student enrollments:', error);
      setStudentEnrollments([]);
    }
  };

  // Form handlers
  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };
  
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await apiCall('/users', {
        method: 'POST',
        body: JSON.stringify(registerForm)
      });
      
      if (data.error) {
        alert('Registration failed: ' + data.error);
      } else {
        alert('Registration successful!');
        setPage('login');
        setRegisterForm({ 
          username: '', 
          password: '', 
          role: '', 
          name: '', 
          email: '' 
        });
      }
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };
  
  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try { 
      const data = await apiCall('/login', {
        method: 'POST',
        body: JSON.stringify(loginForm)
      });
      
      if (data.error) {
        alert('Login failed: ' + data.error);
      } else {
        alert(`Login successful! Welcome ${data.user.name} (${data.user.role})`);
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setPage('home');
        setLoginForm({ username: '', password: '' });
        await fetchReports();
      }
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const handleReportChange = (e) => {
    setReportForm({ ...reportForm, [e.target.name]: e.target.value });
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();

    // Check user role before submission
    if (!user || !['lecturer', 'prl', 'pl'].includes(user.role)) {
      alert('Only lecturers, PRLs, and PLs can create reports.');
      return;
    }

    // Auto-fill lecturer name if not provided and user is lecturer
    const formData = { ...reportForm, user_id: user.id };
    if (!formData.lecturer_name && user.role === 'lecturer') {
      formData.lecturer_name = user.name;
    }

    try {
      const data = await apiCall('/report', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (data.error) {
        alert('Report submission failed: ' + data.error);
      } else {
        alert('Report submitted successfully!');
        setReportForm({
          faculty_name: '', class_name: '', week_of_reporting: '', date_of_lecture: '',
          course_name: '', course_code: '', lecturer_name: '', actual_students_present: '',
          total_registered_students: '', venue: '', scheduled_time: '', topic_taught: '',
          learning_outcomes: '', recommendations: ''
        });
        fetchReports();
        setPage('reports');
      }
    } catch (error) {
      alert('Report submission failed: ' + error.message);
    }
  };

  const handleCourseChange = (e) => {
    setCourseForm({ ...courseForm, [e.target.name]: e.target.value });
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await apiCall('/courses', {
        method: 'POST',
        body: JSON.stringify(courseForm)
      });
      
      if (data.error) {
        alert('Course creation failed: ' + data.error);
      } else {
        alert('Course created successfully!');
        setCourseForm({ course_name: '', course_code: '', faculty_id: '' });
        setPage('courses');
        fetchCourses();
      }
    } catch (error) {
      alert('Course creation failed: ' + error.message);
    }
  };

  const handleClassChange = (e) => {
    setClassForm({ ...classForm, [e.target.name]: e.target.value });
  };

  // FIXED: This function now uses fetchClassesWithLecturers instead of fetchClasses
  const handleClassSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required data before submission
    if (!faculties || faculties.length === 0) {
      alert('Cannot create class: No faculties available. Please add faculties first.');
      return;
    }
    
    if (!courses || courses.length === 0) {
      alert('Cannot create class: No courses available. Please add courses first.');
      return;
    }

    try {
      const data = await apiCall('/classes', {
        method: 'POST',
        body: JSON.stringify(classForm)
      });
      
      if (data.error) {
        alert('Class creation failed: ' + data.error);
      } else {
        alert('Class created successfully!');
        setClassForm({ 
          class_name: '', faculty_id: '', course_id: '', 
          lecturer_id: '', venue: '', schedule: '' 
        });
        setPage('classes');
        // CRITICAL FIX: Use fetchClassesWithLecturers instead of fetchClasses
        await fetchClassesWithLecturers();
      }
    } catch (error) {
      alert('Class creation failed: ' + error.message);
    }
  };

  const handleAssignCourseChange = (e) => {
    setAssignCourseForm({ ...assignCourseForm, [e.target.name]: e.target.value });
  };

  const handleAssignCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await apiCall('/assign-course', {
        method: 'POST',
        body: JSON.stringify(assignCourseForm)
      });
      
      if (data.error) {
        alert('Course assignment failed: ' + data.error);
      } else {
        alert(`Course assigned successfully! ${data.lecturer} is now assigned to ${data.course}`);
        setAssignCourseForm({ lecturer_id: '', course_id: '' });
        setPage('lectures');
        fetchUsers(); // Refresh data to show updated assignments
      }
    } catch (error) {
      alert('Course assignment failed: ' + error.message);
    }
  };

  // Add this form handler
  const handleAssignLecturerChange = (e) => {
    setAssignLecturerForm({ ...assignLecturerForm, [e.target.name]: e.target.value });
  };

  const handleAssignLecturerSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await apiCall('/assign-lecturer-to-class', {
        method: 'POST',
        body: JSON.stringify(assignLecturerForm)
      });
      
      if (data.error) {
        alert('Lecturer assignment failed: ' + data.error);
      } else {
        alert(`Lecturer assigned successfully! ${data.lecturer} is now assigned to ${data.class}`);
        setAssignLecturerForm({ class_id: '', lecturer_id: '' });
        setPage('classes');
        fetchClassesWithLecturers(); // Refresh data
      }
    } catch (error) {
      alert('Lecturer assignment failed: ' + error.message);
    }
  };

  const handleRatingChange = (e) => {
    setRatingForm({ ...ratingForm, [e.target.name]: e.target.value });
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    
    if (user?.role !== 'student') {
      alert('Only students can rate reports.');
      return;
    }

    if (!ratingForm.rating_value || ratingForm.rating_value < 1 || ratingForm.rating_value > 5) {
      alert('Please select a rating between 1 and 5 stars.');
      return;
    }

    const ratingData = {
      report_id: ratingForm.report_id,
      rating_value: parseInt(ratingForm.rating_value),
      user_id: user.id,
      comments: ratingForm.comments
    };

    try {
      const data = await apiCall('/ratings', {
        method: 'POST',
        body: JSON.stringify(ratingData)
      });
      
      if (data.error) {
        alert('Rating submission failed: ' + data.error);
      } else {
        alert('Rating submitted successfully!');
        setRatingForm({ report_id: '', rating_value: '', comments: '', user_id: '' });
        fetchReports();
        setPage('reports');
      }
    } catch (error) {
      alert('Rating submission failed: ' + error.message);
    }
  };

  const handleFeedbackChange = (e) => {
    setFeedbackForm({ ...feedbackForm, [e.target.name]: e.target.value });
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    
    if (user?.role !== 'prl') {
      alert('Only Principal Lecturers (PRLs) can provide feedback on reports.');
      return;
    }

    const feedbackData = {
      report_id: feedbackForm.report_id,
      feedback_text: feedbackForm.feedback_text,
      prl_id: user.id
    };

    try {
      const data = await apiCall('/feedback', {
        method: 'POST',
        body: JSON.stringify(feedbackData)
      });
      
      if (data.error) {
        alert('Feedback submission failed: ' + data.error);
      } else {
        alert('Feedback submitted successfully!');
        setFeedbackForm({ report_id: '', feedback_text: '', prl_id: '' });
        fetchReports();
        setPage('reports');
      }
    } catch (error) {
      alert('Feedback submission failed: ' + error.message);
    }
  };

  const viewReportDetails = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      const details = `
Report Details:

Course: ${report.course_name} (${report.course_code})
Class: ${report.class_name}
Faculty: ${report.faculty_name}
Date: ${report.date_of_lecture ? new Date(report.date_of_lecture).toLocaleDateString() : 'N/A'}
Lecturer: ${report.lecturer_name}
Students Present: ${report.actual_students_present}/${report.total_registered_students}
Venue: ${report.venue}
Scheduled Time: ${report.scheduled_time}
Topic: ${report.topic_taught}
Learning Outcomes: ${report.learning_outcomes}
Recommendations: ${report.recommendations || 'None'}
Average Rating: ${report.average_rating > 0 ? report.average_rating + '/5' : 'Not rated'}
Total Ratings: ${report.total_ratings || 0}
Feedback: ${report.has_feedback ? 'Given' : 'Not given'}
      `;
      alert(details);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setPage('home');
    alert('Logged out successfully');
  };

  const navigateToPage = (pageName) => {
    if (user || ['home', 'login', 'register'].includes(pageName)) {
      setPage(pageName);
    } else {
      alert(`Please login first to access ${pageName}`);
      setPage('login');
    }
  };

  // Filter reports for lecturer by assigned classes or reports they created
  const lecturerReports = user?.role === 'lecturer'
    ? (() => {
        const assignedClassNames = classes
          .filter(cls => cls.lecturer_id === user.id)
          .map(cls => cls.class_name);
        return reports.filter(report => assignedClassNames.includes(report.class_name) || report.lecturer_name === user.name);
      })()
    : [];

  // Filter reports for PRL by stream (based on faculty)
  const prlReports = user?.role === 'prl' 
    ? reports.filter(report => {
        // This would ideally be based on the PRL's assigned faculty/stream
        // For now, we'll show all reports
        return true;
      })
    : [];

  // Get student's registered classes reports
  const getStudentReports = () => {
    if (user?.role !== 'student') return reports;

    const studentClassNames = studentEnrollments.map(en => en.class_name);

    return reports.filter(report =>
      studentClassNames.includes(report.class_name)
    );
  };

  // Role-based home page rendering
  const renderRoleBasedHome = () => {
    if (!user) {
      return (
        <div className="card shadow-sm border-0">
          <div className="card-header text-white" style={{ backgroundColor: APP_COLORS.primary }}>
            <h2 className="mb-0"><i className="fas fa-graduation-cap me-2"></i>LUCT Faculty Reporting System</h2>
          </div>
          <div className="card-body text-center py-5">
            <i className="fas fa-chalkboard-teacher display-1 mb-3" style={{ color: APP_COLORS.primary }}></i>
            <h3>Welcome to the Faculty Portal</h3>
            <p className="lead text-muted">Please login or register to access the system features.</p>
            <div className="row mt-4">
              <div className="col-md-6 mb-3">
                <div className="card h-100 border-0">
                  <div className="card-body">
                    <i className="fas fa-sign-in-alt fa-2x mb-3" style={{ color: APP_COLORS.primary }}></i>
                    <h5>Login</h5>
                    <p className="text-muted">Access your existing account</p>
                    <button className="btn w-100 text-white" style={{ backgroundColor: APP_COLORS.primary }} onClick={() => setPage('login')}>
                      Login to System
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="card h-100 border-0">
                  <div className="card-body">
                    <i className="fas fa-user-plus fa-2x mb-3" style={{ color: APP_COLORS.secondary }}></i>
                    <h5>Register</h5>
                    <p className="text-muted">Create a new account</p>
                    <button className="btn w-100 text-white" style={{ backgroundColor: APP_COLORS.secondary }} onClick={() => setPage('register')}>
                      Register New Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch (user.role) {
     case 'student':
        return (
          <StudentDashboard
            user={user}
            setPage={setPage}
            classes={classes}
            courses={courses}
            reports={reports}
            showCreateReport={false} 
          />
        ); 
      
      case 'lecturer':
        return (
          <div className="card shadow-sm border-0">
            <div className="card-header text-white" style={{ backgroundColor: APP_COLORS.primary }}>
              <h4 className="mb-0"><i className="fas fa-chalkboard-teacher me-2"></i>Lecturer Dashboard</h4>
            </div>
            <div className="card-body">
              <div className="alert text-white" style={{ backgroundColor: APP_COLORS.primary }}>
                <i className="fas fa-info-circle me-2"></i>
                Hello, <strong>{user.name}</strong>! (Role: Lecturer)
              </div>
              
              {/* Quick Stats for Lecturer */}
              <div className="row mb-4">
                <div className="col-md-3 mb-3">
                  <div className="card text-white" style={{ backgroundColor: APP_COLORS.primary }}>
                    <div className="card-body text-center">
                      <h4>{lecturerReports.length}</h4>
                      <p className="mb-0">Your Reports</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card text-white" style={{ backgroundColor: APP_COLORS.secondary }}>
                    <div className="card-body text-center">
                      <h4>{lecturerReports.reduce((sum, report) => sum + (report.total_ratings || 0), 0)}</h4>
                      <p className="mb-0">Total Ratings</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card text-white" style={{ backgroundColor: APP_COLORS.accent }}>
                    <div className="card-body text-center">
                      <h4>{
                        lecturerReports.length > 0 
                          ? (lecturerReports.reduce((sum, report) => sum + (report.average_rating || 0), 0) / lecturerReports.length).toFixed(1)
                          : 0
                      }/5</h4>
                      <p className="mb-0">Avg Rating</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card text-white" style={{ backgroundColor: APP_COLORS.primary }}>
                    <div className="card-body text-center">
                      <h4>{lecturerReports.filter(report => report.has_feedback).length}</h4>
                      <p className="mb-0">Feedback Received</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="card h-100 border-0 bg-light">
                    <div className="card-body text-center">
                      <i className="fas fa-file-alt fa-2x mb-3" style={{ color: APP_COLORS.primary }}></i>
                      <h5>Create Reports</h5>
                      <p className="text-muted small">Submit lecture reports</p>
                      <button className="btn btn-sm text-white" style={{ backgroundColor: APP_COLORS.primary }} onClick={() => setPage('reporting')}>
                        Create Report
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card h-100 border-0 bg-light">
                    <div className="card-body text-center">
                      <i className="fas fa-list fa-2x mb-3" style={{ color: APP_COLORS.secondary }}></i>
                      <h5>View Reports</h5>
                      <p className="text-muted small">Monitor your reports</p>
                      <button className="btn btn-sm text-white" style={{ backgroundColor: APP_COLORS.secondary }} onClick={() => setPage('reports')}>
                        View Reports
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card h-100 border-0 bg-light">
                    <div className="card-body text-center">
                      <i className="fas fa-users fa-2x mb-3" style={{ color: APP_COLORS.accent }}></i>
                      <h5>My Classes</h5>
                      <p className="text-muted small">View assigned classes</p>
                      <button className="btn btn-sm text-white" style={{ backgroundColor: APP_COLORS.accent }} onClick={() => setPage('classes')}>
                        View Classes
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts for Lecturer */}
              {lecturerReports.length > 0 ? (
                <ChartsComponent reports={lecturerReports} courses={courses} user={user} />
              ) : (
                <div className="alert alert-info mt-4">
                  <i className="fas fa-info-circle me-2"></i>
                  No reports found. Create your first report to see analytics and charts.
                </div>
              )}
            </div>
          </div>
        );

      case 'prl':
        return (
          <div className="card shadow-sm border-0">
            <div className="card-header text-white" style={{ backgroundColor: APP_COLORS.accent }}>
              <h4 className="mb-0"><i className="fas fa-user-tie me-2"></i>Principal Lecturer Dashboard</h4>
            </div>
            <div className="card-body">
              <div className="alert text-white" style={{ backgroundColor: APP_COLORS.accent }}>
                <i className="fas fa-info-circle me-2"></i>
                Hello, <strong>{user.name}</strong>! (Role: Principal Lecturer)
              </div>
              
              <div className="row">
                <div className="col-md-3 mb-3">
                  <div className="card h-100 border-0 bg-light">
                    <div className="card-body text-center">
                      <i className="fas fa-comment fa-2x mb-3" style={{ color: APP_COLORS.accent }}></i>
                      <h5>Provide Feedback</h5>
                      <p className="text-muted small">Give feedback on reports</p>
                      <button className="btn btn-sm text-white" style={{ backgroundColor: APP_COLORS.accent }} onClick={() => setPage('feedback')}>
                        Give Feedback
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card h-100 border-0 bg-light">
                    <div className="card-body text-center">
                      <i className="fas fa-list fa-2x mb-3" style={{ color: APP_COLORS.primary }}></i>
                      <h5>Monitor Reports</h5>
                      <p className="text-muted small">View stream reports</p>
                      <button className="btn btn-sm text-white" style={{ backgroundColor: APP_COLORS.primary }} onClick={() => setPage('reports')}>
                        View Reports
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card h-100 border-0 bg-light">
                    <div className="card-body text-center">
                      <i className="fas fa-book fa-2x mb-3" style={{ color: APP_COLORS.secondary }}></i>
                      <h5>Courses</h5>
                      <p className="text-muted small">Manage stream courses</p>
                      <button className="btn btn-sm text-white" style={{ backgroundColor: APP_COLORS.secondary }} onClick={() => setPage('courses')}>
                        View Courses
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card h-100 border-0 bg-light">
                    <div className="card-body text-center">
                      <i className="fas fa-users fa-2x mb-3" style={{ color: APP_COLORS.accent }}></i>
                      <h5>Classes</h5>
                      <p className="text-muted small">View stream classes</p>
                      <button className="btn btn-sm text-white" style={{ backgroundColor: APP_COLORS.accent }} onClick={() => setPage('classes')}>
                        View Classes
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <ChartsComponent reports={prlReports} courses={courses} user={user} />
            </div>
          </div>
        );

      case 'pl':
        return (
          <div className="card shadow-sm border-0">
            <div className="card-header text-white" style={{ backgroundColor: APP_COLORS.secondary }}>
              <h4 className="mb-0"><i className="fas fa-user-graduate me-2"></i>Program Leader Dashboard</h4>
            </div>
            <div className="card-body">
              <div className="alert text-white" style={{ backgroundColor: APP_COLORS.secondary }}>
                <i className="fas fa-info-circle me-2"></i>
                Hello, <strong>{user.name}</strong>! (Role: Program Leader)
              </div>
              
              {/* Simplified Program Leader Dashboard - No Analytics */}
              <div className="row">
                <div className="col-md-3 mb-3">
                  <div className="card h-100 border-0 bg-light">
                    <div className="card-body text-center">
                      <i className="fas fa-book fa-2x mb-3" style={{ color: APP_COLORS.primary }}></i>
                      <h5>Manage Courses</h5>
                      <p className="text-muted small">Add and assign courses</p>
                      <button className="btn btn-sm text-white" style={{ backgroundColor: APP_COLORS.primary }} onClick={() => setPage('courses')}>
                        Manage Courses
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card h-100 border-0 bg-light">
                    <div className="card-body text-center">
                      <i className="fas fa-list fa-2x mb-3" style={{ color: APP_COLORS.secondary }}></i>
                      <h5>View Reports</h5>
                      <p className="text-muted small">Monitor all reports</p>
                      <button className="btn btn-sm text-white" style={{ backgroundColor: APP_COLORS.secondary }} onClick={() => setPage('reports')}>
                        View Reports
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card h-100 border-0 bg-light">
                    <div className="card-body text-center">
                      <i className="fas fa-users fa-2x mb-3" style={{ color: APP_COLORS.accent }}></i>
                      <h5>Classes</h5>
                      <p className="text-muted small">Manage program classes</p>
                      <button className="btn btn-sm text-white" style={{ backgroundColor: APP_COLORS.accent }} onClick={() => setPage('classes')}>
                        Manage Classes
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card h-100 border-0 bg-light">
                    <div className="card-body text-center">
                      <i className="fas fa-chalkboard-teacher fa-2x mb-3" style={{ color: APP_COLORS.primary }}></i>
                      <h5>Assign Courses</h5>
                      <p className="text-muted small">Assign courses to lecturers</p>
                      <button className="btn btn-sm text-white" style={{ backgroundColor: APP_COLORS.primary }} onClick={() => setPage('assignCourse')}>
                        Assign Courses
                      </button>
                    </div>
                  </div>
                </div>
                {/* Add this to the Program Leader dashboard row */}
                <div className="col-md-3 mb-3">
                  <div className="card h-100 border-0 bg-light">
                    <div className="card-body text-center">
                      <i className="fas fa-user-plus fa-2x mb-3" style={{ color: APP_COLORS.accent }}></i>
                      <h5>Assign Lecturers</h5>
                      <p className="text-muted small">Assign lecturers to classes</p>
                      <button className="btn btn-sm text-white" style={{ backgroundColor: APP_COLORS.accent }} onClick={() => setPage('assignLecturer')}>
                        Assign Lecturers
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats for Program Leader */}
              <div className="row mb-4">
                <div className="col-md-3 mb-3">
                  <div className="card text-white" style={{ backgroundColor: APP_COLORS.primary }}>
                    <div className="card-body text-center">
                      <h4>{reports.length}</h4>
                      <p className="mb-0">Total Reports</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card text-white" style={{ backgroundColor: APP_COLORS.secondary }}>
                    <div className="card-body text-center">
                      <h4>{courses.length}</h4>
                      <p className="mb-0">Total Courses</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card text-white" style={{ backgroundColor: APP_COLORS.accent }}>
                    <div className="card-body text-center">
                      <h4>{classes.length}</h4>
                      <p className="mb-0">Total Classes</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card text-white" style={{ backgroundColor: APP_COLORS.primary }}>
                    <div className="card-body text-center">
                      <h4>{users.filter(u => u.role === 'lecturer').length}</h4>
                      <p className="mb-0">Total Lecturers</p>
                    </div>
                  </div>
                </div>
              </div>

              <ChartsComponent reports={reports} courses={courses} user={user} />
            </div>
          </div>
        );

      default:
        return (
          <div className="card shadow-sm border-0">
            <div className="card-header text-white" style={{ backgroundColor: APP_COLORS.primary }}>
              <h4 className="mb-0">LUCT Faculty Reporting System</h4>
            </div>
            <div className="card-body">
              <div className="alert text-white" style={{ backgroundColor: APP_COLORS.primary }}>
                Hello, <strong>{user.name}</strong>! (Role: {user.role})
              </div>
              <p>Select a module from the navigation to get started.</p>
              <ChartsComponent reports={reports} courses={courses} user={user} />
            </div>
          </div>
        );
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    switch (page) {
      case "login":
        return (
          <LoginForm 
            loginForm={loginForm}
            handleLoginChange={handleLoginChange}
            handleLoginSubmit={handleLoginSubmit}
            setPage={setPage}
          />
        );
      case "register":
        return (
          <RegisterForm 
            registerForm={registerForm}
            handleRegisterChange={handleRegisterChange}
            handleRegisterSubmit={handleRegisterSubmit}
            setPage={setPage}
          />
        );
      case "reporting":
        return (
          <ReportForm
            reportForm={reportForm}
            handleReportChange={handleReportChange}
            handleReportSubmit={handleReportSubmit}
            user={user}
            classes={classes}
            faculties={faculties}
          />
        );
      case "reports":
        let reportsToShow = reports;
        
        if (user?.role === 'student') {
          reportsToShow = getStudentReports();
        } else if (user?.role === 'lecturer') {
          reportsToShow = lecturerReports;
        } else if (user?.role === 'prl') {
          reportsToShow = prlReports;
        }
        
        return (
          <ReportsList 
            reports={reportsToShow}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            viewReportDetails={viewReportDetails}
            setPage={setPage}
            user={user}
            fetchReports={fetchReports}
          />
        );
      case "courses":
        return (
          <CoursesList 
            courses={courses}
            setPage={setPage}
            user={user}
          />
        );
      case "addCourse":
        return (
          <AddCourseForm 
            courseForm={courseForm}
            handleCourseChange={handleCourseChange}
            handleCourseSubmit={handleCourseSubmit}
            setPage={setPage}
            faculties={faculties}
          />
        );
      case "classes":
        return (
          <ClassesList 
            classes={classes}
            setPage={setPage}
            user={user}
          />
        );
      case "addClass":
        return (
          <AddClassForm 
            classForm={classForm}
            handleClassChange={handleClassChange}
            handleClassSubmit={handleClassSubmit}
            setPage={setPage}
            courses={courses}
            faculties={faculties}
            users={users}
          />
        );
      case "lectures":
        return (
          <LecturesManagement 
            users={users}
            setPage={setPage}
            user={user}
          />
        );
      case "assignCourse":
        return (
          <AssignCourseForm 
            assignCourseForm={assignCourseForm}
            handleAssignCourseChange={handleAssignCourseChange}
            handleAssignCourseSubmit={handleAssignCourseSubmit}
            setPage={setPage}
            courses={courses}
            users={users}
          />
        );
      case "assignLecturer":
        return (
          <AssignLecturerForm 
            assignForm={assignLecturerForm}
            handleAssignChange={handleAssignLecturerChange}
            handleAssignSubmit={handleAssignLecturerSubmit}
            setPage={setPage}
            classes={classes}
            users={users}
          />
        );
      case "rating":
        let ratingReports = reports;
        if (user?.role === 'student') {
          ratingReports = getStudentReports();
        }
        
        return (
          <RatingForm 
            ratingForm={ratingForm}
            handleRatingChange={handleRatingChange}
            handleRatingSubmit={handleRatingSubmit}
            setPage={setPage}
            reports={ratingReports}
            user={user}
          />
        );
      case "feedback":
        return (
          <FeedbackForm 
            feedbackForm={feedbackForm}
            handleFeedbackChange={handleFeedbackChange}
            handleFeedbackSubmit={handleFeedbackSubmit}
            setPage={setPage}
            reports={user?.role === 'prl' ? prlReports : reports}
            user={user}
          />
        );
      default:
        return renderRoleBasedHome();
    }
  };

  return (
    <div className="container-fluid p-0 bg-light min-vh-100">
      {/* Header */}
      <header className="text-white shadow-sm" style={{ backgroundColor: APP_COLORS.primary }}>
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center py-2 px-3">
            <div>
              <h4 className="mb-0">LUCT Faculty Reporting</h4>
              <small className="text-white-50">Learning Management System</small>
            </div>
            {user && (
              <div className="d-flex align-items-center">
                <span className="me-3">
                  <i className="fas fa-user me-1"></i>
                  {user.name} <span className="badge" style={{ backgroundColor: APP_COLORS.secondary }}>{user.role}</span>
                </span>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-1"></i>Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="d-flex">
        {/* Sidebar Navigation */}
        {user && (
          <div className="text-white" style={{ backgroundColor: APP_COLORS.primary, width: '220px', minHeight: 'calc(100vh - 73px)' }}>
            <div className="p-3">
              <h5 className="text-center mb-4 border-bottom pb-2">Navigation Menu</h5>
              <div className="d-flex flex-column gap-2">
                <button 
                  className={`btn w-100 text-start text-white ${page === 'home' ? 'btn-dark' : ''}`}
                  style={{ backgroundColor: page === 'home' ? APP_COLORS.accent : 'transparent' }}
                  onClick={() => setPage("home")}
                >
                  <i className="fas fa-home me-2"></i>Home
                </button>
                
                {/* Role-based navigation */}
                {(user.role === 'lecturer' || user.role === 'prl' || user.role === 'pl') && (
                  <button 
                    className={`btn w-100 text-start text-white ${page === 'reporting' ? 'btn-dark' : ''}`}
                    style={{ backgroundColor: page === 'reporting' ? APP_COLORS.accent : 'transparent' }}
                    onClick={() => navigateToPage("reporting")}
                  >
                    <i className="fas fa-file-alt me-2"></i>Reporting
                  </button>
                )}
                
                <button 
                  className={`btn w-100 text-start text-white ${page === 'reports' ? 'btn-dark' : ''}`}
                  style={{ backgroundColor: page === 'reports' ? APP_COLORS.accent : 'transparent' }}
                  onClick={() => navigateToPage("reports")}
                >
                  <i className="fas fa-list me-2"></i>Reports
                </button>
                
                {/* Classes navigation for relevant roles */}
                {(user.role === 'lecturer' || user.role === 'prl' || user.role === 'pl') && (
                  <button 
                    className={`btn w-100 text-start text-white ${page === 'classes' ? 'btn-dark' : ''}`}
                    style={{ backgroundColor: page === 'classes' ? APP_COLORS.accent : 'transparent' }}
                    onClick={() => navigateToPage("classes")}
                  >
                    <i className="fas fa-users me-2"></i>Classes
                  </button>
                )}
                
                {/* Courses navigation for PRL and PL */}
                {(user.role === 'prl' || user.role === 'pl') && (
                  <button 
                    className={`btn w-100 text-start text-white ${page === 'courses' ? 'btn-dark' : ''}`}
                    style={{ backgroundColor: page === 'courses' ? APP_COLORS.accent : 'transparent' }}
                    onClick={() => navigateToPage("courses")}
                  >
                    <i className="fas fa-book me-2"></i>Courses
                  </button>
                )}
                
                {/* Lectures management for PL only */}
                {user.role === 'pl' && (
                  <button 
                    className={`btn w-100 text-start text-white ${page === 'lectures' ? 'btn-dark' : ''}`}
                    style={{ backgroundColor: page === 'lectures' ? APP_COLORS.accent : 'transparent' }}
                    onClick={() => navigateToPage("lectures")}
                  >
                    <i className="fas fa-chalkboard-teacher me-2"></i>Lectures
                  </button>
                )}
                
                {/* Assign Courses for PL only */}
                {user.role === 'pl' && (
                  <button 
                    className={`btn w-100 text-start text-white ${page === 'assignCourse' ? 'btn-dark' : ''}`}
                    style={{ backgroundColor: page === 'assignCourse' ? APP_COLORS.accent : 'transparent' }}
                    onClick={() => navigateToPage("assignCourse")}
                  >
                    <i className="fas fa-tasks me-2"></i>Assign Courses
                  </button>
                )}
                
                {/* Assign Lecturer for PL only */}
                {user.role === 'pl' && (
                  <button 
                    className={`btn w-100 text-start text-white ${page === 'assignLecturer' ? 'btn-dark' : ''}`}
                    style={{ backgroundColor: page === 'assignLecturer' ? APP_COLORS.accent : 'transparent' }}
                    onClick={() => navigateToPage("assignLecturer")}
                  >
                    <i className="fas fa-user-plus me-2"></i>Assign Lecturer
                  </button>
                )}
                
                {/* Rating for students only */}
                {user.role === 'student' && (
                  <button 
                    className={`btn w-100 text-start text-white ${page === 'rating' ? 'btn-dark' : ''}`}
                    style={{ backgroundColor: page === 'rating' ? APP_COLORS.accent : 'transparent' }}
                    onClick={() => navigateToPage("rating")}
                  >
                    <i className="fas fa-star me-2"></i>Rate Reports
                  </button>
                )}
                
                {/* Feedback for PRL only */}
                {user.role === 'prl' && (
                  <button 
                    className={`btn w-100 text-start text-white ${page === 'feedback' ? 'btn-dark' : ''}`}
                    style={{ backgroundColor: page === 'feedback' ? APP_COLORS.accent : 'transparent' }}
                    onClick={() => navigateToPage("feedback")}
                  >
                    <i className="fas fa-comment me-2"></i>Feedback
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className={`p-4 ${user ? 'flex-grow-1' : 'w-100'}`} style={user ? {width: 'calc(100% - 220px)'} : {}}>
          {renderContent()}
        </main>
      </div>

      {/* Footer */}
      <footer className="text-white text-center py-3 mt-auto" style={{ backgroundColor: APP_COLORS.primary }}>
        <div className="container">
          <small>&copy; 2024 LUCT Faculty Reporting System. All rights reserved.<br />
            Mr Rorisang Justice Molapo - Full Stack Developer.
          </small>
        </div>
      </footer>
    </div>
  );
}

export default App;

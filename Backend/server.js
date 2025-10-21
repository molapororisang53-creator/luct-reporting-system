const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); 

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@123",
    database: "test_schema"
});

let dbConnected = false;
db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err.message);
        dbConnected = false;
    } else {
        console.log('Connected to MySQL database.');
        dbConnected = true;

        // Create student_class_enrollments table if it doesn't exist
        const createTableSql = `
            CREATE TABLE IF NOT EXISTS student_class_enrollments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                class_id INT NOT NULL,
                enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES users(id),
                FOREIGN KEY (class_id) REFERENCES classes(class_id)
            )
        `;
        db.query(createTableSql, (tableErr) => {
            if (tableErr) {
                console.error('Error creating student_class_enrollments table:', tableErr.message);
            } else {
                console.log('student_class_enrollments table is ready.');
            }
        });
    }
});

app.get('/', (req, res) => {
    return res.json("From Backend Side");
});

//  USERS 
app.get('/Users', (req, res) => {
    const sql = "SELECT * FROM users";
    if (!dbConnected) return res.status(500).json({ error: 'Database connection failed.' });
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

app.post('/users', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Database connection failed.' });
    const { username, password, role, name, email } = req.body;
    const sql = 'INSERT INTO users (username, password, role, name, email) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [username, password, role, name, email], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(201).json({ message: 'User inserted', userId: result.insertId });
    });
});

// REPORTS 
// Insert report
app.post('/report', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Database connection failed.' });

    const { user_id } = req.body;
    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // Validate user role
    const checkUserSql = 'SELECT role FROM users WHERE id = ?';
    db.query(checkUserSql, [user_id], (userErr, userResults) => {
        if (userErr) return res.status(500).json({ error: userErr.message });
        if (userResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userRole = userResults[0].role;
        if (!['lecturer', 'prl', 'pl'].includes(userRole)) {
            return res.status(403).json({ error: 'Only lecturers, PRLs, and PLs can create reports' });
        }

        const {
            faculty_name, class_name, week_of_reporting, date_of_lecture, course_name, course_code,
            lecturer_name, actual_students_present, total_registered_students, venue,
            scheduled_time, topic_taught, learning_outcomes, recommendations
        } = req.body;

        const sql = `INSERT INTO reports (
            faculty_name, class_name, week_of_reporting, date_of_lecture, course_name, course_code,
            lecturer_name, actual_students_present, total_registered_students, venue,
            scheduled_time, topic_taught, learning_outcomes, recommendations
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            faculty_name, class_name, week_of_reporting, date_of_lecture, course_name, course_code,
            lecturer_name, actual_students_present, total_registered_students, venue,
            scheduled_time, topic_taught, learning_outcomes, recommendations
        ];

        db.query(sql, values, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.status(201).json({ message: 'Report inserted successfully', reportId: result.insertId });
        });
    });
});

// Delete report
app.delete('/reports/:id', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Database connection failed.' });
    const reportId = req.params.id;
    const sql = 'DELETE FROM reports WHERE id = ?';
    db.query(sql, [reportId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Report not found' });
        return res.json({ message: 'Report deleted successfully' });
    });
});

// FIXED REPORTS ENDPOINT 
app.get('/reports', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Database connection failed.' });
    
    const sql = `
        SELECT 
            r.*, 
            COALESCE(ROUND(AVG(rt.rating_value), 1), 0) as average_rating,
            COUNT(rt.rating_id) as total_ratings,
            EXISTS(SELECT 1 FROM feedback f WHERE f.report_id = r.id) as has_feedback
        FROM reports r
        LEFT JOIN ratings rt ON r.id = rt.report_id
        GROUP BY r.id
        ORDER BY r.date_of_lecture DESC
    `;
    
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error fetching reports:', err);
            return res.status(500).json({ error: err.message });
        }
        return res.json(data);
    });
});

// CLASSES - FIXED ENDPOINTS
app.post('/classes', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Database connection failed.' });
    const { class_name, faculty_id, course_id, schedule, venue, lecturer_id } = req.body;
    const sql = 'INSERT INTO classes (class_name, faculty_id, course_id, scheduled_time, venue, lecturer_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [class_name, faculty_id, course_id, schedule, venue, lecturer_id || null], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(201).json({ message: 'Class inserted', classId: result.insertId });
    });
});

app.get('/classes', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Database connection failed.' });
    const sql = "SELECT class_id as id, class_name, faculty_id, course_id, lecturer_id, venue, scheduled_time as schedule FROM classes";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

// ========== FIXED CLASS-RELATED ENDPOINTS ==========

// FIXED CLASSES WITH LECTURERS ENDPOINT
app.get('/classes-with-lecturers', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Database connection failed.' });
    
    const sql = `
        SELECT 
            c.class_id as id,
            c.class_name,
            c.venue,
            c.scheduled_time as schedule,
            c.faculty_id,
            c.course_id,
            c.lecturer_id,
            u.name as lecturer_name,
            u.email as lecturer_email,
            co.course_name,
            co.course_code,
        f.faculty_name as faculty_name
        FROM classes c
        LEFT JOIN users u ON c.lecturer_id = u.id
        LEFT JOIN courses co ON c.course_id = co.course_id
        LEFT JOIN faculty f ON c.faculty_id = f.faculty_id
        ORDER BY c.class_name
    `;
    
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Database error in /classes-with-lecturers:', err);
            return res.status(500).json({ error: 'Failed to fetch classes' });
        }
        
        console.log(`Returning ${data.length} classes from database`);
        return res.json(data);
    });
});

// ASSIGN LECTURER TO CLASS - FIXED
app.post('/assign-lecturer-to-class', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Database connection failed.' });
    
    const { class_id, lecturer_id } = req.body;

    // Validate input
    if (!class_id || !lecturer_id) {
        return res.status(400).json({ error: 'Class ID and Lecturer ID are required' });
    }

    // Verify the class exists
    const checkClassSql = 'SELECT class_id, class_name FROM classes WHERE class_id = ?';
    db.query(checkClassSql, [class_id], (classErr, classResults) => {
        if (classErr) return res.status(500).json({ error: classErr.message });
        if (classResults.length === 0) {
            return res.status(404).json({ error: 'Class not found' });
        }

        // Verify the lecturer exists and is actually a lecturer
        const checkLecturerSql = 'SELECT id, name, role FROM users WHERE id = ? AND role = "lecturer"';
        db.query(checkLecturerSql, [lecturer_id], (lecturerErr, lecturerResults) => {
            if (lecturerErr) return res.status(500).json({ error: lecturerErr.message });
            if (lecturerResults.length === 0) {
                return res.status(404).json({ error: 'Lecturer not found or user is not a lecturer' });
            }

            // Update the class with the lecturer assignment
            const updateSql = 'UPDATE classes SET lecturer_id = ? WHERE class_id = ?';
            db.query(updateSql, [lecturer_id, class_id], (updateErr, updateResult) => {
                if (updateErr) return res.status(500).json({ error: updateErr.message });

                return res.status(201).json({ 
                    message: 'Lecturer assigned to class successfully', 
                    class: classResults[0].class_name,
                    lecturer: lecturerResults[0].name
                });
            });
        });
    });
});

// REMOVE LECTURER FROM CLASS - FIXED
app.delete('/remove-lecturer-from-class/:class_id', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Database connection failed.' });
    
    const class_id = req.params.class_id;

    // Verify the class exists
    const checkClassSql = 'SELECT class_id, class_name FROM classes WHERE class_id = ?';
    db.query(checkClassSql, [class_id], (classErr, classResults) => {
        if (classErr) return res.status(500).json({ error: classErr.message });
        if (classResults.length === 0) {
            return res.status(404).json({ error: 'Class not found' });
        }

        // Remove lecturer assignment
        const updateSql = 'UPDATE classes SET lecturer_id = NULL WHERE class_id = ?';
        db.query(updateSql, [class_id], (updateErr, updateResult) => {
            if (updateErr) return res.status(500).json({ error: updateErr.message });

            return res.json({ 
                message: 'Lecturer removed from class successfully',
                class: classResults[0].class_name
            });
        });
    });
});

// ========== END OF FIXED CLASS ENDPOINTS ==========

//  COURSES 
app.post('/courses', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Database connection failed.' });
    const { course_name, course_code, faculty_id } = req.body;
    const sql = 'INSERT INTO courses (course_name, course_code, faculty_id) VALUES (?, ?, ?)';
    db.query(sql, [course_name, course_code, faculty_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(201).json({ message: 'Course inserted', courseId: result.insertId });
    });
});

app.get('/courses', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Database connection failed.' });
    const sql = "SELECT course_id, course_name, course_code, faculty_id FROM courses";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

// FACULTY
app.post('/faculty', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Database connection failed.' });
    const { faculty_name, faculty_head } = req.body;
    const sql = 'INSERT INTO faculty (faculty_name, faculty_head) VALUES (?, ?)';
    db.query(sql, [faculty_name, faculty_head], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(201).json({ message: 'Faculty inserted', facultyId: result.insertId });
    });
});

app.get('/faculty', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Database connection failed.' });
    const sql = "SELECT * FROM faculty";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

//  FEEDBACK
app.post('/feedback', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Database connection failed.' });
    const { report_id, feedback_text, prl_id } = req.body;
    const sql = 'INSERT INTO feedback (report_id, feedback_text, prl_id) VALUES (?, ?, ?)';
    db.query(sql, [report_id, feedback_text, prl_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(201).json({ message: 'Feedback inserted', feedbackId: result.insertId });
    });
});

// FIXED
app.get('/feedback/:report_id', (req, res) => {
    const { report_id } = req.params;
    const sql = `
        SELECT f.*, u.name as prl_name 
        FROM feedback f 
        JOIN users u ON f.prl_id = u.id 
        WHERE f.report_id = ?
    `;
    db.query(sql, [report_id], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

//  RATING
app.post('/ratings', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Database connection failed.' });
    const { report_id, rating_value, user_id, comments } = req.body;
    const sql = 'INSERT INTO ratings (report_id, rating_value, user_id, comments) VALUES (?, ?, ?, ?)';
    db.query(sql, [report_id, rating_value, user_id, comments], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(201).json({ message: 'Rating inserted', ratingId: result.insertId });
    });
});

// FIXED
app.get('/ratings/report/:report_id', (req, res) => {
    const { report_id } = req.params;
    const sql = `
        SELECT rt.*, u.name as user_name 
        FROM ratings rt 
        JOIN users u ON rt.user_id = u.id 
        WHERE rt.report_id = ?
    `;
    db.query(sql, [report_id], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

// Simple ratings fetch 
app.get('/ratings/:report_id', (req, res) => {
    const { report_id } = req.params;
    const sql = "SELECT * FROM ratings WHERE report_id = ?";
    db.query(sql, [report_id], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

// LOGIN 
app.post('/login', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Database connection failed.' });
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
        const user = results[0];
        return res.json({ 
            message: 'Login successful', 
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                name: user.name,
                email: user.email
            }
        });
    });
});

// ASSIGN COURSE TO LECTURER
app.post('/assign-course', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Database connection failed.' });
    
    const { lecturer_id, course_id } = req.body;

    // Validate input
    if (!lecturer_id || !course_id) {
        return res.status(400).json({ error: 'Lecturer ID and Course ID are required' });
    }

    // First, verify the lecturer exists and is actually a lecturer
    const checkLecturerSql = 'SELECT id, name, role FROM users WHERE id = ? AND role = "lecturer"';
    db.query(checkLecturerSql, [lecturer_id], (lecturerErr, lecturerResults) => {
        if (lecturerErr) return res.status(500).json({ error: lecturerErr.message });
        if (lecturerResults.length === 0) {
            return res.status(404).json({ error: 'Lecturer not found or user is not a lecturer' });
        }

        // Verify the course exists
        const checkCourseSql = 'SELECT course_id, course_name, course_code FROM courses WHERE course_id = ?';
        db.query(checkCourseSql, [course_id], (courseErr, courseResults) => {
            if (courseErr) return res.status(500).json({ error: courseErr.message });
            if (courseResults.length === 0) {
                return res.status(404).json({ error: 'Course not found' });
            }

            const course = courseResults[0];
            const courseInfo = `${course.course_name} (${course.course_code})`;

            // Check if course is already assigned to this lecturer
            const checkAssignmentSql = 'SELECT assigned_courses FROM users WHERE id = ?';
            db.query(checkAssignmentSql, [lecturer_id], (assignmentErr, assignmentResults) => {
                if (assignmentErr) return res.status(500).json({ error: assignmentErr.message });

                const currentAssignments = assignmentResults[0].assigned_courses || '';
                const assignmentsArray = currentAssignments.split(',').filter(a => a.trim());

                // Check if course is already assigned
                if (assignmentsArray.includes(courseInfo)) {
                    return res.status(400).json({ error: 'Course is already assigned to this lecturer' });
                }

                // Update assigned courses (append to existing)
                const newAssignments = currentAssignments 
                    ? `${currentAssignments}, ${courseInfo}`
                    : courseInfo;

                const updateSql = 'UPDATE users SET assigned_courses = ? WHERE id = ?';
                db.query(updateSql, [newAssignments, lecturer_id], (updateErr, updateResult) => {
                    if (updateErr) return res.status(500).json({ error: updateErr.message });

                    return res.status(201).json({ 
                        message: 'Course assigned successfully', 
                        lecturer: lecturerResults[0].name,
                        course: courseInfo
                    });
                });
            });
        });
    });
});

// STUDENT CLASS ENROLLMENTS
app.post('/student-enrollments', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Database connection failed.' });

    const { student_id, class_id } = req.body;

    // Validate input
    if (!student_id || !class_id) {
        return res.status(400).json({ error: 'Student ID and Class ID are required' });
    }

    // Check if student is already enrolled
    const checkEnrollmentSql = 'SELECT id FROM student_class_enrollments WHERE student_id = ? AND class_id = ?';
    db.query(checkEnrollmentSql, [student_id, class_id], (checkErr, checkResults) => {
        if (checkErr) return res.status(500).json({ error: checkErr.message });
        if (checkResults.length > 0) {
            return res.status(400).json({ error: 'Student is already enrolled in this class' });
        }

        // Insert enrollment
        const sql = 'INSERT INTO student_class_enrollments (student_id, class_id, enrollment_date) VALUES (?, ?, NOW())';
        db.query(sql, [student_id, class_id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.status(201).json({ message: 'Student enrolled successfully', enrollmentId: result.insertId });
        });
    });
});

app.get('/student-enrollments/:student_id', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Database connection failed.' });

    const student_id = req.params.student_id;
    const sql = `
        SELECT sce.*, c.class_name, c.venue, c.scheduled_time as schedule,
               co.course_name, co.course_code, f.faculty_name,
               u.name as lecturer_name
        FROM student_class_enrollments sce
        JOIN classes c ON sce.class_id = c.class_id
        LEFT JOIN courses co ON c.course_id = co.course_id
        LEFT JOIN faculty f ON c.faculty_id = f.faculty_id
        LEFT JOIN users u ON c.lecturer_id = u.id
        WHERE sce.student_id = ?
        ORDER BY sce.enrollment_date DESC
    `;

    db.query(sql, [student_id], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

app.delete('/student-enrollments/:enrollment_id', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Database connection failed.' });

    const enrollment_id = req.params.enrollment_id;
    const sql = 'DELETE FROM student_class_enrollments WHERE id = ?';

    db.query(sql, [enrollment_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Enrollment not found' });
        return res.json({ message: 'Student unenrolled successfully' });
    });
});

// START SERVER
app.listen(8081, () => {
    console.log("Listening");
});

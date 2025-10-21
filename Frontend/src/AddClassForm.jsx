import React, { useEffect, useState } from 'react';

const AddClassForm = ({ 
  classForm, 
  handleClassChange, 
  handleClassSubmit, 
  setPage, 
  courses, 
  faculties, 
  users
}) => {
  const lecturers = users.filter(user => user.role === 'lecturer');

  return (
    <div className="card p-4">
      <h3>Add New Class</h3>
      
      <form onSubmit={handleClassSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Class Name *</label>
              <input 
                type="text" 
                className="form-control" 
                name="class_name"
                value={classForm.class_name}
                onChange={handleClassChange}
                placeholder="e.g., BSc SE Year 1"
                required 
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Faculty *</label>
              <select 
                className={`form-select ${!faculties || faculties.length === 0 ? 'is-invalid' : ''}`}
                name="faculty_id"
                value={classForm.faculty_id}
                onChange={handleClassChange}
                required
                disabled={!faculties || faculties.length === 0}
              >
                <option value="">Select Faculty</option>
                {faculties && faculties.length > 0 ? (
                  faculties.map(faculty => (
                    <option key={faculty.faculty_id} value={faculty.faculty_id}>
                      {faculty.name} {faculty.faculty_id ? `(ID: ${faculty.faculty_id})` : ''}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No faculties available - Please add faculties first</option>
                )}
              </select>
              {(!faculties || faculties.length === 0) && (
                <div className="invalid-feedback d-block">
                  No faculties found. Please add faculties first.
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Course *</label>
              <select 
                className={`form-select ${!courses || courses.length === 0 ? 'is-invalid' : ''}`}
                name="course_id"
                value={classForm.course_id}
                onChange={handleClassChange}
                required
                disabled={!courses || courses.length === 0}
              >
                <option value="">Select Course</option>
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
              {(!courses || courses.length === 0) && (
                <div className="invalid-feedback">
                  No courses available. Please add courses first.
                </div>
              )}
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Assign Lecturer</label>
              <select 
                className="form-select" 
                name="lecturer_id"
                value={classForm.lecturer_id}
                onChange={handleClassChange}
                disabled={!lecturers || lecturers.length === 0}
              >
                <option value="">Select Lecturer (Optional)</option>
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
              <small className="text-muted">You can assign a lecturer now or later</small>
            </div>
          </div>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Venue *</label>
          <input 
            type="text" 
            className="form-control" 
            name="venue"
            value={classForm.venue}
            onChange={handleClassChange}
            placeholder="e.g., Lab 101, Room 201"
            required 
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Schedule *</label>
          <input 
            type="text" 
            className="form-control" 
            name="schedule"
            value={classForm.schedule}
            onChange={handleClassChange}
            placeholder="e.g., Monday 10:00-12:00, Wednesday 14:00-16:00"
            required 
          />
        </div>
        
        <div className="d-flex gap-2">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!faculties || faculties.length === 0 || !courses || courses.length === 0}
          >
            Add Class
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setPage('classes')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClassForm;
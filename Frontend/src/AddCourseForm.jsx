import React from 'react';

const AddCourseForm = ({ courseForm, handleCourseChange, handleCourseSubmit, setPage, faculties }) => {
  return (
    <div className="card p-4">
      <h3>Add New Course</h3>
      
      <form onSubmit={handleCourseSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Course Name *</label>
              <input 
                type="text" 
                className="form-control" 
                name="course_name"
                value={courseForm.course_name}
                onChange={handleCourseChange}
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
                value={courseForm.course_code}
                onChange={handleCourseChange}
                required 
              />
            </div>
          </div>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Faculty *</label>
          <select 
            className="form-select" 
            name="faculty_id"
            value={courseForm.faculty_id}
            onChange={handleCourseChange}
            required
          >
            <option value="">Select Faculty</option>
            {faculties && faculties.length > 0 ? (
              faculties.map(faculty => (
                <option key={faculty.faculty_id} value={faculty.faculty_id}>
                  {faculty.name} (ID: {faculty.faculty_id})
                </option>
              ))
            ) : (
              <option value="" disabled>No faculties available</option>
            )}
          </select>
          <small className="text-muted">Available faculties: {faculties ? faculties.length : 0}</small>
        </div>
        
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">Add Course</button>
          <button type="button" className="btn btn-secondary" onClick={() => setPage('courses')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourseForm;
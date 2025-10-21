import React from 'react';

const RegisterForm = ({ registerForm, handleRegisterChange, handleRegisterSubmit, setPage }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register form submitted:', registerForm);
    handleRegisterSubmit(e);
  };

  return (
    <div className="card p-4" style={{maxWidth: 500, margin: '0 auto'}}>
      <h3 className="mb-3">Register</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="reg-username" className="form-label">Username *</label>
          <input 
            type="text" 
            className="form-control" 
            id="reg-username" 
            name="username" 
            value={registerForm.username} 
            onChange={handleRegisterChange} 
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="reg-password" className="form-label">Password *</label>
          <input 
            type="password" 
            className="form-control" 
            id="reg-password" 
            name="password" 
            value={registerForm.password} 
            onChange={handleRegisterChange} 
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="reg-role" className="form-label">Role *</label>
          <select 
            className="form-select" 
            id="reg-role" 
            name="role" 
            value={registerForm.role} 
            onChange={handleRegisterChange} 
            required
          >
            <option value="">Select role</option>
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
            <option value="prl">Principal Lecturer</option>
            <option value="pl">Program Leader</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="reg-name" className="form-label">Full Name *</label>
          <input 
            type="text" 
            className="form-control" 
            id="reg-name" 
            name="name" 
            value={registerForm.name} 
            onChange={handleRegisterChange} 
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="reg-email" className="form-label">Email *</label>
          <input 
            type="email" 
            className="form-control" 
            id="reg-email" 
            name="email" 
            value={registerForm.email} 
            onChange={handleRegisterChange} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-success w-100">
          Register
        </button>
      </form>
      <div className="mt-3 text-center">
        <button className="btn btn-link" onClick={() => setPage('login')}>
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
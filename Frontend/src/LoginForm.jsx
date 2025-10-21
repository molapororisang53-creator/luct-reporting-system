
import React from 'react';

const LoginForm = ({ loginForm, handleLoginChange, handleLoginSubmit, setPage }) => {
  return (
    <div className="card p-4" style={{maxWidth: 400, margin: '0 auto'}}>
      <h3 className="mb-3">Login</h3>
      <form onSubmit={handleLoginSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input 
            type="text" 
            className="form-control" 
            id="username" 
            name="username" 
            value={loginForm.username} 
            onChange={handleLoginChange} 
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control" 
            id="password" 
            name="password" 
            value={loginForm.password} 
            onChange={handleLoginChange} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
      <div className="mt-3 text-center">
        <button className="btn btn-link" onClick={() => setPage('register')}>
          Don't have an account? Register
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
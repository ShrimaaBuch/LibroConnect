// ============================================================
// Login.jsx – User Login Page
// ============================================================
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', formData);
      login(res.data.user, res.data.token);
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="auth-card card">

              {/* Card Header */}
              <div className="auth-header">
                <h2 className="mb-1">Welcome Back</h2>
                <p className="mb-0 small" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Sign in to LibroConnect
                </p>
              </div>

              {/* Card Body */}
              <div className="card-body p-4">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center py-2" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <small>{error}</small>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control border-start-0"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold small">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock text-muted"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control border-start-0"
                        name="password"
                        placeholder="Your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn w-100 fw-semibold"
                    style={{ background: '#e94560', color: 'white', padding: '10px' }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing in...
                      </>
                    ) : (
                      <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>
                    )}
                  </button>
                </form>

                <p className="text-center mt-3 mb-0 small">
                  Don't have an account?{' '}
                  <Link to="/register" style={{ color: '#e94560', fontWeight: 600 }}>
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
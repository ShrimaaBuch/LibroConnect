// ============================================================
// Register.jsx – User Registration Page
// ============================================================
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'user',
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  // ── Client-side validation ──────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim())          newErrors.name = 'Name is required';
    if (!formData.email.trim())         newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password)             newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="auth-card card">

              <div className="auth-header">
                <div style={{ fontSize: '3rem' }}></div>
                <h2 className="mb-1">Join LibroConnect</h2>
                <p className="mb-0 small" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Create your free account
                </p>
              </div>

              <div className="card-body p-4">
                {apiError && (
                  <div className="alert alert-danger py-2 d-flex align-items-center">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <small>{apiError}</small>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-person text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control border-start-0 ${errors.name ? 'is-invalid' : ''}`}
                        name="name"
                        placeholder="Shrimaa Buch"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        className={`form-control border-start-0 ${errors.email ? 'is-invalid' : ''}`}
                        name="email"
                        placeholder="shrimaabuch@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock text-muted"></i>
                      </span>
                      <input
                        type="password"
                        className={`form-control border-start-0 ${errors.password ? 'is-invalid' : ''}`}
                        name="password"
                        placeholder="Min. 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Confirm Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-shield-lock text-muted"></i>
                      </span>
                      <input
                        type="password"
                        className={`form-control border-start-0 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        name="confirmPassword"
                        placeholder="Repeat password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>
                  </div>

                  {/* Role */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold small">Account Type</label>
                    <select
                      className="form-select"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="user">👤 User</option>
                      <option value="admin">🛡️ Admin</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 fw-semibold"
                    style={{ background: '#e94560', color: 'white', padding: '10px' }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Creating Account...
                      </>
                    ) : (
                      <><i className="bi bi-person-plus me-2"></i>Create Account</>
                    )}
                  </button>
                </form>

                <p className="text-center mt-3 mb-0 small">
                  Already have an account?{' '}
                  <Link to="/login" style={{ color: '#e94560', fontWeight: 600 }}>Sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

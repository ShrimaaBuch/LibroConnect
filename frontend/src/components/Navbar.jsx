// ============================================================
// Navbar.jsx – Top Navigation Bar
// ============================================================
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to check active link
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand" to="/">
          <i className="bi bi-book-half me-2"></i>LibroConnect
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{ color: '#ccc' }}
        >
          <i className="bi bi-list fs-4"></i>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-1">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">
                <i className="bi bi-house-door me-1"></i>Library
              </Link>
            </li>

            {user && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/my-books')}`} to="/my-books">
                    <i className="bi bi-bookmark-check me-1"></i>My Books
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/share')}`} to="/share">
                    <i className="bi bi-share me-1"></i>Share
                  </Link>
                </li>
              </>
            )}

            {isAdmin && (
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/admin')}`} to="/admin">
                  <i className="bi bi-speedometer2 me-1"></i>Admin
                </Link>
              </li>
            )}

            {/* Auth Buttons */}
            {user ? (
              <li className="nav-item dropdown ms-2">
                <button
                  className="btn btn-sm dropdown-toggle"
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', padding: '6px 16px' }}
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {user.name.split(' ')[0]}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <span className="dropdown-item-text text-muted small">
                      {user.email}
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item ms-2">
                  <Link className="btn btn-sm btn-outline-light rounded-pill px-3" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-1">
                  <Link className="btn btn-sm rounded-pill px-3" style={{ background: '#e94560', color: 'white', border: 'none' }} to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

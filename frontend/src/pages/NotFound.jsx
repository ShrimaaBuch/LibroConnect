// ============================================================
// NotFound.jsx – 404 Page
// ============================================================
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
      <div className="text-center text-white">
        <div style={{ fontSize: '8rem', lineHeight: 1 }}></div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '5rem', color: '#e94560' }}>404</h1>
        <h3 className="mb-3">Page Not Found</h3>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn rounded-pill px-5 mt-3" style={{ background: '#e94560', color: 'white' }}>
          <i className="bi bi-house me-2"></i>Back to Library
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

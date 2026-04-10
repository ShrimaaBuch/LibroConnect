// ============================================================
// Footer.jsx – Site Footer
// ============================================================
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-4 mb-3 mb-md-0">
            <h5 style={{ fontFamily: 'Playfair Display, serif', color: '#e94560' }}>
              <i className="bi bi-book-half me-2"></i>LibroConnect
            </h5>
            <p className="small mb-0">Social Reading & Bookstore Platform</p>
          </div>
          <div className="col-md-4 mb-3 mb-md-0 text-center">
            <div className="d-flex justify-content-center gap-3">
              <Link to="/" className="text-decoration-none" style={{ color: 'rgba(255,255,255,0.6)' }}>Library</Link>
              <Link to="/my-books" className="text-decoration-none" style={{ color: 'rgba(255,255,255,0.6)' }}>My Books</Link>
              <Link to="/share" className="text-decoration-none" style={{ color: 'rgba(255,255,255,0.6)' }}>Share</Link>
            </div>
          </div>
          <div className="col-md-4 text-md-end">
            <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Built By Shrimaa Buch
            </p>
            <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.4)' }}>
              AWT Project © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

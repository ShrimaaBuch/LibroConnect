// ============================================================
// BookCard.jsx – Reusable Book Display Card
// ============================================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';

const BookCard = ({ book, onAlert }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Extract data from Google Books API structure
  const info       = book.volumeInfo || {};
  const title      = info.title || 'Unknown Title';
  const authors    = info.authors ? info.authors.join(', ') : 'Unknown Author';
  const thumbnail  = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || 'https://via.placeholder.com/128x192?text=No+Cover';
  const bookId     = book.id;
  const description = info.description
    ? info.description.replace(/<[^>]+>/g, '').slice(0, 120) + '...'
    : 'No description available.';

  // ── Issue Book ──────────────────────────────────────────
  const handleIssue = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.post('/issues', {
        bookId,
        bookTitle: title,
        bookAuthor: authors,
        bookThumbnail: thumbnail,
      });
      onAlert({ type: 'success', msg: `"${title}" issued successfully! Return within 14 days.` });
    } catch (err) {
      onAlert({ type: 'danger', msg: err.response?.data?.message || 'Could not issue book.' });
    }
  };

  // ── Join Reading Circle ─────────────────────────────────
  const handleReadingCircle = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Navigate to Reading Circle page with book info in state
    navigate(`/reading-circle/${bookId}`, {
      state: { bookTitle: title, bookAuthor: authors, bookThumbnail: thumbnail },
    });
  };

  return (
    <div className="col-6 col-sm-4 col-md-3 col-xl-2 mb-4">
      <div className="book-card card h-100">
        {/* Book Cover */}
        <img
          src={thumbnail}
          alt={title}
          className="card-img-top"
          style={{ height: '200px', objectFit: 'cover' }}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/128x192?text=No+Cover'; }}
        />

        <div className="card-body d-flex flex-column p-3">
          {/* Title */}
          <h6 className="card-title mb-1">{title}</h6>
          {/* Author */}
          <p className="card-text text-muted small mb-2">
            <i className="bi bi-person me-1"></i>{authors}
          </p>
          {/* Description */}
          <p className="card-text small text-muted d-none d-md-block" style={{ fontSize: '0.78rem' }}>
            {description}
          </p>

          {/* Action Buttons */}
          <div className="mt-auto d-flex flex-column gap-2">
            <button className="btn-issue btn w-100" onClick={handleIssue}>
              <i className="bi bi-bookmark-plus me-1"></i>Issue Book
            </button>
            <button className="btn-circle btn w-100" onClick={handleReadingCircle}>
              <i className="bi bi-chat-dots me-1"></i>Reading Circle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;

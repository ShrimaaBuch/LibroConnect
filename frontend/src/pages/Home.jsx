// ============================================================
// Home.jsx – Library Page (Google Books API Integration)
// ============================================================
import React, { useState, useEffect, useCallback } from 'react';
import BookCard from '../components/BookCard.jsx';
import AlertToast from '../components/AlertToast.jsx';

// Google Books API – no key required for basic usage (40 req/day free)
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

// Default search categories to show on load
const DEFAULT_QUERIES = ['bestseller fiction', 'classic literature', 'science technology'];

const Home = () => {
  const [books, setBooks]         = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputVal, setInputVal]   = useState('');
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [alert, setAlert]         = useState(null);
  const [activeCategory, setActiveCategory] = useState('bestseller fiction');

  // Categories for quick filter
  const categories = [
    { label: ' Bestsellers', query: 'bestseller fiction' },
    { label: ' Classics',    query: 'classic literature' },
    { label: ' Science',     query: 'science technology' },
    { label: ' History',    query: 'world history' },
    { label: ' Self Help',   query: 'self improvement' },
    { label: ' Programming', query: 'programming computer science' },
  ];

  // ── Fetch books from Google Books API ──────────────────
  const fetchBooks = useCallback(async (query) => {
    setLoading(true);
    setError('');
    try {
      const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=24&printType=books&langRestrict=en`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        setBooks(data.items);
      } else {
        setBooks([]);
        setError(`No books found for "${query}". Try a different search.`);
      }
    } catch (err) {
      setError('Unable to load books. Please check your internet connection.');
      console.error('Google Books API error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load default books on component mount
  useEffect(() => {
    fetchBooks(activeCategory);
  }, [fetchBooks, activeCategory]);

  // ── Handle Search Form Submit ───────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchTerm(inputVal.trim());
      setActiveCategory('');
      fetchBooks(inputVal.trim());
    }
  };

  // ── Handle Category Click ───────────────────────────────
  const handleCategory = (query) => {
    setActiveCategory(query);
    setInputVal('');
    setSearchTerm('');
    fetchBooks(query);
  };

  return (
    <div>
      {/* ── Alert Toast ── */}
      <AlertToast alert={alert} onClose={() => setAlert(null)} />

      {/* ── Hero Section ── */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <p className="text-uppercase small mb-2" style={{ color: '#e94560', letterSpacing: '2px', fontWeight: 600 }}>
                 Welcome to LibroConnect
              </p>
              <h1 className="hero-title mb-3">
                Discover, Read &<br />
                <span style={{ color: '#e94560' }}>Connect</span> with Books
              </h1>
              <p className="hero-subtitle mb-4">
                Browse thousands of books, issue them, join reading circles, and share your knowledge with the community.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch}>
                <div className="search-wrapper">
                  <input
                    type="text"
                    placeholder="Search by title, author, or topic..."
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                  />
                  <button type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>
            </div>

            <div className="col-lg-5 d-none d-lg-flex justify-content-center mt-4 mt-lg-0">
              <div style={{ fontSize: '10rem', opacity: 0.15, userSelect: 'none' }}>📚</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="container py-5">

        {/* Category Filter Pills */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat.query}
              className={`btn btn-sm rounded-pill ${activeCategory === cat.query ? 'btn-danger' : 'btn-outline-secondary'}`}
              onClick={() => handleCategory(cat.query)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Section Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="section-title mb-1">
              {searchTerm ? `Results for "${searchTerm}"` : categories.find(c => c.query === activeCategory)?.label || 'Books'}
            </h2>
            <div className="section-divider"></div>
          </div>
          {!loading && (
            <span className="badge bg-secondary rounded-pill">
              {books.length} books found
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="spinner-wrapper">
            <div className="text-center">
              <div className="spinner-border" style={{ color: '#e94560', width: '3rem', height: '3rem' }} role="status"></div>
              <p className="mt-3 text-muted">Fetching books from Google Books...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="alert alert-warning d-flex align-items-center">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {/* Books Grid */}
        {!loading && !error && (
          <div className="row g-3">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onAlert={setAlert}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && books.length === 0 && (
          <div className="text-center py-5">
            <div style={{ fontSize: '5rem' }}>📭</div>
            <h4 className="text-muted mt-3">No books found</h4>
            <p className="text-muted">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

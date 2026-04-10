// ============================================================
// MyBooks.jsx – User's Issued Books Page
// ============================================================
import React, { useState, useEffect } from 'react';
import api from '../utils/api.js';
import AlertToast from '../components/AlertToast.jsx';

const MyBooks = () => {
  const [issues, setIssues]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert]     = useState(null);

  // Fetch user's issued books on mount
  const fetchMyBooks = async () => {
    try {
      const res = await api.get('/issues/mybooks');
      setIssues(res.data);
    } catch (err) {
      setAlert({ type: 'danger', msg: 'Failed to load your books.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  // ── Return a Book ────────────────────────────────────────
  const handleReturn = async (issueId) => {
    if (!window.confirm('Mark this book as returned?')) return;
    try {
      await api.put(`/issues/${issueId}/return`);
      setAlert({ type: 'success', msg: 'Book returned successfully!' });
      fetchMyBooks(); // Refresh list
    } catch (err) {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Return failed.' });
    }
  };

  // Helper: format date nicely
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  // Helper: check if overdue
  const isOverdue = (returnDate, status) => {
    return status === 'issued' && new Date(returnDate) < new Date();
  };

  // Stats
  const activeCount   = issues.filter(i => i.status === 'issued').length;
  const returnedCount = issues.filter(i => i.status === 'returned').length;

  return (
    <div className="container py-5">
      <AlertToast alert={alert} onClose={() => setAlert(null)} />

      {/* Page Header */}
      <div className="mb-4">
        <h2 className="section-title mb-1">
          <i className="bi bi-bookmark-check me-2" style={{ color: '#e94560' }}></i>
          My Issued Books
        </h2>
        <div className="section-divider"></div>
        <p className="text-muted">Track your issued books and return them on time.</p>
      </div>

      {/* Stats Row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 text-center p-3" style={{ background: '#fff3cd', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem' }}></div>
            <div className="fw-bold fs-4">{issues.length}</div>
            <small className="text-muted">Total Issued</small>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 text-center p-3" style={{ background: '#d1e7dd', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem' }}></div>
            <div className="fw-bold fs-4">{activeCount}</div>
            <small className="text-muted">Currently Active</small>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 text-center p-3" style={{ background: '#f8d7da', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem' }}></div>
            <div className="fw-bold fs-4">{returnedCount}</div>
            <small className="text-muted">Returned</small>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="spinner-wrapper">
          <div className="spinner-border" style={{ color: '#e94560' }} role="status"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && issues.length === 0 && (
        <div className="text-center py-5">
          <div style={{ fontSize: '5rem' }}></div>
          <h4 className="text-muted mt-3">No books issued yet</h4>
          <p className="text-muted">Go to the Library and issue a book!</p>
          <a href="/" className="btn btn-danger mt-2 rounded-pill px-4">
            <i className="bi bi-book me-2"></i>Browse Library
          </a>
        </div>
      )}

      {/* Books Table */}
      {!loading && issues.length > 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 issued-books-table">
                <thead>
                  <tr>
                    <th className="ps-3">#</th>
                    <th>Cover</th>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>Issue Date</th>
                    <th>Return By</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue, idx) => {
                    const overdue = isOverdue(issue.returnDate, issue.status);
                    return (
                      <tr key={issue._id}>
                        <td className="ps-3 align-middle text-muted small">{idx + 1}</td>
                        <td className="align-middle">
                          {issue.bookThumbnail ? (
                            <img
                              src={issue.bookThumbnail}
                              alt={issue.bookTitle}
                              style={{ width: '40px', height: '55px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                          ) : (
                            <div style={{ width: '40px', height: '55px', background: '#eee', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <i className="bi bi-book text-muted"></i>
                            </div>
                          )}
                        </td>
                        <td className="align-middle fw-semibold" style={{ maxWidth: '200px' }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {issue.bookTitle}
                          </div>
                        </td>
                        <td className="align-middle text-muted small">{issue.bookAuthor}</td>
                        <td className="align-middle small">{formatDate(issue.issueDate)}</td>
                        <td className="align-middle small">
                          <span className={overdue ? 'text-danger fw-semibold' : ''}>
                            {overdue && <i className="bi bi-exclamation-circle me-1"></i>}
                            {formatDate(issue.returnDate)}
                          </span>
                        </td>
                        <td className="align-middle">
                          {overdue ? (
                            <span className="badge badge-overdue text-white">Overdue</span>
                          ) : issue.status === 'issued' ? (
                            <span className="badge badge-issued text-white">Issued</span>
                          ) : (
                            <span className="badge badge-returned text-white">Returned</span>
                          )}
                        </td>
                        <td className="align-middle">
                          {issue.status === 'issued' && (
                            <button
                              className="btn btn-sm btn-outline-success rounded-pill"
                              onClick={() => handleReturn(issue._id)}
                            >
                              <i className="bi bi-arrow-return-left me-1"></i>Return
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooks;

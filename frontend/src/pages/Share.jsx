// ============================================================
// Share.jsx – Share Notes & Resources Page
// ============================================================
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';
import AlertToast from '../components/AlertToast.jsx';

const Share = () => {
  const { user } = useAuth();

  const [shares, setShares]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    title: '', description: '', resourceType: 'note',
    bookTitle: '', content: '', tags: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // ── Fetch all shared resources ───────────────────────────
  const fetchShares = async () => {
    try {
      const res = await api.get('/share');
      setShares(res.data);
    } catch (err) {
      setAlert({ type: 'danger', msg: 'Failed to load resources.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchShares(); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  // ── Validate form ────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!formData.title.trim())       errs.title = 'Title is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.content.trim())     errs.content = 'Content is required';
    return errs;
  };

  // ── Submit Share ─────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }

    setSubmitting(true);
    try {
      await api.post('/share', formData);
      setAlert({ type: 'success', msg: 'Resource shared successfully! ' });
      setFormData({ title: '', description: '', resourceType: 'note', bookTitle: '', content: '', tags: '' });
      setShowForm(false);
      fetchShares();
    } catch (err) {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Failed to share.' });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete Resource ──────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) return;
    try {
      await api.delete(`/share/${id}`);
      setAlert({ type: 'success', msg: 'Resource deleted.' });
      fetchShares();
    } catch (err) {
      setAlert({ type: 'danger', msg: 'Delete failed.' });
    }
  };

  const typeColors = {
    note: 'primary', summary: 'success', review: 'warning', resource: 'info',
  };
  const typeIcons = {
    note: 'bi-sticky', summary: 'bi-list-check', review: 'bi-star', resource: 'bi-link-45deg',
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div className="container py-5">
      <AlertToast alert={alert} onClose={() => setAlert(null)} />

      {/* Header */}
      <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="section-title mb-1">
            <i className="bi bi-share me-2" style={{ color: '#e94560' }}></i>
            Community Resources
          </h2>
          <div className="section-divider"></div>
          <p className="text-muted">Share notes, summaries, reviews, and resources with the community.</p>
        </div>
        {user && (
          <button
            className="btn btn-danger rounded-pill px-4"
            onClick={() => setShowForm(!showForm)}
          >
            <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'} me-2`}></i>
            {showForm ? 'Cancel' : 'Share Something'}
          </button>
        )}
      </div>

      {/* ── Share Form (toggle) ── */}
      {showForm && user && (
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px', borderLeft: '4px solid #e94560' }}>
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-upload me-2 text-danger"></i>
              Upload New Resource
            </h5>
            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                {/* Title */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Title *</label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
                    name="title"
                    placeholder="e.g., Chapter 1 Summary"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
                </div>

                {/* Resource Type */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold small">Type</label>
                  <select className="form-select" name="resourceType" value={formData.resourceType} onChange={handleChange}>
                    <option value="note"> Note</option>
                    <option value="summary"> Summary</option>
                    <option value="review"> Review</option>
                    <option value="resource"> Resource</option>
                  </select>
                </div>

                {/* Related Book */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold small">Related Book</label>
                  <input
                    type="text"
                    className="form-control"
                    name="bookTitle"
                    placeholder="Book title (optional)"
                    value={formData.bookTitle}
                    onChange={handleChange}
                  />
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label fw-semibold small">Description *</label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                    name="description"
                    placeholder="Brief description of your resource"
                    value={formData.description}
                    onChange={handleChange}
                  />
                  {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
                </div>

                {/* Content */}
                <div className="col-12">
                  <label className="form-label fw-semibold small">Content *</label>
                  <textarea
                    className={`form-control ${formErrors.content ? 'is-invalid' : ''}`}
                    name="content"
                    rows="5"
                    placeholder="Paste your notes, summary, or resource content here..."
                    value={formData.content}
                    onChange={handleChange}
                  ></textarea>
                  {formErrors.content && <div className="invalid-feedback">{formErrors.content}</div>}
                </div>

                {/* Tags */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Tags (comma-separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tags"
                    placeholder="e.g., fiction, classic, summary"
                    value={formData.tags}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <button type="submit" className="btn btn-danger rounded-pill px-4" disabled={submitting}>
                    {submitting
                      ? <><span className="spinner-border spinner-border-sm me-2"></span>Sharing...</>
                      : <><i className="bi bi-cloud-upload me-2"></i>Share Resource</>
                    }
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="spinner-wrapper">
          <div className="spinner-border" style={{ color: '#e94560' }} role="status"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && shares.length === 0 && (
        <div className="text-center py-5">
          <div style={{ fontSize: '5rem' }}></div>
          <h4 className="text-muted mt-3">No resources shared yet</h4>
          <p className="text-muted">Be the first to share something with the community!</p>
        </div>
      )}

      {/* ── Shared Resources Grid ── */}
      <div className="row g-4">
        {shares.map((share) => (
          <div key={share._id} className="col-md-6 col-lg-4">
            <div className="share-card card h-100 p-3">
              {/* Header */}
              <div className="d-flex align-items-start justify-content-between mb-2">
                <span className={`badge bg-${typeColors[share.resourceType] || 'secondary'} rounded-pill`}>
                  <i className={`bi ${typeIcons[share.resourceType] || 'bi-file'} me-1`}></i>
                  {share.resourceType}
                </span>
                {user && user.name === share.userName && (
                  <button
                    className="btn btn-sm btn-link text-danger p-0"
                    onClick={() => handleDelete(share._id)}
                    title="Delete"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </div>

              {/* Title */}
              <h6 className="fw-bold mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                {share.title}
              </h6>

              {/* Book reference */}
              {share.bookTitle && (
                <p className="small text-muted mb-1">
                  <i className="bi bi-book me-1"></i>{share.bookTitle}
                </p>
              )}

              {/* Description */}
              <p className="small text-muted mb-2">{share.description}</p>

              {/* Content Preview */}
              <div className="p-2 rounded mb-3" style={{ background: '#f8f9fa', fontSize: '0.8rem', maxHeight: '80px', overflow: 'hidden' }}>
                {share.content}
              </div>

              {/* Tags */}
              {share.tags && share.tags.length > 0 && (
                <div className="d-flex flex-wrap gap-1 mb-2">
                  {share.tags.map((tag, i) => (
                    <span key={i} className="badge bg-light text-secondary border" style={{ fontSize: '0.7rem' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="mt-auto d-flex align-items-center justify-content-between pt-2 border-top">
                <span className="small text-muted">
                  <i className="bi bi-person-circle me-1"></i>{share.userName}
                </span>
                <span className="small text-muted">{formatDate(share.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Share;

// ============================================================
// AdminDashboard.jsx – Admin Control Panel
// ============================================================
import React, { useState, useEffect } from 'react';
import api from '../utils/api.js';
import AlertToast from '../components/AlertToast.jsx';

const AdminDashboard = () => {
  const [stats, setStats]     = useState(null);
  const [users, setUsers]     = useState([]);
  const [issues, setIssues]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [alert, setAlert]     = useState(null);

  // Fetch all admin data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, issuesRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/issues'),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setIssues(issuesRes.data);
      } catch (err) {
        setAlert({ type: 'danger', msg: 'Failed to load admin data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Delete user
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Delete user "${userName}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      setAlert({ type: 'success', msg: `User "${userName}" deleted.` });
    } catch (err) {
      setAlert({ type: 'danger', msg: 'Delete failed.' });
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  if (loading) {
    return (
      <div className="spinner-wrapper min-vh-100">
        <div className="text-center">
          <div className="spinner-border" style={{ color: '#e94560', width: '3rem', height: '3rem' }} role="status"></div>
          <p className="mt-3 text-muted">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-4">
      <AlertToast alert={alert} onClose={() => setAlert(null)} />

      {/* Header */}
      <div className="mb-4">
        <h2 className="section-title mb-1">
          <i className="bi bi-speedometer2 me-2" style={{ color: '#e94560' }}></i>
          Admin Dashboard
        </h2>
        <div className="section-divider"></div>
        <p className="text-muted">Manage users, issued books, and platform overview.</p>
      </div>

      {/* ── Stats Cards ── */}
      {stats && (
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #e94560, #c73652)' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 small" style={{ opacity: 0.8 }}>Total Users</p>
                  <div className="stat-value">{stats.totalUsers}</div>
                </div>
                <i className="stat-icon bi bi-people"></i>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 small" style={{ opacity: 0.8 }}>Active Issues</p>
                  <div className="stat-value">{stats.totalIssued}</div>
                </div>
                <i className="stat-icon bi bi-bookmark-check"></i>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #28a745, #1e7e34)' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 small" style={{ opacity: 0.8 }}>Books Returned</p>
                  <div className="stat-value">{stats.totalReturned}</div>
                </div>
                <i className="stat-icon bi bi-arrow-return-left"></i>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'overview' ? 'active fw-semibold' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="bi bi-grid me-1"></i>Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active fw-semibold' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="bi bi-people me-1"></i>Users
            <span className="badge bg-secondary ms-1">{users.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'issues' ? 'active fw-semibold' : ''}`}
            onClick={() => setActiveTab('issues')}
          >
            <i className="bi bi-bookmark-check me-1"></i>Issued Books
            <span className="badge bg-danger ms-1">{issues.length}</span>
          </button>
        </li>
      </ul>

      {/* ── Overview Tab ── */}
      {activeTab === 'overview' && (
        <div className="row g-4">
          {/* Recent Users */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0 pt-3 px-4">
                <h6 className="fw-bold mb-0"><i className="bi bi-people me-2 text-danger"></i>Recent Users</h6>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  {users.slice(0, 6).map(u => (
                    <li key={u._id} className="list-group-item d-flex align-items-center gap-3 px-4">
                      <div className="rounded-circle d-flex align-items-center justify-content-center text-white"
                        style={{ width: '38px', height: '38px', background: '#e94560', flexShrink: 0, fontWeight: 700 }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold small">{u.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{u.email}</div>
                      </div>
                      <span className={`badge rounded-pill ${u.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                        {u.role}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Recent Issues */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0 pt-3 px-4">
                <h6 className="fw-bold mb-0"><i className="bi bi-bookmark me-2 text-danger"></i>Recent Issues</h6>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  {issues.slice(0, 6).map(issue => (
                    <li key={issue._id} className="list-group-item d-flex align-items-center gap-3 px-4">
                      {issue.bookThumbnail ? (
                        <img src={issue.bookThumbnail} alt="" style={{ width: '35px', height: '48px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: '35px', height: '48px', background: '#f0f0f0', borderRadius: '4px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="bi bi-book text-muted small"></i>
                        </div>
                      )}
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="fw-semibold small text-truncate">{issue.bookTitle}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{issue.userName}</div>
                      </div>
                      <span className={`badge text-white ${issue.status === 'issued' ? 'badge-issued' : 'badge-returned'}`}>
                        {issue.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Users Tab ── */}
      {activeTab === 'users' && (
        <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 issued-books-table">
                <thead>
                  <tr>
                    <th className="ps-3">#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => (
                    <tr key={u._id}>
                      <td className="ps-3 align-middle text-muted small">{idx + 1}</td>
                      <td className="align-middle">
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded-circle d-flex align-items-center justify-content-center text-white"
                            style={{ width: '32px', height: '32px', background: '#e94560', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="fw-semibold small">{u.name}</span>
                        </div>
                      </td>
                      <td className="align-middle small text-muted">{u.email}</td>
                      <td className="align-middle">
                        <span className={`badge rounded-pill ${u.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="align-middle small text-muted">{formatDate(u.createdAt)}</td>
                      <td className="align-middle">
                        {u.role !== 'admin' && (
                          <button className="btn btn-sm btn-outline-danger rounded-pill"
                            onClick={() => handleDeleteUser(u._id, u.name)}>
                            <i className="bi bi-trash me-1"></i>Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Issues Tab ── */}
      {activeTab === 'issues' && (
        <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 issued-books-table">
                <thead>
                  <tr>
                    <th className="ps-3">#</th>
                    <th>Cover</th>
                    <th>Book Title</th>
                    <th>User</th>
                    <th>Issue Date</th>
                    <th>Return Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue, idx) => (
                    <tr key={issue._id}>
                      <td className="ps-3 align-middle text-muted small">{idx + 1}</td>
                      <td className="align-middle">
                        {issue.bookThumbnail
                          ? <img src={issue.bookThumbnail} alt="" style={{ width: '35px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                          : <div style={{ width: '35px', height: '48px', background: '#f0f0f0', borderRadius: '4px' }}></div>
                        }
                      </td>
                      <td className="align-middle fw-semibold small">{issue.bookTitle}</td>
                      <td className="align-middle small text-muted">{issue.userName}</td>
                      <td className="align-middle small">{formatDate(issue.issueDate)}</td>
                      <td className="align-middle small">{formatDate(issue.returnDate)}</td>
                      <td className="align-middle">
                        <span className={`badge text-white ${issue.status === 'issued' ? 'badge-issued' : 'badge-returned'}`}>
                          {issue.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

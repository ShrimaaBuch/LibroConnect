// ============================================================
// ReadingCircle.jsx – Book Discussion Chat Room
// Uses polling (setInterval) instead of Socket.io per syllabus
// ============================================================
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';

const ReadingCircle = () => {
  const { bookId }  = useParams();
  const location    = useLocation();
  const { user }    = useAuth();

  // Book info passed via navigate state (or fallback)
  const bookTitle     = location.state?.bookTitle || 'Unknown Book';
  const bookAuthor    = location.state?.bookAuthor || '';
  const bookThumbnail = location.state?.bookThumbnail || '';

  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [sending, setSending]   = useState(false);
  const [error, setError]       = useState('');

  const chatEndRef = useRef(null); // Auto-scroll anchor

  // ── Fetch Messages ───────────────────────────────────────
  const fetchMessages = useCallback(async () => {
    try {
      const res = await api.get(`/chat/${bookId}`);
      setMessages(res.data);
    } catch (err) {
      setError('Could not load messages.');
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  // Initial fetch + polling every 5 seconds (replaces Socket.io)
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [fetchMessages]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send Message ─────────────────────────────────────────
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    setSending(true);
    try {
      await api.post('/chat', {
        bookId,
        bookTitle,
        message: newMsg.trim(),
      });
      setNewMsg('');
      fetchMessages(); // Refresh immediately after sending
    } catch (err) {
      setError('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  // Format timestamp nicely
  const formatTime = (ts) => {
    return new Date(ts).toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit',
    });
  };
  const formatDate = (ts) => {
    return new Date(ts).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short',
    });
  };

  // Group messages by date for display
  const groupedMessages = messages.reduce((groups, msg) => {
    const date = new Date(msg.timestamp).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <div className="container py-4">
      {/* Back Button */}
      <Link to="/" className="btn btn-sm btn-outline-secondary rounded-pill mb-3">
        <i className="bi bi-arrow-left me-1"></i>Back to Library
      </Link>

      <div className="row g-4">
        {/* ── Left: Book Info ── */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: '80px', borderRadius: '12px' }}>
            <div className="card-body text-center p-4">
              {bookThumbnail ? (
                <img src={bookThumbnail} alt={bookTitle}
                  className="rounded mb-3 shadow"
                  style={{ width: '100px', height: '140px', objectFit: 'cover' }} />
              ) : (
                <div className="mb-3" style={{ fontSize: '4rem' }}></div>
              )}
              <h6 className="fw-bold mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                {bookTitle}
              </h6>
              <p className="text-muted small mb-3">{bookAuthor}</p>
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <span className="badge rounded-pill bg-danger">Reading Circle</span>
              </div>
              <hr />
              <div className="d-flex justify-content-around text-center">
                <div>
                  <div className="fw-bold fs-5" style={{ color: '#e94560' }}>{messages.length}</div>
                  <small className="text-muted">Messages</small>
                </div>
                <div>
                  <div className="fw-bold fs-5" style={{ color: '#1a1a2e' }}>
                    {new Set(messages.map(m => m.userName)).size}
                  </div>
                  <small className="text-muted">Members</small>
                </div>
              </div>
              <hr />
              <p className="small text-muted mb-0">
                <i className="bi bi-arrow-repeat me-1 text-success"></i>
                Auto-refreshes every 5s
              </p>
            </div>
          </div>
        </div>

        {/* ── Right: Chat Area ── */}
        <div className="col-md-9">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>

            {/* Chat Header */}
            <div className="card-header border-0 d-flex align-items-center gap-3 py-3 px-4"
              style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', borderRadius: '12px 12px 0 0' }}>
              <div style={{ fontSize: '1.5rem' }}></div>
              <div>
                <h5 className="mb-0 text-white fw-semibold" style={{ fontSize: '1rem' }}>
                  Reading Circle
                </h5>
                <small style={{ color: 'rgba(255,255,255,0.6)' }}>{bookTitle}</small>
              </div>
              <span className="ms-auto badge bg-success">● Live</span>
            </div>

            {/* Messages Area */}
            <div className="chat-container" style={{ height: '420px' }}>
              {loading && (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <div className="spinner-border text-danger" role="status"></div>
                </div>
              )}

              {error && (
                <div className="alert alert-warning m-3">{error}</div>
              )}

              {!loading && messages.length === 0 && (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                  <div style={{ fontSize: '3rem' }}></div>
                  <p className="mt-2">No messages yet. Start the discussion!</p>
                </div>
              )}

              {/* Render messages grouped by date */}
              {!loading && Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  {/* Date Separator */}
                  <div className="text-center my-2">
                    <span className="badge bg-light text-secondary small px-3 py-1 rounded-pill border">
                      {date === new Date().toDateString() ? 'Today' : date}
                    </span>
                  </div>

                  {msgs.map((msg) => {
                    const isOwn = msg.userName === user?.name;
                    return (
                      <div key={msg._id} className={`chat-bubble ${isOwn ? 'own' : ''}`}>
                        {!isOwn && (
                          <div className="sender">
                            <i className="bi bi-person-circle me-1"></i>{msg.userName}
                          </div>
                        )}
                        <div>{msg.message}</div>
                        <div className="time">{formatDate(msg.timestamp)} · {formatTime(msg.timestamp)}</div>
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Scroll anchor */}
              <div ref={chatEndRef}></div>
            </div>

            {/* Message Input */}
            <div className="card-footer border-0 p-3" style={{ background: '#f8f9fa', borderRadius: '0 0 12px 12px' }}>
              <form onSubmit={handleSend} className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Share your thoughts about this book..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  maxLength={1000}
                  style={{ border: '2px solid #e0e0e0' }}
                />
                <button
                  type="submit"
                  className="btn rounded-circle d-flex align-items-center justify-content-center"
                  style={{ background: '#e94560', color: 'white', width: '42px', height: '42px', flexShrink: 0 }}
                  disabled={sending || !newMsg.trim()}
                >
                  {sending
                    ? <span className="spinner-border spinner-border-sm"></span>
                    : <i className="bi bi-send-fill"></i>}
                </button>
              </form>
              <small className="text-muted mt-1 d-block ps-2">
                {newMsg.length}/1000 characters
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingCircle;

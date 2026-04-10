// ============================================================
// Chat Routes - Reading Circle (Book Discussion)
// ============================================================
const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const { protect } = require('../middleware/authMiddleware');

// ── POST /api/chat ──────────────────────────────────────────
// Send a message in a book's reading circle
router.post('/', protect, async (req, res) => {
  try {
    const { bookId, bookTitle, message } = req.body;

    if (!bookId || !message) {
      return res.status(400).json({ message: 'bookId and message are required' });
    }

    const chat = await Chat.create({
      bookId,
      bookTitle: bookTitle || 'Unknown Book',
      userId: req.user._id,
      userName: req.user.name,
      message,
    });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── GET /api/chat/:bookId ───────────────────────────────────
// Get all messages for a specific book's reading circle
router.get('/:bookId', protect, async (req, res) => {
  try {
    const messages = await Chat.find({ bookId: req.params.bookId })
      .sort({ timestamp: 1 }) // oldest first
      .limit(100);             // limit to last 100 messages

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

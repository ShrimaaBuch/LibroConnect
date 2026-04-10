// ============================================================
// Issue Routes - Book Issuing System
// ============================================================
const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const { protect } = require('../middleware/authMiddleware');

// ── POST /api/issues ────────────────────────────────────────
// Issue a book (User must be logged in)
router.post('/', protect, async (req, res) => {
  try {
    const { bookId, bookTitle, bookAuthor, bookThumbnail } = req.body;

    if (!bookId || !bookTitle) {
      return res.status(400).json({ message: 'Book details are required' });
    }

    // Check if user already issued this book and not returned
    const alreadyIssued = await Issue.findOne({
      userId: req.user._id,
      bookId,
      status: 'issued',
    });

    if (alreadyIssued) {
      return res.status(400).json({ message: 'You have already issued this book' });
    }

    // Create issue record
    const issue = await Issue.create({
      userId: req.user._id,
      userName: req.user.name,
      bookId,
      bookTitle,
      bookAuthor: bookAuthor || 'Unknown Author',
      bookThumbnail: bookThumbnail || '',
    });

    res.status(201).json({ message: 'Book issued successfully!', issue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── GET /api/issues/mybooks ─────────────────────────────────
// Get currently logged-in user's issued books
router.get('/mybooks', protect, async (req, res) => {
  try {
    const issues = await Issue.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── PUT /api/issues/:id/return ──────────────────────────────
// Mark a book as returned
router.put('/:id/return', protect, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue record not found' });
    }

    // Ensure the issue belongs to this user
    if (issue.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    issue.status = 'returned';
    issue.returnDate = Date.now();
    await issue.save();

    res.json({ message: 'Book returned successfully', issue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

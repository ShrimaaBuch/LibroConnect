// ============================================================
// Share Routes - Notes & Resources Module
// ============================================================
const express = require('express');
const router = express.Router();
const Share = require('../models/Share');
const { protect } = require('../middleware/authMiddleware');

// ── POST /api/share ─────────────────────────────────────────
// Upload a note/resource
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, resourceType, bookTitle, content, tags } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({ message: 'Title, description and content are required' });
    }

    const share = await Share.create({
      userId: req.user._id,
      userName: req.user.name,
      title,
      description,
      resourceType: resourceType || 'note',
      bookTitle: bookTitle || '',
      content,
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
    });

    res.status(201).json({ message: 'Resource shared successfully!', share });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── GET /api/share ──────────────────────────────────────────
// Get all shared resources
router.get('/', async (req, res) => {
  try {
    const shares = await Share.find().sort({ createdAt: -1 });
    res.json(shares);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── DELETE /api/share/:id ───────────────────────────────────
// Delete a shared resource (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const share = await Share.findById(req.params.id);
    if (!share) return res.status(404).json({ message: 'Resource not found' });

    if (share.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await share.deleteOne();
    res.json({ message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

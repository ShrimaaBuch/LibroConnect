// ============================================================
// Admin Routes - Admin Dashboard APIs
// ============================================================
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Issue = require('../models/Issue');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

// ── GET /api/admin/users ────────────────────────────────────
// Get all registered users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── GET /api/admin/issues ───────────────────────────────────
// Get all issued books across all users
router.get('/issues', async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── GET /api/admin/stats ────────────────────────────────────
// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers  = await User.countDocuments({ role: 'user' });
    const totalIssued = await Issue.countDocuments({ status: 'issued' });
    const totalReturned = await Issue.countDocuments({ status: 'returned' });

    res.json({ totalUsers, totalIssued, totalReturned });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── DELETE /api/admin/users/:id ─────────────────────────────
// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

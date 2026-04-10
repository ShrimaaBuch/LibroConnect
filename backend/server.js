// ============================================================
// LibroConnect - Main Server Entry Point
// ============================================================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Database Connection ─────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

// ── Route Imports ───────────────────────────────────────────
const authRoutes   = require('./routes/authRoutes');
const issueRoutes  = require('./routes/issueRoutes');
const chatRoutes   = require('./routes/chatRoutes');
const shareRoutes  = require('./routes/shareRoutes');
const adminRoutes  = require('./routes/adminRoutes');

// ── Route Mounting ──────────────────────────────────────────
app.use('/api/auth',   authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/chat',   chatRoutes);
app.use('/api/share',  shareRoutes);
app.use('/api/admin',  adminRoutes);

// ── Health Check ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '📚 LibroConnect API is running!' });
});

// ── Global Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// ── Start Server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

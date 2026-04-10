// ============================================================
// Chat Model - Reading Circle Discussion Schema
// ============================================================
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    bookId: {
      type: String,   // Google Books API book ID
      required: true,
    },
    bookTitle: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Message cannot be empty'],
      trim: true,
      maxlength: 1000,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);

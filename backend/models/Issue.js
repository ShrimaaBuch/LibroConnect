// ============================================================
// Issue Model - Book Issuing Schema
// ============================================================
const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    bookId: {
      type: String,   // Google Books API book ID
      required: true,
    },
    bookTitle: {
      type: String,
      required: true,
    },
    bookAuthor: {
      type: String,
      default: 'Unknown Author',
    },
    bookThumbnail: {
      type: String,
      default: '',
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    returnDate: {
      type: Date,
      default: () => {
        // Default return date = 14 days from now
        const d = new Date();
        d.setDate(d.getDate() + 14);
        return d;
      },
    },
    status: {
      type: String,
      enum: ['issued', 'returned', 'overdue'],
      default: 'issued',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Issue', issueSchema);

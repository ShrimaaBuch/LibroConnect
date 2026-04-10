// ============================================================
// Share Model - Notes & Resources Schema
// ============================================================
const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    resourceType: {
      type: String,
      enum: ['note', 'summary', 'review', 'resource'],
      default: 'note',
    },
    bookTitle: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Share', shareSchema);

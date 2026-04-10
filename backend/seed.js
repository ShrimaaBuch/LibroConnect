// ============================================================
// seed.js – Seed the database with demo data
// Run: node seed.js
// ============================================================
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

// Import models
const User  = require('./models/User');
const Issue = require('./models/Issue');
const Chat  = require('./models/Chat');
const Share = require('./models/Share');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Issue.deleteMany({});
    await Chat.deleteMany({});
    await Share.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ── Create Users ──────────────────────────────────────
    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('admin123', salt);
    const userPass  = await bcrypt.hash('user123', salt);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@libro.com',
      password: adminPass,
      role: 'admin',
    });

    const user1 = await User.create({
      name: 'John Reader',
      email: 'user@libro.com',
      password: userPass,
      role: 'user',
    });

    const user2 = await User.create({
      name: 'Sarah Books',
      email: 'sarah@libro.com',
      password: userPass,
      role: 'user',
    });

    console.log('👥 Users created');

    // ── Create Sample Issues ──────────────────────────────
    await Issue.create([
      {
        userId: user1._id,
        userName: user1.name,
        bookId: 'YXivDwAAQBAJ',
        bookTitle: 'Atomic Habits',
        bookAuthor: 'James Clear',
        bookThumbnail: 'http://books.google.com/books/content?id=YXivDwAAQBAJ&printsec=frontcover&img=1&zoom=1',
        status: 'issued',
      },
      {
        userId: user2._id,
        userName: user2.name,
        bookId: 'HpAuDwAAQBAJ',
        bookTitle: 'The Psychology of Money',
        bookAuthor: 'Morgan Housel',
        bookThumbnail: 'http://books.google.com/books/content?id=HpAuDwAAQBAJ&printsec=frontcover&img=1&zoom=1',
        status: 'returned',
      },
      {
        userId: user1._id,
        userName: user1.name,
        bookId: 'fake_id_001',
        bookTitle: 'Deep Work',
        bookAuthor: 'Cal Newport',
        status: 'issued',
      },
    ]);
    console.log('📚 Issues created');

    // ── Create Sample Chat Messages ───────────────────────
    await Chat.create([
      {
        bookId: 'YXivDwAAQBAJ',
        bookTitle: 'Atomic Habits',
        userId: user1._id,
        userName: user1.name,
        message: 'Just started reading Atomic Habits. The 1% rule is mind-blowing! 🤯',
      },
      {
        bookId: 'YXivDwAAQBAJ',
        bookTitle: 'Atomic Habits',
        userId: user2._id,
        userName: user2.name,
        message: 'Yes! The concept of identity-based habits changed how I think about goals.',
      },
      {
        bookId: 'YXivDwAAQBAJ',
        bookTitle: 'Atomic Habits',
        userId: admin._id,
        userName: admin.name,
        message: 'Great book! Chapter 3 about the 4 laws of behavior change is the best part.',
      },
    ]);
    console.log('💬 Chat messages created');

    // ── Create Sample Shares ──────────────────────────────
    await Share.create([
      {
        userId: user1._id,
        userName: user1.name,
        title: 'Atomic Habits – Key Takeaways',
        description: 'Summary of the most important concepts from Atomic Habits',
        resourceType: 'summary',
        bookTitle: 'Atomic Habits',
        content: `1. The 1% Rule: Small improvements compound over time. Getting 1% better each day leads to 37x improvement in a year.\n\n2. Identity-Based Habits: Focus on who you want to become, not what you want to achieve.\n\n3. The 4 Laws: Make it obvious, attractive, easy, and satisfying.\n\n4. Environment Design: Shape your environment to make good habits easier.`,
        tags: ['habits', 'self-improvement', 'psychology'],
      },
      {
        userId: user2._id,
        userName: user2.name,
        title: 'Psychology of Money – Notes',
        description: 'Personal notes from reading this amazing book about money mindset',
        resourceType: 'note',
        bookTitle: 'The Psychology of Money',
        content: `- Wealth is what you don't see. People with real wealth often live below their means.\n- Getting rich vs staying rich require different skills.\n- Room for error is the most underappreciated aspect of financial planning.\n- Reasonable > Rational. You don't need to be perfectly rational to succeed.`,
        tags: ['finance', 'money', 'mindset'],
      },
    ]);
    console.log('📤 Shared resources created');

    console.log('\n✅ Seed complete! Demo credentials:');
    console.log('   Admin: admin@libro.com / admin123');
    console.log('   User:  user@libro.com  / user123');
    console.log('   User:  sarah@libro.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();

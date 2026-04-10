# LibroConnect – Social Reading & Bookstore Platform

> A full-stack MERN web application for social reading, book issuing, and community learning.
> Built strictly following the **AWT (Advanced Web Technologies) Syllabus**.

---

##  Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, React Router v6, Axios        |
| Styling    | Bootstrap 5, Bootstrap Icons            |
| Backend    | Node.js, Express.js                     |
| Database   | MongoDB, Mongoose ODM                   |
| Auth       | JWT (jsonwebtoken), bcryptjs            |
| Book Data  | Google Books API (free, no key needed)  |

---

## 📁 Folder Structure

```
libroconnect/
├── backend/
│   ├── models/
│   │   ├── User.js          ← User schema (JWT + bcrypt)
│   │   ├── Issue.js         ← Book issue tracking schema
│   │   ├── Chat.js          ← Reading circle messages schema
│   │   └── Share.js         ← Shared notes/resources schema
│   ├── routes/
│   │   ├── authRoutes.js    ← Register, Login, /me
│   │   ├── issueRoutes.js   ← Issue book, My books, Return
│   │   ├── chatRoutes.js    ← Send/Get reading circle messages
│   │   ├── shareRoutes.js   ← Upload/Get/Delete shared resources
│   │   └── adminRoutes.js   ← Admin: users, issues, stats
│   ├── middleware/
│   │   └── authMiddleware.js ← JWT protect + adminOnly guards
│   ├── server.js            ← Express app entry point
│   ├── seed.js              ← Database seed with demo data
│   ├── .env                 ← Environment variables
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html       ← Bootstrap 5 CDN included
    └── src/
        ├── context/
        │   └── AuthContext.js   ← Global auth state (React Context)
        ├── utils/
        │   └── api.js           ← Axios base config with token header
        ├── components/
        │   ├── Navbar.js        ← Top navigation bar
        │   ├── BookCard.js      ← Reusable book card with Issue/Circle buttons
        │   ├── AlertToast.js    ← Floating notification alerts
        │   ├── Footer.js        ← Site footer
        │   └── ProtectedRoute.js ← Route guard for auth/admin
        ├── pages/
        │   ├── Home.js          ← Library (Google Books API)
        │   ├── Login.js         ← Login form with validation
        │   ├── Register.js      ← Register form with validation
        │   ├── MyBooks.js       ← User's issued books + return
        │   ├── ReadingCircle.js ← Book discussion chat (polling)
        │   ├── Share.js         ← Community notes & resources
        │   ├── AdminDashboard.js ← Admin panel (users + issues)
        │   └── NotFound.js      ← 404 page
        ├── App.js               ← Routes + Layout
        ├── index.js             ← React entry point
        ├── index.css            ← Global custom styles
        └── package.json
```

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js v18+ installed
- MongoDB running locally (`mongod`) **OR** MongoDB Atlas URI

---

### Step 1: Clone / Extract the Project
```bash
cd libroconnect
```

---

### Step 2: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Configure environment (already set up in .env):
# MONGO_URI=mongodb://localhost:27017/libroconnect
# JWT_SECRET=libroconnect_super_secret_jwt_key_2024
# PORT=5000

# Seed the database with demo data (OPTIONAL but recommended)
node seed.js

# Start the backend server
npm run dev       # Development (nodemon auto-restart)
# OR
npm start         # Production
```

Backend runs at: **http://localhost:5000**

---

### Step 3: Setup Frontend

```bash
# Open a NEW terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

Frontend runs at: **http://localhost:3000**

> **Note:** The `"proxy": "http://localhost:5000"` in `frontend/package.json` automatically forwards `/api/*` requests to the backend.

---

### Step 4: Login with Demo Accounts

| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | admin@libro.com     | admin123  |
| User  | user@libro.com      | user123   |
| User  | sarah@libro.com     | user123   |

---

## 🔌 REST API Endpoints

### Auth
| Method | Endpoint              | Access  | Description          |
|--------|-----------------------|---------|----------------------|
| POST   | /api/auth/register    | Public  | Register new user    |
| POST   | /api/auth/login       | Public  | Login user           |
| GET    | /api/auth/me          | Private | Get current user     |

### Issues
| Method | Endpoint                  | Access  | Description          |
|--------|---------------------------|---------|----------------------|
| POST   | /api/issues               | Private | Issue a book         |
| GET    | /api/issues/mybooks       | Private | My issued books      |
| PUT    | /api/issues/:id/return    | Private | Return a book        |

### Chat (Reading Circle)
| Method | Endpoint              | Access  | Description               |
|--------|-----------------------|---------|---------------------------|
| POST   | /api/chat             | Private | Send message              |
| GET    | /api/chat/:bookId     | Private | Get messages for a book   |

### Share
| Method | Endpoint          | Access  | Description            |
|--------|-------------------|---------|------------------------|
| POST   | /api/share        | Private | Upload resource        |
| GET    | /api/share        | Public  | Get all resources      |
| DELETE | /api/share/:id    | Private | Delete own resource    |

### Admin
| Method | Endpoint              | Access     | Description          |
|--------|-----------------------|------------|----------------------|
| GET    | /api/admin/stats      | Admin only | Dashboard statistics |
| GET    | /api/admin/users      | Admin only | All users            |
| GET    | /api/admin/issues     | Admin only | All issued books     |
| DELETE | /api/admin/users/:id  | Admin only | Delete a user        |

---

## 🌐 Google Books API

The app uses the **Google Books API** (free, no API key required for basic usage):
```
https://www.googleapis.com/books/v1/volumes?q=SEARCH_TERM&maxResults=24
```

Features used:
- Search books by title/author/topic
- Display book cover (thumbnail), title, authors
- Book ID used as unique identifier for issues and reading circles

---

## 🔒 Security Features

1. **bcryptjs** – Passwords hashed with salt rounds (10)
2. **JWT** – Stateless authentication tokens (7-day expiry)
3. **Protected Routes** – Backend middleware + frontend route guard
4. **Role-Based Access** – Admin and User roles with different permissions

---

## 📱 Pages Overview

| Page              | Route                       | Access  |
|-------------------|-----------------------------|---------|
| Library (Home)    | /                           | Public  |
| Login             | /login                      | Public  |
| Register          | /register                   | Public  |
| My Issued Books   | /my-books                   | User    |
| Reading Circle    | /reading-circle/:bookId     | User    |
| Share Resources   | /share                      | Public  |
| Admin Dashboard   | /admin                      | Admin   |

---

## 🎯 AWT Syllabus Coverage

| Topic                    | Implementation                     |
|--------------------------|------------------------------------|
| React JSX & Components   | ✅ All pages are functional components |
| Props & State            | ✅ Used throughout (useState)       |
| React Hooks              | ✅ useState, useEffect, useRef, useCallback |
| React Router             | ✅ v6 with protected routes        |
| Forms & Validation       | ✅ Login, Register, Share, Chat    |
| Axios / Fetch API        | ✅ Axios for backend, Fetch for Google Books |
| Node.js + Express        | ✅ Full REST API backend           |
| MongoDB + Mongoose       | ✅ 4 schemas with relationships    |
| REST APIs                | ✅ Full CRUD operations            |
| JWT Authentication       | ✅ Token-based auth                |
| bcrypt Password Hashing  | ✅ Pre-save hook in User model     |
| Role-Based Access        | ✅ Admin / User roles              |
| Bootstrap UI             | ✅ Bootstrap 5 + Bootstrap Icons   |
| Real API Integration     | ✅ Google Books API                |

---

## 📌 Notes for Presentation

1. Start backend first, then frontend
2. Run `node seed.js` to populate demo data before demo
3. Show Google Books API fetching live books
4. Demo the Reading Circle chat with polling (auto-refresh every 5s)
5. Login as admin to show Admin Dashboard
6. Show book issue flow: Browse → Issue → My Books → Return

---

*Built with ❤️ using MERN Stack | AWT Project*

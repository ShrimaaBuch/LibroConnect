// ============================================================
// App.jsx – Root Component with React Router Setup
// ============================================================
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext.jsx';

// Layout Components
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import Home           from './pages/Home.jsx';
import Login          from './pages/Login.jsx';
import Register       from './pages/Register.jsx';
import MyBooks        from './pages/MyBooks.jsx';
import ReadingCircle  from './pages/ReadingCircle.jsx';
import Share          from './pages/Share.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import NotFound       from './pages/NotFound.jsx';

function App() {
  return (
    // AuthProvider wraps entire app so all components can access auth state
    <AuthProvider>
      <Router>
        {/* Main App Layout */}
        <div className="d-flex flex-column min-vh-100">

          {/* Top Navigation */}
          <Navbar />

          {/* Page Content */}
          <main className="flex-grow-1">
            <Routes>
              {/* ── Public Routes ── */}
              <Route path="/"         element={<Home />} />
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/share"    element={<Share />} />

              {/* ── Protected Routes (Login required) ── */}
              <Route
                path="/my-books"
                element={
                  <ProtectedRoute>
                    <MyBooks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reading-circle/:bookId"
                element={
                  <ProtectedRoute>
                    <ReadingCircle />
                  </ProtectedRoute>
                }
              />

              {/* ── Admin Only Route ── */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* ── 404 Fallback ── */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

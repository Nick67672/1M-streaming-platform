import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import VideoPage from './pages/VideoPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
        <Route path="/video/:id" element={<VideoPage />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;
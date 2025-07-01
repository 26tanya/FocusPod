import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthContext';
import GroupRoom from './pages/GroupRoom';
import SoloRoom from './pages/SoloRoom';
import VerifyOtpPage from './pages/VerifyOtpPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CreateRoomPage from './pages/CreateRoomPage';
import CreateSoloRoomPage from './pages/CreateSoloRoomPage';
import ProgressPage from './pages/ProgressPage';
import { Toaster } from 'sonner';
import AboutHelp from './pages/AboutHelp'; // adjust the path as needed
import ProfilePage from './pages/ProfilePage';
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  // List of public routes
  const publicRoutes = ['/', '/register', '/verify-otp', '/forgot-password'];

  if (publicRoutes.includes(location.pathname)) {
    return children;
  }

  return user ? children : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-center" />
      <ProtectedRoute>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/create-room" element={<CreateRoomPage />} />
          <Route path="/start-solo" element={<CreateSoloRoomPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/room/:roomCode" element={<GroupRoom />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/solo" element={<SoloRoom />} />
          <Route path="/about" element={<AboutHelp />} />
          <Route path="/profile" element={<ProfilePage />} />

        </Routes>
      </ProtectedRoute>
    </BrowserRouter>
  );
}

export default App;

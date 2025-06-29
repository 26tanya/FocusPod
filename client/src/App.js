import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
    <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/create-room" element={<CreateRoomPage />} />
        <Route path="/start-solo" element={<CreateSoloRoomPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/room/:roomCode"
          element={
            <ProtectedRoute>
              <GroupRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          }
        />
         <Route
          path="/solo"
          element={
            <ProtectedRoute>
              <SoloRoom />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

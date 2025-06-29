import React, { useEffect, useState } from 'react';
import FocusTimer from '../components/FocusTimer';
import PomodoroTimer from '../components/PomodoroTimer';
import Notes from '../components/Notes';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SessionGoals from '../components/SessionGoals';
import backgroundImage from '../Photos/bg1.jpg';
import AIAssistantPopup from '../components/AIAssistantPopup';
import { useAuth } from '../context/AuthContext';

const SoloRoom = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') || 'custom';
  const duration = parseInt(searchParams.get('duration')) || 25;
  const roomCode = searchParams.get('roomCode');
  const { user } = useAuth();

  const [sessionId, setSessionId] = useState('');

  // ✅ Auto-generate roomCode if not present in URL
  useEffect(() => {
    if (!roomCode && user?._id) {
      const newRoomCode = Math.random().toString(36).substr(2, 8);
      searchParams.set('roomCode', newRoomCode);
      navigate(`/solo?${searchParams.toString()}`, { replace: true });
    }
  }, [roomCode, user, searchParams, navigate]);

  // ✅ Generate session ID once roomCode is ready
  useEffect(() => {
    if (user?._id && roomCode) {
      const id = `solo-${user._id}-${roomCode}`;
      setSessionId(id);
    }
  }, [user, roomCode]);

  if (!sessionId) return null;

  return (
    <div
      className="min-h-screen py-10 px-4 space-y-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <SessionGoals />

      <div className="backdrop-blur-sm bg-white/60 rounded-2xl p-8 shadow-xl w-full max-w-xl mx-auto flex justify-center items-center min-h-[280px] transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
        {mode === 'custom' ? (
          <FocusTimer isSolo initialDuration={duration} large />
        ) : (
          <PomodoroTimer />
        )}
      </div>

      <Notes sessionId={sessionId} onClose={() => {}} />
      <AIAssistantPopup sessionId={sessionId} onClose={() => {}} />
    </div>
  );
};

export default SoloRoom;

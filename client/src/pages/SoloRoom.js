import React, { useEffect, useState } from 'react';
import FocusTimer from '../components/FocusTimer';
import PomodoroTimer from '../components/PomodoroTimer';
import Notes from '../components/Notes';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SessionGoals from '../components/SessionGoals';
import backgroundImage from '../Photos/bg1.jpg';
import AIAssistantPopup from '../components/AIAssistantPopup';
import { useAuth } from '../context/AuthContext';
import SoothingMusicPlayer from '../components/SoothingMusicPlayer';
import axios from 'axios';
import { toast } from 'sonner';

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
      const newRoomCode = Math.random().toString(36).substring(2, 8);
      searchParams.set('roomCode', newRoomCode);
      navigate(`/solo?${searchParams.toString()}`, { replace: true });
    }
  }, [roomCode, user, searchParams, navigate]);

  // ✅ Generate session ID + Save Room
  useEffect(() => {
    const saveRoomToDB = async () => {
      if (user?._id && roomCode) {
        setSessionId(`solo-${user._id}-${roomCode}`);

        try {
          await axios.post('http://localhost:5000/api/rooms/create', {
            code: roomCode,
            creator: {
              id: user._id,
              name: user.name,
              email: user.email,
            },
            mode,
            customDuration: mode === 'custom' ? duration : undefined,
          });
          console.log('✅ Room saved successfully');
        } catch (err) {
          console.error('❌ Error saving room:', err.response?.data || err.message);
          
        }
      }
    };

    saveRoomToDB();
  }, [user, roomCode, mode, duration]);

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

      {mode === 'custom' ? (
        <FocusTimer isSolo initialDuration={duration} large />
      ) : (
        <PomodoroTimer />
      )}

      <Notes sessionId={sessionId} onClose={() => {}} />
      <AIAssistantPopup sessionId={sessionId} onClose={() => {}} />
      <SoothingMusicPlayer />
    </div>
  );
};

export default SoloRoom;

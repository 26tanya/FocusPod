import React, { useState, useEffect } from 'react';
import FocusTimer from '../components/FocusTimer';
import GroupChat from '../components/GroupChat';
import { useAuth } from '../context/AuthContext';
import { useParams, useSearchParams } from 'react-router-dom';
import Notes from '../components/Notes';
import socket from '../socket';
import AIAssistantPopup from '../components/AIAssistantPopup';
import axios from 'axios';
import SoothingMusicPlayer from '../components/SoothingMusicPlayer';
import RoomCopyBar from '../components/RoomCopyBar';
import roomImage from '../Photos/room.jpg'; // adjust path as needed
import { FaComments } from 'react-icons/fa'; // floating icon
import { IoClose } from 'react-icons/io5'; 
import SessionGoals from '../components/SessionGoals';
const GroupRoom = () => {
  const { roomCode } = useParams();
  const [joined, setJoined] = useState(false);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const sessionId = `group-${roomCode}`; 
  const durationFromURL = parseInt(searchParams.get('duration')) || 25; // default 25
  const isCreator = searchParams.get('creator') === 'true';
  const mode = searchParams.get('mode') || 'custom'; 
  
  useEffect(() => {
    if (roomCode) {
      setJoined(true);

      if (isCreator) {
        // ✅ Emit duration via socket
        socket.emit('set-duration', { roomCode, duration: durationFromURL });

        // ✅ Save room to DB via API
        const createRoom = async () => {
          try {
            await axios.post('http://localhost:5000/api/rooms/create', {
              code: roomCode,
              mode,
              customDuration: durationFromURL,
              creator: {
                id: user._id,
                name: user.name,
                email: user.email,
              },
            });
            console.log('✅ Room saved to database');
          } catch (err) {
            console.error('❌ Failed to save room:', err.response?.data || err.message);
          }
        };

        createRoom();
      }
    }
  }, [roomCode, durationFromURL, isCreator, user, mode]);
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${roomImage})` }}
    >
    <div className="p-6">
      {joined ? (
        <>
          <SessionGoals/>
          <RoomCopyBar roomCode={roomCode} creatorName={user?.name} />
          <FocusTimer roomCode={roomCode} initialDuration={durationFromURL} isCreator={isCreator} />
          <GroupChat roomCode={roomCode} user={user} />
          <Notes sessionId={sessionId} onClose={() => {}} />
          <AIAssistantPopup sessionId={sessionId} onClose={() => {}} />
          <SoothingMusicPlayer/>
        </>
      ) : (
        <p className="text-center text-gray-600">Invalid Room</p>
      )}
    </div>
    </div>
  );
};

export default GroupRoom;  
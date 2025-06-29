import React, { useState, useEffect } from 'react';
import FocusTimer from '../components/FocusTimer';
import GroupChat from '../components/GroupChat';
import { useAuth } from '../context/AuthContext';
import { useParams, useSearchParams } from 'react-router-dom';
import Notes from '../components/Notes';
import socket from '../socket';
import AIAssistantPopup from '../components/AIAssistantPopup';
import axios from 'axios';
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
    
    <div className="p-6">
      {joined ? (
        <>
          <h2 className="text-center text-lg font-bold mb-2">Room Code: {roomCode}</h2>
          <FocusTimer roomCode={roomCode} initialDuration={durationFromURL} isCreator={isCreator} />
          <GroupChat roomCode={roomCode} user={user} />
          <Notes sessionId={sessionId} onClose={() => {}} />
          <AIAssistantPopup sessionId={sessionId} onClose={() => {}} />
        </>
      ) : (
        <p className="text-center text-gray-600">Invalid Room</p>
      )}
    </div>
  );
};

export default GroupRoom;

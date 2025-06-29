import React, { useState, useEffect } from 'react';
import FocusTimer from '../components/FocusTimer';
import GroupChat from '../components/GroupChat';
import { useAuth } from '../context/AuthContext';
import { useParams, useSearchParams } from 'react-router-dom';
import Notes from '../components/Notes';
import socket from '../socket';
import AIAssistantPopup from '../components/AIAssistantPopup';

const GroupRoom = () => {
  const { roomCode } = useParams();
  const [joined, setJoined] = useState(false);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const sessionId = `group-${roomCode}`; 
  const durationFromURL = parseInt(searchParams.get('duration')) || 25; // default 25
  const isCreator = searchParams.get('creator') === 'true';

  useEffect(() => {
    if (roomCode) {
      setJoined(true);

      // ✅ Only creator emits duration to socket
      if (isCreator) {
        socket.emit('set-duration', { roomCode, duration: durationFromURL });
      }
    }
  }, [roomCode, durationFromURL, isCreator]);

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

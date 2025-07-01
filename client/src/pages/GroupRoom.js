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

import SessionGoals from '../components/SessionGoals';

const GroupRoom = () => {
  const { roomCode } = useParams();
  const [joined, setJoined] = useState(false);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const sessionId = `group-${roomCode}`;
  const durationFromURL = parseInt(searchParams.get('duration')) || 25;
  const isCreator = searchParams.get('creator') === 'true';
  const mode = searchParams.get('mode') || 'custom';

  useEffect(() => {
    if (roomCode) {
      setJoined(true);

      if (isCreator) {
        socket.emit('set-duration', { roomCode, duration: durationFromURL });

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
   <div className="min-h-screen bg-gradient-to-br from-[#f8cdda] via-[#e2c0f9] to-[#fceabb]">

      <div className="px-4 md:px-6 max-w-[96rem] mx-auto">

        {joined ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* LEFT COLUMN: Notes on top, SessionGoals on bottom */}
            <div className="flex flex-col justify-between h-full gap-6 mt-6 pb-10">
              <Notes sessionId={sessionId} onClose={() => {}} />
              <SessionGoals />
            </div>

            {/* MIDDLE COLUMN: RoomCopyBar, FocusTimer, Music */}
            <div className="flex flex-col gap-6 mt-6">
              <RoomCopyBar roomCode={roomCode} creatorName={user?.name} />
              <FocusTimer
                roomCode={roomCode}
                initialDuration={durationFromURL}
                isCreator={isCreator}
              />
              <div className="flex justify-center w-full">
                <SoothingMusicPlayer />
              </div>
            </div>

            {/* RIGHT COLUMN: GroupChat and AI Assistant */}
            <div className="flex flex-col gap-6">
              <GroupChat roomCode={roomCode} user={user} />
              <AIAssistantPopup sessionId={sessionId} onClose={() => {}} />
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Invalid Room</p>
        )}
      </div>
    </div>
  );
};

export default GroupRoom;

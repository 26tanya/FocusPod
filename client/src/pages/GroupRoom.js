import React, { useState,useEffect } from 'react';
import FocusTimer from '../components/FocusTimer';
import GroupChat from '../components/GroupChat';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import Notes from '../components/Notes';
const GroupRoom = () => {
  //const [roomCode, setRoomCode] = useState('');
  const { roomCode } = useParams(); 
  const [joined, setJoined] = useState(false);
  const { user } = useAuth();
  
//   const handleJoin = () => {
//     if (roomCode.trim()) {
//       setJoined(true);
//     }
//   };
 useEffect(() => {
if (roomCode) {
setJoined(true);
}
}, [roomCode]);
  return (
<div className="p-6">
{joined ? (
<>
<h2 className="text-center text-lg font-bold mb-2">Room Code: {roomCode}</h2>
<FocusTimer roomCode={roomCode} />
<GroupChat roomCode={roomCode} user={user} />
<Notes/>
</>
) : (
<p className="text-center text-gray-600">Invalid Room</p>
)}
</div>

);
};

export default GroupRoom;
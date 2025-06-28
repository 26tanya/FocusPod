import React, { useEffect, useRef, useState } from 'react';
import socket from '../socket';

const GroupChat = ({ roomCode, user }) => {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!roomCode || !user) return;

    // Join room with user name
    socket.emit('join-room', { roomCode, name: user?.name || 'Anon' });
    console.log(`✅ Joined room: ${roomCode} as ${user?.name || 'Anon'}`);

    // Handle incoming chat messages
    const handleIncomingMessage = (data) => {
      setChatLog((prev) => [...prev, data]);
    };

    // Handle typing indicator
    const handleTyping = ({ sender }) => {
      if (sender !== user?.name) {
        setTypingUsers((prev) => {
          if (!prev.includes(sender)) return [...prev, sender];
          return prev;
        });

        // Clear after timeout
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u !== sender));
        }, 2000);
      }
    };

    // Handle room users list
    const handleRoomUsers = (users) => {
      setMembers(users);
    };

    socket.on('chat-message', handleIncomingMessage);
    socket.on('typing', handleTyping);
    socket.on('room-users', handleRoomUsers);

    return () => {
      socket.off('chat-message', handleIncomingMessage);
      socket.off('typing', handleTyping);
      socket.off('room-users', handleRoomUsers);
    };
  }, [roomCode, user]);

  const sendMessage = () => {
    if (message.trim()) {
      const senderName = user?.name || 'Anon';
      const chatData = {
        roomCode,
        message,
        sender: senderName,
      };

      socket.emit('chat-message', chatData);
      setMessage('');
    }
  };

  const handleTyping = (value) => {
    setMessage(value);
    if (!typingTimeoutRef.current) {
      socket.emit('typing', { roomCode, sender: user?.name || 'Anon' });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      typingTimeoutRef.current = null;
    }, 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-4 bg-white p-4 rounded-2xl shadow">
      <h3 className="text-xl font-semibold mb-2">💬 Group Chat</h3>

      {/* Display Room Members */}
      {members.length > 0 && (
        <div className="text-sm text-gray-700 mb-2">
          👥 <strong>Members:</strong> {members.map((m) => m.name).join(', ')}
        </div>
      )}

      {/* Chat Log */}
      <div className="h-60 overflow-y-auto border p-2 rounded mb-1 bg-gray-50">
        {chatLog.map((msg, idx) => (
          <div key={idx} className="mb-1">
            <strong>{msg.sender}:</strong> <span>{msg.message}</span>
          </div>
        ))}
      </div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <p className="text-xs text-gray-500 italic mb-2">
          {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </p>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-grow border p-2 rounded"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupChat;

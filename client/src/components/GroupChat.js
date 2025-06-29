import React, { useEffect, useRef, useState } from 'react';
import socket from '../socket';


const GroupChat = ({ roomCode, user }) => {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (roomCode) {
      const savedChat = localStorage.getItem(`chat-${roomCode}`);
      if (savedChat) {
        setChatLog(JSON.parse(savedChat));
      }
    }
  }, [roomCode]);

  useEffect(() => {
    if (!roomCode || !user) return;

    socket.emit('join-room', { roomCode, name: user?.name || 'Anon' });

    const handleIncomingMessage = (data) => {
      setChatLog((prev) => {
        const updated = [...prev, data];
        localStorage.setItem(`chat-${roomCode}`, JSON.stringify(updated));
        return updated;
      });
    };

    const handleTyping = ({ sender }) => {
      if (sender !== user?.name) {
        setTypingUsers((prev) => {
          if (!prev.includes(sender)) return [...prev, sender];
          return prev;
        });

        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u !== sender));
        }, 2000);
      }
    };

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
        timestamp: new Date().toISOString(),
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

  const formatTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat?')) {
      localStorage.removeItem(`chat-${roomCode}`);
      setChatLog([]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-4 bg-white p-4 rounded-2xl shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold">💬 Group Chat</h3>
        <button
          onClick={clearChat}
          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          Clear Chat
        </button>
      </div>

      {members.length > 0 && (
        <div className="text-sm text-gray-700 mb-2">
          👥 <strong>Members:</strong> {members.map((m) => m.name).join(', ')}
        </div>
      )}
    
      {/* Chat Log */}
      <div className="h-60 overflow-y-auto border p-2 rounded mb-1 bg-gray-50 flex flex-col gap-1">
        {chatLog.map((msg, idx) => {
          const isOwn = msg.sender === (user?.name || 'Anon');
          return (
            <div
              key={idx}
              className={`flex flex-col max-w-[80%] ${
                isOwn ? 'ml-auto items-end' : 'items-start'
              }`}
            >
              <div
                className={`px-3 py-2 rounded-xl ${
                  isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                }`}
              >
                <span className="block text-sm">{msg.message}</span>
              </div>
              <span className="text-xs text-gray-500 mt-0.5">
                {isOwn ? 'You' : msg.sender} • {formatTime(msg.timestamp)}
              </span>
            </div>
          );
        })}
      </div>

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

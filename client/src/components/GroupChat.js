import React, { useEffect, useRef, useState } from 'react';
import socket from '../socket';
import { IoClose } from 'react-icons/io5';
import { FaComments } from 'react-icons/fa';

const GroupChat = ({ roomCode, user }) => {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const typingTimeoutRef = useRef(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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

        if (!isChatOpen) {
          setUnreadCount((count) => count + 1);
        }

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
  }, [roomCode, user, isChatOpen]);

  useEffect(() => {
    if (isChatOpen) {
      setUnreadCount(0);
    }
  }, [isChatOpen]);

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
    <>
      {/* Floating Chat Icon */}
      {/* Floating Chat Button in Fixed Position */}
<div
  style={{
    position: 'fixed',
    top: '2rem',
    right: '1.5rem',
    zIndex: 9999,
  }}
>
  <div style={{ position: 'relative', width: '56px', height: '56px' }}>
    <button
      onClick={() => setIsChatOpen(true)}
      className="w-full h-full bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg"
      title="Open Group Chat"
    >
      <FaComments size={24} />
    </button>

    {/* Unread badge */}
    {unreadCount > 0 && !isChatOpen && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none shadow pointer-events-none">
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
    )}
  </div>
</div>



      {/* Sliding Chat Panel */}
      <div
        className={`fixed top-[7rem] right-0 w-[22rem] h-[32rem] bg-gradient-to-br from-[#f5f7fa] to-[#e4ecf3] z-40 transition-transform duration-300 ease-in-out border border-gray-300 rounded-l-2xl shadow-2xl ${
          isChatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 bg-blue-600 text-white rounded-t-2xl">
          <h2 className="text-lg font-semibold">Discussion Box</h2>
          <button onClick={() => setIsChatOpen(false)} className="text-white text-xl">
            <IoClose />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-4rem)] font-sans tracking-wide">
          <div className="flex justify-end mb-2">
            <button
              onClick={clearChat}
              className="text-xs bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500 transition"
            >
              Clear Chat
            </button>
          </div>

          {members.length > 0 && (
            <div className="text-sm text-gray-600 bg-white/70 border border-gray-200 rounded-md p-2 mb-2 shadow-inner">
              👥 <strong>Members:</strong> {members.map((m) => m.name).join(', ')}
            </div>
          )}

          <div className="h-60 overflow-y-auto border border-gray-200 p-3 rounded-lg mb-2 bg-white shadow-inner flex flex-col gap-1">
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
                    className={`px-4 py-2 rounded-xl ${
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
              className="flex-grow border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupChat;

import React, { useState, useEffect, useRef } from 'react';
import socket from '../socket';
import { useAuth } from '../context/AuthContext';
import CircularProgress from './CircularProgress'; // adjust path if needed

const FocusTimer = ({ roomCode, isSolo = false }) => {
  const { user } = useAuth();

  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [internalRoomCode, setInternalRoomCode] = useState('');
  const timerRef = useRef(null);

  const activeRoomCode = isSolo ? null : roomCode || internalRoomCode;
  const totalSeconds = minutes * 60 + seconds;
  const initialTotal = useRef(minutes * 60); // hold original total time
  const progress = 100 - (totalSeconds / initialTotal.current) * 100;

  // Join room (group only)
  useEffect(() => {
    if (activeRoomCode) {
      socket.emit('join-room', activeRoomCode);
    }
  }, [activeRoomCode]);

  // Timer countdown logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            setMinutes((prevMinutes) => {
              if (prevMinutes === 0) {
                clearInterval(timerRef.current);
                setIsRunning(false);
                const endSound = new Audio('/sounds/timer-end.mp3');
                endSound.play();
                alert('⏰ Time is up!');
                return 0;
              }
              return prevMinutes - 1;
            });
            return 59;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  // Socket listeners (group only)
  useEffect(() => {
    const handleStart = ({ startTime }) => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const duration = 25 * 60;
      const remaining = duration - elapsed;

      if (remaining > 0) {
        setMinutes(Math.floor(remaining / 60));
        setSeconds(remaining % 60);
        setIsRunning(true);
      } else {
        setMinutes(0);
        setSeconds(0);
        setIsRunning(false);
        alert('⏰ Time is up!');
      }
    };

    const handlePause = () => setIsRunning(false);
    const handleReset = () => {
      setIsRunning(false);
      setMinutes(25);
      setSeconds(0);
    };

    socket.on('start-timer', handleStart);
    socket.on('pause-timer', handlePause);
    socket.on('reset-timer', handleReset);

    return () => {
      socket.off('start-timer', handleStart);
      socket.off('pause-timer', handlePause);
      socket.off('reset-timer', handleReset);
    };
  }, []);

  const handleStart = () => {
    if (activeRoomCode) {
      socket.emit('start-timer', activeRoomCode);
    } else {
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    if (activeRoomCode) {
      socket.emit('pause-timer', activeRoomCode);
    } else {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    if (activeRoomCode) {
      socket.emit('reset-timer', activeRoomCode);
    } else {
      setIsRunning(false);
      setMinutes(25);
      setSeconds(0);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto text-center mt-6">
      <h2 className="text-2xl font-semibold mb-2">🎯 Focus Timer</h2>

      {isSolo ? (
  <p className="text-sm text-gray-500 mb-2">🧘 Solo Session</p>
) : (
  activeRoomCode && <p className="text-sm text-gray-500 mb-2"></p>
)}

{!isSolo && !roomCode && (
  <div className="mb-4">
    <input
      type="text"
      placeholder="Enter Room Code"
      value={internalRoomCode}
      onChange={(e) => setInternalRoomCode(e.target.value)}
      className="border p-2 rounded w-full"
    />
  </div>
)}

{/* ⭕ Circular progress ring */}
<CircularProgress percentage={progress} />

<div className="text-6xl font-mono mb-6">
  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
</div>

<div className="flex justify-center gap-4 mb-6">
  {!isRunning ? (
    <button
      onClick={handleStart}
      className="px-4 py-2 bg-green-500 text-white rounded-xl shadow"
    >
      Start
    </button>
  ) : (
    <button
      onClick={handlePause}
      className="px-4 py-2 bg-yellow-500 text-white rounded-xl shadow"
    >
      Pause
    </button>
  )}
  <button
    onClick={handleReset}
    className="px-4 py-2 bg-red-500 text-white rounded-xl shadow"
  >
    Reset
  </button>
</div>
    </div>
  );
};

export default FocusTimer;

import React, { useState, useEffect, useRef } from 'react';
import socket from '../socket';
import { useAuth } from '../context/AuthContext';
import CircularProgress from './CircularProgress';

const FocusTimer = ({ roomCode, isSolo = false, initialDuration = 25, isCreator = false }) => {
  const { user } = useAuth();

  const [minutes, setMinutes] = useState(initialDuration);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const initialTotal = useRef(initialDuration * 60);
  const totalSeconds = minutes * 60 + seconds;
  const progress = 100 - (totalSeconds / initialTotal.current) * 100;

  // ✅ Emit duration if creator
  useEffect(() => {
    if (!isSolo && isCreator && roomCode) {
      socket.emit('set-duration', { roomCode, duration: initialDuration });
    }
  }, [roomCode, initialDuration, isCreator, isSolo]);

  // ✅ Sync duration for non-creators
  useEffect(() => {
    if (!isSolo && !isCreator) {
      socket.on('set-duration', (duration) => {
        setMinutes(duration);
        setSeconds(0);
        initialTotal.current = duration * 60;
        console.log('⏱️ Synced timer with duration:', duration);
      });

      // Ask server in case missed initial emit
      socket.emit('get-duration', roomCode);
      socket.on('send-duration', (duration) => {
        setMinutes(duration);
        setSeconds(0);
        initialTotal.current = duration * 60;
      });

      return () => {
        socket.off('set-duration');
        socket.off('send-duration');
      };
    }
  }, [isCreator, roomCode]);

  // ✅ Timer countdown
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 0) {
            setMinutes((m) => {
              if (m === 0) {
                clearInterval(timerRef.current);
                setIsRunning(false);
                new Audio('/sounds/timer-end.mp3').play();
                alert('⏰ Time is up!');
                
                if (!isSolo && roomCode && user) {
                  socket.emit('log-session', {
                    userId: user._id,
                    duration: initialTotal.current / 60, // e.g., 25 minutes
                  });
                }

                if (isSolo && user) {
                  socket.emit('log-session', {
                    userId: user._id,
                    duration: initialTotal.current / 60,
                  });
                }

                return 0;
              }
              return m - 1;
            });
            return 59;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  // ✅ Socket timer events
  useEffect(() => {
    socket.on('start-timer', ({ startTime }) => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const duration = initialTotal.current;
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
    });

    socket.on('pause-timer', () => setIsRunning(false));
    socket.on('reset-timer', () => {
      setIsRunning(false);
      setMinutes(initialTotal.current / 60);
      setSeconds(0);
    });

    return () => {
      socket.off('start-timer');
      socket.off('pause-timer');
      socket.off('reset-timer');
    };
  }, []);

  const handleStart = () => {
    if (roomCode) socket.emit('start-timer', roomCode);
    else setIsRunning(true);
  };

  const handlePause = () => {
    if (roomCode) socket.emit('pause-timer', roomCode);
    else setIsRunning(false);
  };

  const handleReset = () => {
    if (roomCode) socket.emit('reset-timer', roomCode);
    else {
      setIsRunning(false);
      setMinutes(initialTotal.current / 60);
      setSeconds(0);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto text-center mt-6">
      <h2 className="text-2xl font-semibold mb-2"> Focus Timer</h2>

      {!isSolo && <p className="text-sm text-gray-500 mb-2">Room Code: {roomCode}</p>}

      <CircularProgress percentage={progress} />

      <div className="text-6xl font-mono mb-6">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className="flex justify-center gap-4 mb-6">
      {!isRunning ? (
        <button
          onClick={handleStart}
          disabled={!isCreator && !isSolo}
          className="px-4 py-2 rounded-xl shadow text-white bg-green-500 hover:bg-green-600 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Start
        </button>
      ) : (
        <button
          onClick={handlePause}
          disabled={!isCreator && !isSolo}
          className="px-4 py-2 rounded-xl shadow text-white bg-yellow-500 hover:bg-yellow-600 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Pause
        </button>
      )}

      <button
        onClick={handleReset}
        disabled={!isCreator && !isSolo}
        className="px-4 py-2 rounded-xl shadow text-white bg-red-500 hover:bg-red-600 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Reset
      </button>
    </div>
    </div>
  );
};

export default FocusTimer;

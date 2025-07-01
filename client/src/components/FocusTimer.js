import React, { useState, useEffect, useRef } from 'react';
import socket from '../socket';
import { useAuth } from '../context/AuthContext';
import CircularProgress from './CircularProgress';
import { toast } from 'sonner';

const FocusTimer = ({ roomCode, isSolo = false, initialDuration = 25, isCreator = false }) => {
  const { user } = useAuth();

  const [minutes, setMinutes] = useState(initialDuration);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const initialTotal = useRef(initialDuration * 60);
  const totalSeconds = minutes * 60 + seconds;
  const progress = 100 - (totalSeconds / initialTotal.current) * 100;

  // Sync duration
  useEffect(() => {
    if (!isSolo && isCreator && roomCode) {
      socket.emit('set-duration', { roomCode, duration: initialDuration });
    }
  }, [roomCode, initialDuration, isCreator, isSolo]);

  useEffect(() => {
    if (!isSolo && !isCreator) {
      socket.on('set-duration', (duration) => {
        setMinutes(duration);
        setSeconds(0);
        initialTotal.current = duration * 60;
      });

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

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 0) {
            setMinutes((m) => {
              if (m === 0) {
                const playAndToast = async () => {
                  try {
                    const audio = new Audio('/sounds/timer-end.mp3');
                    await audio.play();
                    toast.success('🎉 Session complete! Great job.', {
                      position: 'top-left',
                    });
                  } catch (err) {
                    toast.warning('⏰ Time is up! (Audio failed)', {
                      position: 'top-left',
                    });
                  }
                };
                playAndToast();
                setIsRunning(false);
                clearInterval(timerRef.current);

                if (user && user._id) {
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

  // Timer control via socket
  useEffect(() => {
    socket.on('start-timer', ({ startTime }) => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = initialTotal.current - elapsed;

      if (remaining > 0) {
        setMinutes(Math.floor(remaining / 60));
        setSeconds(remaining % 60);
        setIsRunning(true);
      } else {
        setMinutes(0);
        setSeconds(0);
        setIsRunning(false);
        toast.error('⏰ Time is up!', {
          position: 'top-left',
        });
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
    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 w-full max-w-md mx-auto text-center mt-6 border border-blue-200 transition-all hover:scale-[1.01]">
      <CircularProgress percentage={progress} />

      <div className="text-[5.5rem] font-extrabold font-mono tracking-wide text-gray-900 mt-4 mb-6 drop-shadow-sm">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            disabled={!isCreator && !isSolo}
            className="px-6 py-2 text-white rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start
          </button>
        ) : (
          <button
            onClick={handlePause}
            disabled={!isCreator && !isSolo}
            className="px-6 py-2 text-white rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Pause
          </button>
        )}

        <button
          onClick={handleReset}
          disabled={!isCreator && !isSolo}
          className="px-6 py-2 text-white rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default FocusTimer;

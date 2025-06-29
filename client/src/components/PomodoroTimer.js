import React, { useEffect, useState, useRef } from 'react';
import CircularProgress from './CircularProgress';
import { toast } from 'sonner';

const WORK = 'Work';
const SHORT_BREAK = 'Short Break';
const LONG_BREAK = 'Long Break';

const PomodoroTimer = () => {
  const [mode, setMode] = useState(WORK);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [cycle, setCycle] = useState(0);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const durations = {
    [WORK]: 25,
    [SHORT_BREAK]: 5,
    [LONG_BREAK]: 15,
  };

  const totalInitial = useRef(durations[mode] * 60);
  const totalSeconds = minutes * 60 + seconds;
  const progress = 100 - (totalSeconds / totalInitial.current) * 100;

  useEffect(() => {
    totalInitial.current = durations[mode] * 60;
  }, [mode]);

  const playSwitchSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.warn("🔇 Sound play failed:", err);
      });
    }
  };

  const handleSessionEnd = () => {
    playSwitchSound();
    setIsRunning(false);
    clearInterval(timerRef.current);

    if (mode === WORK) {
      toast.success('💪 Work session complete! Time for a short break 🧘‍♀️');
      const newCycle = cycle + 1;
      setCycle(newCycle);
      const nextMode = newCycle % 4 === 0 ? LONG_BREAK : SHORT_BREAK;
      setMode(nextMode);
      setMinutes(durations[nextMode]);
      setSeconds(0);
    } else if (mode === SHORT_BREAK) {
      toast.info('☕ Short break over! Back to deep work 👩‍💻');
      setMode(WORK);
      setMinutes(durations[WORK]);
      setSeconds(0);
    } else if (mode === LONG_BREAK) {
      toast.success('🌟 Long break done! Let’s power up again ⚡');
      setMode(WORK);
      setMinutes(durations[WORK]);
      setSeconds(0);
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s === 0) {
            setMinutes((m) => {
              if (m === 0) {
                handleSessionEnd();
                return 0;
              }
              return m - 1;
            });
            return 59;
          }
          return s - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, mode, cycle]);

  const handleStart = () => {
    setIsRunning(true);
    if (mode === SHORT_BREAK) {
      toast.info('🧘 Short break started – breathe and stretch');
    } else if (mode === LONG_BREAK) {
      toast.info('🌴 Long break started – relax fully');
    } else {
      toast('🔔 Focus mode on. Let’s get productive!');
    }
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setMinutes(durations[mode]);
    setSeconds(0);
    toast.warning('⏹️ Timer reset');
  };

  return (
    <div className="bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-xl w-full max-w-md mx-auto text-center transition-all">
      <CircularProgress percentage={progress} />

      <div className="text-[5.5rem] font-extrabold font-mono my-6 tracking-wider text-gray-900 drop-shadow-md">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className="flex justify-center gap-4 mt-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="px-6 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            Start
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="px-6 py-2 rounded-xl text-white bg-yellow-500 hover:bg-yellow-600 transition"
          >
            Pause
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-6 py-2 rounded-xl text-white bg-red-500 hover:bg-red-600 transition"
        >
          Reset
        </button>
      </div>

      <p className="text-sm text-gray-500 mt-4">Cycle: {cycle % 4}/4</p>

      {/* 🔊 Hidden audio for mode switch sound */}
      <audio ref={audioRef} src="/sounds/switch.mp3" preload="auto" />
    </div>
  );
};

export default PomodoroTimer;

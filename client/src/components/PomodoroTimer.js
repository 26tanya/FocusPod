import React, { useEffect, useState, useRef } from 'react';

const MODES = {
WORK: 'work',
SHORT_BREAK: 'shortBreak',
LONG_BREAK: 'longBreak',
};

const DURATIONS = {
work: 25,
shortBreak: 5,
longBreak: 15,
};

const PomodoroTimer = () => {
const [mode, setMode] = useState(MODES.WORK);
const [minutes, setMinutes] = useState(DURATIONS.work);
const [seconds, setSeconds] = useState(0);
const [isRunning, setIsRunning] = useState(false);
const [pomodoroCount, setPomodoroCount] = useState(0);

const timerRef = useRef(null);

useEffect(() => {
if (isRunning) {
timerRef.current = setInterval(() => {
setSeconds((prevSec) => {
if (prevSec === 0) {
if (minutes === 0) {
handleSessionEnd();
return 0;
}
setMinutes((m) => m - 1);
return 59;
}
return prevSec - 1;
});
}, 1000);
} else {
clearInterval(timerRef.current);
}

return () => clearInterval(timerRef.current);
}, [isRunning, minutes]);

const handleSessionEnd = () => {
setIsRunning(false);
if (mode === MODES.WORK) {
const nextCount = pomodoroCount + 1;
setPomodoroCount(nextCount);
if (nextCount % 4 === 0) {
switchMode(MODES.LONG_BREAK);
} else {
switchMode(MODES.SHORT_BREAK);
}
} else {
switchMode(MODES.WORK);
}
};

const switchMode = (newMode) => {
setMode(newMode);
setMinutes(DURATIONS[newMode]);
setSeconds(0);
setIsRunning(false);
};

const handleStart = () => {
setIsRunning(true);
};

const handlePause = () => {
setIsRunning(false);
};

const handleReset = () => {
setIsRunning(false);
setMinutes(DURATIONS[mode]);
setSeconds(0);
};

return (
<div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto text-center mt-6">
<h2 className="text-2xl font-bold mb-4">
{mode === 'work' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
</h2>

  <div className="text-6xl font-mono mb-6">
    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
  </div>

  <div className="flex justify-center gap-4 mb-4">
    {!isRunning ? (
      <button onClick={handleStart} className="px-4 py-2 bg-green-600 text-white rounded-xl shadow">
        Start
      </button>
    ) : (
      <button onClick={handlePause} className="px-4 py-2 bg-yellow-500 text-white rounded-xl shadow">
        Pause
      </button>
    )}
    <button onClick={handleReset} className="px-4 py-2 bg-red-500 text-white rounded-xl shadow">
      Reset
    </button>
  </div>

  <p className="text-sm text-gray-500">
    Pomodoros Completed: {pomodoroCount}
  </p>
</div>
);
};

export default PomodoroTimer;
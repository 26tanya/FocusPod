import React from 'react';
import FocusTimer from '../components/FocusTimer';
import PomodoroTimer from '../components/PomodoroTimer';
import Notes from '../components/Notes';
import { useSearchParams } from 'react-router-dom';

const SoloRoom = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'custom';
  const duration = parseInt(searchParams.get('duration')) || 25;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {mode === 'custom' ? (
        <FocusTimer isSolo initialDuration={duration} />
      ) : (
        <PomodoroTimer />
      )}
      <Notes />
    </div>
  );
};

export default SoloRoom;

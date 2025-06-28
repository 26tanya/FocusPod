import React, { useState } from 'react';
import FocusTimer from '../components/FocusTimer';
import PomodoroTimer from '../components/PomodoroTimer';
import ModeSelector from '../components/ModeSelector';
import Notes from '../components/Notes';
const SoloRoom = () => {
  const [selectedMode, setSelectedMode] = useState('custom'); // default mode

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <ModeSelector selectedMode={selectedMode} setSelectedMode={setSelectedMode} />

      {selectedMode === 'custom' ? (
        <FocusTimer isSolo />
      ) : (
        <PomodoroTimer />
      )}
      <Notes/>
    </div>
  );
};

export default SoloRoom;

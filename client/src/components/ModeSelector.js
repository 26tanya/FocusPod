import React from 'react';

const ModeSelector = ({ selectedMode, setSelectedMode }) => {
  return (
    <div className="text-center mb-6">
      <h2 className="text-xl font-semibold mb-4">Choose Timer Mode</h2>
      <div className="flex justify-center gap-4">
        <button
          className={`px-4 py-2 rounded-lg shadow ${selectedMode === 'custom' ? 'bg-indigo-600 text-white' : 'bg-white'}`}
          onClick={() => setSelectedMode('custom')}
        >
          🛠️ Custom Timer
        </button>
        <button
          className={`px-4 py-2 rounded-lg shadow ${selectedMode === 'pomodoro' ? 'bg-indigo-600 text-white' : 'bg-white'}`}
          onClick={() => setSelectedMode('pomodoro')}
        >
          🍅 Pomodoro Mode
        </button>
      </div>
    </div>
  );
};

export default ModeSelector;

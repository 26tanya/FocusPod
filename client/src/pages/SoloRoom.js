import React from 'react';
import FocusTimer from '../components/FocusTimer';
import PomodoroTimer from '../components/PomodoroTimer';
import Notes from '../components/Notes';
import { useSearchParams } from 'react-router-dom';
import SessionGoals from '../components/SessionGoals';
import backgroundImage from '../Photos/bg1.jpg';

const SoloRoom = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'custom';
  const duration = parseInt(searchParams.get('duration')) || 25;

  return (
    <div
      className="min-h-screen py-10 px-4 space-y-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Session Goals (Top) */}
      <div className="backdrop-blur-sm bg-white/60 rounded-2xl p-6 shadow-xl w-full max-w-3xl mx-auto transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
        <SessionGoals />
      </div>

      {/* Timer (Center) */}
      <div className="backdrop-blur-sm bg-white/60 rounded-2xl p-8 shadow-xl w-full max-w-xl mx-auto flex justify-center items-center min-h-[280px] transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
        {mode === 'custom' ? (
          <FocusTimer isSolo initialDuration={duration} large />
        ) : (
          <PomodoroTimer />
        )}
      </div>

      {/* Notes (Bottom) */}
      
        <Notes />
      
    </div>
  );
};

export default SoloRoom;

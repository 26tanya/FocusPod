// src/pages/ProgressPage.js
import React from 'react';
import ProgressSection from '../components/ProgressSection';
import StreakTracker from '../components/StreakTracker';
const ProgressPage = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">📊 Your Progress</h1>
      <ProgressSection />
      <StreakTracker/>
    </div>
  );
};

export default ProgressPage;

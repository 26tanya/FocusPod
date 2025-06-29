import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const StreakTracker = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!user?._id) return;

    axios.get(`http://localhost:5000/api/progress/weekly/${user._id}`)
      .then(res => {
        console.log('✅ API response:', res.data);
        let dailyTotals = res.data.dailyTotals;
        if (!dailyTotals || Object.keys(dailyTotals).length === 0) {
      // Fallback dummy data
      dailyTotals = {
        "2025-06-27": 60,
        "2025-06-26": 45,
        "2025-06-25": 30,
        "2025-06-24": 0,
      };
    }
        let count = 0;

        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const key = date.toLocaleDateString('en-CA');

          if (dailyTotals[key] && dailyTotals[key] > 0) {
            count++;
          } else {
            break;
          }
        }

        setStreak(count);
      })
      .catch(err => console.error('Error fetching streak:', err));
  }, [user]);

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-xl shadow mt-6">
      <p className="font-semibold text-lg">🔥 Streak</p>
      {streak > 0 ? (
        <>
          <p className="text-2xl font-bold mt-1">{streak} {streak === 1 ? 'day' : 'days'}</p>
          <p className="text-sm text-gray-600">You've studied for {streak} consecutive {streak === 1 ? 'day' : 'days'}!</p>
        </>
      ) : (
        <>
          <p className="text-2xl font-bold mt-1">No streak yet</p>
          <p className="text-sm text-gray-600">Start a session today to begin your streak! </p>
        </>
      )}
    </div>
  );
};

export default StreakTracker;

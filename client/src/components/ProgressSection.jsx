import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ProgressSection = () => {
  const { user } = useAuth();
  const [todayStats, setTodayStats] = useState({ totalMinutes: 0, sessionCount: 0 });
  const [weeklyData, setWeeklyData] = useState([
   
  ]);
console.log("Fetching progress for user:", user?._id);

  // Fetch today's stats
  useEffect(() => {
    if (!user?._id) return;

    axios.get(`http://localhost:5000/api/progress/today/${user._id}`)
      .then(res => setTodayStats(res.data))
      .catch(err => console.error('Error fetching today stats:', err));
  }, [user]);

  // Fetch weekly data
  useEffect(() => {
    if (!user?._id) return;

    axios.get(`http://localhost:5000/api/progress/weekly/${user._id}`)
      .then(res => {
        const data = [];

        // Fill all 7 days even if no session
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const key = date.toISOString().split('T')[0]; // YYYY-MM-DD

          data.push({
            date: key.slice(5), // MM-DD
            minutes: res.data.dailyTotals[key] || 0,
          });
        }

        setWeeklyData(data);
        
      })
      .catch(err => console.error('Error fetching weekly stats:', err));
  }, [user]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">📈 Progress</h2>

      <div className="flex justify-around mb-4">
        <div className="text-center">
          <p className="text-4xl font-mono text-green-600">{todayStats.totalMinutes}</p>
          <p className="text-sm text-gray-500">Minutes Today</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-mono text-blue-600">{todayStats.sessionCount}</p>
          <p className="text-sm text-gray-500">Sessions Completed</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="minutes" fill="#8884d8" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressSection;

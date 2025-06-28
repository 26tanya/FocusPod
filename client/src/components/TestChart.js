import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const dummyData = [
  { date: '06-21', minutes: 25 },
  { date: '06-22', minutes: 30 },
  { date: '06-23', minutes: 15 },
  { date: '06-24', minutes: 0 },
  { date: '06-25', minutes: 45 },
  { date: '06-26', minutes: 60 },
  { date: '06-27', minutes: 90 },
];

const TestChart = () => {
  return (
    <div className="p-6 border border-red-500">
      <h2 className="text-lg font-bold mb-2">📊 Test Chart</h2>
      <BarChart width={500} height={300} data={dummyData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="minutes" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default TestChart;

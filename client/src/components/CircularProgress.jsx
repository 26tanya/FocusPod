import React from 'react';

const CircularProgress = ({ percentage, size = 140, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  return (
    <svg width={size} height={size} className="mx-auto mb-4 drop-shadow-xl">
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      {/* Background ring */}
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />

      {/* Progress ring */}
      <circle
        stroke="url(#progressGradient)"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{
          transition: 'stroke-dashoffset 0.5s ease-out',
          filter: 'drop-shadow(0px 0px 6px rgba(99, 102, 241, 0.6))',
        }}
      />

      {/* Percentage text */}
      <text
        x="50%"
        y="50%"
        dy="0.3em"
        textAnchor="middle"
        className="text-2xl font-bold fill-gray-800"
      >
        {Math.round(percentage)}%
      </text>
    </svg>
  );
};

export default CircularProgress;

// components/SessionGoals.js
import React, { useState } from 'react';

const SessionGoals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, { text: newGoal.trim(), done: false }]);
      setNewGoal('');
    }
  };

  const toggleGoal = (index) => {
    const updated = [...goals];
    updated[index].done = !updated[index].done;
    setGoals(updated);
  };

  const removeGoal = (index) => {
    const updated = [...goals];
    updated.splice(index, 1);
    setGoals(updated);
  };

  return (
    <div className="bg-gray-100 rounded-xl p-4 mt-6 shadow-md">
      <h3 className="text-xl font-semibold mb-3">🎯 Goal of the Session</h3>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 border p-2 rounded"
          placeholder="Enter a goal..."
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
        />
        <button
          onClick={handleAddGoal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {goals.map((goal, index) => (
          <li
            key={index}
            className={`flex justify-between items-center p-2 rounded ${
              goal.done ? 'bg-green-100 line-through' : 'bg-white'
            }`}
          >
            <span>{goal.text}</span>
            <div className="space-x-2">
              <button
                onClick={() => toggleGoal(index)}
                className="text-sm text-green-600 hover:underline"
              >
                {goal.done ? 'Undo' : 'Done'}
              </button>
              <button
                onClick={() => removeGoal(index)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionGoals;

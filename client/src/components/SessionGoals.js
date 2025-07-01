import React, { useState } from 'react';
import { FiCheck, FiTrash, FiPlus } from 'react-icons/fi';

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
    <div className=" w-[350px] bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-4 border border-blue-100 z-20">
      <h3 className="text-lg font-bold mb-3 text-gray-800 flex items-center gap-2">
        🎯 Goal of the Session
      </h3>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter a goal..."
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
        />
        <button
          onClick={handleAddGoal}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 rounded-md flex items-center justify-center"
          title="Add Goal"
        >
          <FiPlus />
        </button>
      </div>

      <ul className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
        {goals.map((goal, index) => (
          <li
            key={index}
            className={`flex justify-between items-center px-3 py-2 rounded-lg transition-all duration-200 ${
              goal.done ? 'bg-green-100 text-gray-700 line-through' : 'bg-white text-gray-800'
            }`}
          >
            <span className="flex-1 truncate">{goal.text}</span>
            <div className="flex gap-2 items-center ml-2">
              <button
                onClick={() => toggleGoal(index)}
                className="text-green-600 hover:text-green-800"
                title={goal.done ? 'Undo' : 'Mark Done'}
              >
                <FiCheck />
              </button>
              <button
                onClick={() => removeGoal(index)}
                className="text-red-500 hover:text-red-700"
                title="Delete"
              >
                <FiTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionGoals;

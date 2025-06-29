import React, { useState, useEffect } from 'react';
import { FiDownload, FiTrash2 } from 'react-icons/fi';

const Notes = () => {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('focus-notes');
    if (saved) setNotes(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('focus-notes', notes);
  }, [notes]);

  const handleDownload = () => {
    const blob = new Blob([notes], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `focus-notes-${Date.now()}.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your notes?')) {
      setNotes('');
      localStorage.removeItem('focus-notes');
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl p-6 border border-blue-100 w-[450px] h-[500px] mx-auto mt-10 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">📝 Notes</h2>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg shadow text-sm"
          >
            <FiDownload />
            Download
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg shadow text-sm"
          >
            <FiTrash2 />
            Clear
          </button>
        </div>
      </div>

      <div className="relative flex-grow">
        <textarea
          className="w-full h-full border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white rounded-xl p-3 text-gray-700 font-medium resize-none overflow-y-auto"
          placeholder="Write your notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Notes;

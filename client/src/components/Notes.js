import React, { useState, useEffect, useRef } from 'react';
import { FiDownload, FiTrash2, FiX } from 'react-icons/fi';

const Notes = ({ sessionId, onClose }) => {
  const [notes, setNotes] = useState('');
  const hasLoaded = useRef(false); // ✅ prevent overwriting on first render

  useEffect(() => {
    const saved = localStorage.getItem(`focus-notes-${sessionId}`);
    if (saved) setNotes(saved);
    hasLoaded.current = true;
  }, [sessionId]);

  useEffect(() => {
    if (hasLoaded.current) {
      localStorage.setItem(`focus-notes-${sessionId}`, notes);
    }
  }, [notes, sessionId]);

  const handleDownload = () => {
    const blob = new Blob([notes], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `focus-notes-${sessionId}.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const handleClear = () => {
    if (window.confirm('Clear all notes for this session?')) {
      setNotes('');
      localStorage.removeItem(`focus-notes-${sessionId}`);
    }
  };

  return (
    <div className="fixed top-3 left-6 z-20 bg-white w-[400px] h-[480px] rounded-2xl shadow-2xl border border-blue-200 flex flex-col overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 border-b bg-blue-50">
        <h2 className="text-lg font-semibold text-gray-800">📝 Notes</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">
          <FiX size={20} />
        </button>
      </div>

      <div className="flex-grow px-4 py-3">
        <textarea
          className="w-full h-full border border-blue-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Write your notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex justify-between items-center px-4 py-3 border-t bg-blue-50">
        <button
          onClick={handleClear}
          className="flex items-center gap-1 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md"
        >
          <FiTrash2 size={14} />
          Clear
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md"
        >
          <FiDownload size={14} />
          Download
        </button>
      </div>
    </div>
  );
};

export default Notes;

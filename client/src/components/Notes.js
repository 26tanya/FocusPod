import React, { useState } from 'react';

const Notes = () => {
const [notes, setNotes] = useState('');

const handleDownload = () => {
const blob = new Blob([notes], { type: 'text/plain' });
const link = document.createElement('a');
link.download = `focus-notes-${Date.now()}.txt`;
link.href = URL.createObjectURL(blob);
link.click();
};

return (
<div className="bg-white rounded-xl shadow p-4 mt-6 max-w-2xl mx-auto">
<div className="flex justify-between items-center mb-2">
<h2 className="text-xl font-semibold">📝 Take Notes</h2>
<button onClick={handleDownload} className="bg-blue-500 text-white px-4 py-1 rounded shadow" >
Download
</button>
</div>
<textarea
className="w-full h-60 border rounded p-3 text-gray-800"
placeholder="Write your notes here..."
value={notes}
onChange={(e) => setNotes(e.target.value)}
/>
</div>
);
};

export default Notes;
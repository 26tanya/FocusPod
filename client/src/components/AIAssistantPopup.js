// src/components/AIAssistantPopup.jsx
import { useState,useEffect } from 'react';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import axios from 'axios';

const AIAssistantPopup = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/ai/ask', { prompt: question });
      setResponse(data.reply);
    } catch (err) {
      setResponse("⚠️ AI failed to respond.");
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  console.log("✅ AIAssistantPopup mounted");
}, []);
  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
          >
            <FaRobot size={24} />
          </button>
        )}

        {open && (
          <div className="w-80 h-[28rem] bg-white rounded-2xl shadow-2xl p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-lg text-gray-800">AI Assistant</h2>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-red-500">
                <IoClose size={22} />
              </button>
            </div>

            <div className="text-sm text-gray-600 mb-3">
              Ask me anything: study tips, motivation, doubts, summaries!
            </div>

            <textarea
              rows={3}
              className="w-full p-2 border rounded resize-none text-sm focus:outline-blue-400"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question..."
            />

            <button
              onClick={handleAsk}
              disabled={loading}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center"
            >
              {loading ? "Thinking..." : (
                <>
                  Ask <FaPaperPlane className="ml-2" />
                </>
              )}
            </button>

            {response && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-sm overflow-y-auto max-h-40 whitespace-pre-wrap">
                {response}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AIAssistantPopup;

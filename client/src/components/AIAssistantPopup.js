// src/components/AIAssistantPopup.jsx
import { useState, useEffect, useRef } from 'react';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import axios from 'axios';
import { motion } from 'framer-motion';

const AIAssistantPopup = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const responseRef = useRef(null);

  // Load saved messages from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("focuspod-ai-messages");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Save messages to localStorage on every update
  useEffect(() => {
    localStorage.setItem("focuspod-ai-messages", JSON.stringify(messages));
  }, [messages]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    const newMessage = { role: 'user', content: question };
    setMessages((prev) => [...prev, newMessage]);
    setQuestion('');
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/ai/ask', { prompt: newMessage.content });
      const reply = { role: 'assistant', content: '' };
      setMessages((prev) => [...prev, reply]);
      for (let i = 0; i < data.reply.length; i++) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content += data.reply[i];
          return updated;
        });
        await new Promise((res) => setTimeout(res, 15));
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: '⚠️ AI failed to respond.' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(true)}
          className="bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg"
        >
          <FaRobot size={24} />
        </motion.button>
      )}

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="w-80 h-[32rem] bg-white rounded-2xl shadow-2xl p-4 flex flex-col border border-gray-200 backdrop-blur-sm"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-lg text-gray-800">AI Assistant</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-red-500"
            >
              <IoClose size={22} />
            </button>
          </div>

          <div className="text-sm text-gray-600 mb-2">
            Ask me anything: study tips, motivation, doubts, summaries!
          </div>

          <div
            ref={responseRef}
            className="flex-1 overflow-y-auto bg-gray-50 p-2 rounded border text-sm space-y-2"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-blue-100 text-blue-900 self-end text-right'
                    : 'bg-green-100 text-green-900 self-start text-left'
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <textarea
            rows={2}
            className="w-full p-2 border rounded mt-3 resize-none text-sm focus:outline-blue-400"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question..."
          />

          <button
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center"
          >
            {loading ? "Thinking..." : (
              <>
                Ask <FaPaperPlane className="ml-2" />
              </>
            )}
          </button>

          <button
            onClick={() => {
              setMessages([]);
              localStorage.removeItem("focuspod-ai-messages");
            }}
            className="text-xs text-gray-400 underline hover:text-red-600 mt-2"
          >
            Clear history
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default AIAssistantPopup;
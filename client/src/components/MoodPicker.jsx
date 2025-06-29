import { useState } from 'react';
import { motion } from 'framer-motion';

const moods = [
  { emoji: '😄', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😫', label: 'Tired' },
];

const moodMessages = {
  Happy: [
    "You're already shining—channel that joy into deep focus! ✨",
    "Let that smile fuel your productivity! 😄",
    "When you feel good, great things happen. Let's do this! 🚀",
    "Focus mode: powered by happiness 💡"
  ],
  Neutral: [
    "Not every day needs to be intense—steady progress wins. ⚖️",
    "Showing up is half the battle—you're doing great. 🙌",
    "Keep calm and FocusPod on. 🧘‍♀️",
    "Today might be average, but your effort won't be. 🌱"
  ],
  Tired: [
    "Even 15 minutes of focus is a win. Take it easy. 🌙",
    "Rest is strength. Let’s do a short productive sprint. ⏳",
    "Tired minds can still do focused things—slow and steady. 🐢",
    "Let FocusPod carry the load today—just press start. 🔋"
  ],
};

const MoodPicker = () => {
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');

  const handleMoodClick = (index) => {
    setSelected(index);
    const mood = moods[index].label;
    const options = moodMessages[mood];
    const randomMsg = options[Math.floor(Math.random() * options.length)];
    setMessage(randomMsg);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-black/40 backdrop-blur-md border border-white/10 shadow-xl 
                 rounded-2xl px-6 py-5 w-80 text-white text-center"
    >
      <h3 className="text-lg font-semibold text-white/90 mb-4">
        😊 How are you feeling today?
      </h3>

      <div className="flex justify-center gap-6 text-3xl">
        {moods.map((mood, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.9 }}
            className={`transition transform ${
              selected === i ? 'scale-110' : 'opacity-80 hover:scale-105'
            }`}
            onClick={() => handleMoodClick(i)}
            title={mood.label}
          >
            {mood.emoji}
          </motion.button>
        ))}
      </div>

      {selected !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-sm text-white/80"
        >
          <p className="mb-1">
            You're feeling <span className="font-semibold">{moods[selected].label}</span> today.
          </p>
          <p className="text-white/70 italic">"{message}"</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MoodPicker;

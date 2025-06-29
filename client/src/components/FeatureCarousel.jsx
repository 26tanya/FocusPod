import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsGraphUp, BsClock, BsChatDots, BsStars,BsPen,BsFillLightningChargeFill } from 'react-icons/bs';

const features = [
  {
    icon: <BsClock className="text-4xl text-blue-400" />,
    title: 'Pomodoro Timer',
    description: 'Boost productivity with scientifically proven time blocks.',
  },
  {
    icon: <BsChatDots className="text-4xl text-green-400" />,
    title: 'Group Study Rooms',
    description: 'Stay accountable and study with friends in real-time.',
  },
  {
    icon: <BsStars className="text-4xl text-purple-400" />,
    title: 'AI Study Assistant',
    description: 'Get motivational nudges, summaries, and study tips.',
  },
  {
    icon: <BsGraphUp className="text-4xl text-pink-400" />,
    title: 'Progress Tracker',
    description: 'Track your study streak, session history, and time logged.',
  },
  {
  icon: <BsFillLightningChargeFill className="text-4xl text-yellow-400" />,
  title: 'Solo Focus Mode',
  description: 'Enter deep work mode with timers, goals, and no distractions.',
  },
  {
  icon: <BsPen className="text-4xl text-orange-400" />,
  title: 'Study Notes',
  description: 'Jot down quick notes or summaries during your focus sessions.',
  },
];

const slideVariants = {
  initial: (direction) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
    scale: 0.95,
  }),
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  exit: (direction) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.5, ease: 'easeIn' },
  }),
};

const FeatureCarousel = () => {
  const [[index, direction], setIndex] = useState([0, 1]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(([prev]) => [(prev + 1) % features.length, 1]);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const feature = features[index];

  return (
    <div className="w-full h-full flex items-center justify-center relative z-10">
      <div className="relative w-80 h-52">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute top-0 left-0 w-full h-full 
              bg-black/40 backdrop-blur-md rounded-2xl 
              border border-white/10 shadow-xl 
              text-center p-6 flex flex-col items-center justify-center"
          >
            <motion.div
              className="mb-3"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 120 }}
            >
              {feature.icon}
            </motion.div>
            <h3 className="text-xl font-bold text-white drop-shadow mb-1">{feature.title}</h3>
            <p className="text-sm text-white/90">{feature.description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Gradient Glow Ring */}
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 opacity-30 blur-2xl z-0" />
      </div>
    </div>
  );
};

export default FeatureCarousel;

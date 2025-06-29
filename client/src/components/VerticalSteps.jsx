import { motion } from 'framer-motion';

const steps = [
  'Create focus sessions',
  'Set study goals',
  'Collaborate in group rooms',
  'Track progress visually',
];

const VerticalSteps = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className=" bg-black/40 backdrop-blur-md border border-white/10 shadow-xl 
                 rounded-2xl px-6 py-5 w-80 text-white"
    >
      <h3 className="text-lg font-semibold mb-4 text-white/90 text-center"> How FocusPod Helps?</h3>

      <div className="relative ml-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3 mb-5 relative">
            {/* Dot */}
            <div className="mt-1.5">
              <span className="w-3 h-3 bg-blue-400 rounded-full block"></span>
            </div>
            {/* Text */}
            <p className="text-sm text-white/90">{step}</p>

            {/* Line */}
            {i !== steps.length - 1 && (
              <span className="absolute left-1.5 top-4 h-6 w-0.5 bg-white/20"></span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default VerticalSteps;

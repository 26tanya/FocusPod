import { useEffect, useState } from 'react';

const getGreeting = (hour) => {
  if (hour < 5) return 'Burning the midnight oil? 🦉';
  if (hour < 12) return 'Good Morning, ready to focus? ☀️';
  if (hour < 17) return 'Good Afternoon, stay productive! 🔆';
  if (hour < 21) return 'Good Evening, let’s power through! 🌙';
  return 'Late night grind? Let’s do this! 🌃';
};

const TimeGreeting = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hour = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const greeting = getGreeting(hour);

  return (
    <div className="text-white text-center">
      <p className="text-lg font-medium mb-1">{greeting}</p>
      <p className="text-sm text-white/70">🕒 {hour}:{minutes} — a perfect time to dive in</p>
    </div>
  );
};

export default TimeGreeting;

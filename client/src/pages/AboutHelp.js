import React from 'react';
import { Link } from 'react-router-dom';

const AboutHelp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8cdda] via-[#e2c0f9] to-[#fceabb] px-6 py-10 font-sans">
      <div className="max-w-4xl mx-auto bg-white/90 shadow-2xl rounded-3xl p-10 backdrop-blur-md">
        <h1 className="text-4xl font-extrabold text-pink-600 mb-6 tracking-tight">About FocusPod</h1>
        <p className="text-gray-800 mb-6 leading-relaxed text-lg">
          <strong className="text-purple-700">FocusPod</strong> is your digital productivity companion crafted to support deep focus and collaborative study. Whether you're in solo mode or working with a team, FocusPod keeps you aligned, motivated, and on track.
        </p>

        <h2 className="text-2xl font-semibold text-purple-600 mb-3">✨ Key Features</h2>
        <ul className="list-disc list-inside text-gray-800 mb-6 leading-relaxed text-base pl-4">
          <li><strong>🕒 Focus Timers:</strong> Solo or Group modes with Pomodoro and Custom durations</li>
          <li><strong>💬 Real-Time Group Chat:</strong> Stay connected and accountable</li>
          <li><strong>🎵 Soothing Music:</strong> Built-in player for ambiance and calm</li>
          <li><strong>📝 Notes:</strong> Capture thoughts directly in your session</li>
          <li><strong>🎯 Session Goals:</strong> Set, track, and accomplish micro-goals</li>
          <li><strong>🤖 AI Assistant:</strong> Get study help, summaries, and motivation</li>
          <li><strong>📊 Productivity Insights:</strong> Visualize your progress over time</li>
        </ul>

        <h2 className="text-2xl font-semibold text-purple-600 mb-3">📘 Need Help?</h2>
        <p className="text-gray-800 mb-4 text-base">
          If you're experiencing issues or have questions, try the following:
        </p>
        <ul className="list-disc list-inside text-gray-800 mb-6 pl-4">
          <li>🔄 Refresh your browser or clear cache</li>
          <li>🌐 Check your internet connection</li>
          <li>📬 Contact us at <a href="mailto:support@focuspod.app" className="text-pink-600 hover:underline">support@focuspod.app</a></li>
        </ul>

        <p className="text-gray-800 mb-6 text-base">
          We're constantly improving. More help resources and an FAQ section are on their way!
        </p>

        <Link to="/" className="inline-block mt-4 text-white bg-pink-500 hover:bg-pink-600 px-5 py-2 rounded-full font-medium transition duration-200">
          ⬅ Back to Home
        </Link>
      </div>
    </div>
  );
};

export default AboutHelp;

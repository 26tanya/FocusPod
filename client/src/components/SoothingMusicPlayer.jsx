import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaMusic } from 'react-icons/fa';

const tracks = [
  {
    name: 'Rainfall',
    url: '/sounds/rain.mp3',
  },
  {
    name: 'Forest Birds',
    url: '/sounds/rain2.mp3',
  },
  {
    name: 'Lo-fi Beats',
    url: '/sounds/lofi.mp3',
  },
];

const SoothingMusicPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const currentTrack = tracks[currentTrackIndex];

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const changeTrack = (e) => {
    const selectedIndex = tracks.findIndex((t) => t.name === e.target.value);
    setCurrentTrackIndex(selectedIndex);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  };

  const handleEnded = () => {
    // Shuffle to a different random track
    let nextIndex = Math.floor(Math.random() * tracks.length);
    while (nextIndex === currentTrackIndex && tracks.length > 1) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    }
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  };

  // Autoplay next track when isPlaying is true after shuffle
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  }, [currentTrackIndex]);

  return (
    <div className="z-40 bg-gradient-to-br from-blue-100 to-purple-100 shadow-2xl border border-blue-300 rounded-2xl p-4 w-80">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-lg">
          <FaMusic className="text-purple-600" /> MuseMode
        </h3>
        <select
          value={currentTrack.name}
          onChange={changeTrack}
          className="text-sm border border-blue-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {tracks.map((track) => (
            <option key={track.name} value={track.name}>
              {track.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between items-center mt-3">
        <p className="text-sm text-gray-700 font-medium">{currentTrack.name}</p>
        <button
          onClick={togglePlay}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>

      <audio ref={audioRef} onEnded={handleEnded}>
        <source src={currentTrack.url} type="audio/mp3" />
      </audio>
    </div>
  );
};

export default SoothingMusicPlayer;

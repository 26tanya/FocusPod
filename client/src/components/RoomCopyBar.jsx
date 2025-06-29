import React, { useState } from 'react';
import { FaRegCopy } from 'react-icons/fa';

const RoomCopyBar = ({ roomCode, creatorName }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="text-center mb-8">
      {/* Room Code Row */}
      <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-200 px-5 py-2.5 rounded-full shadow-sm transition-all">
        <span className="text-lg font-mono font-semibold text-blue-700">
          Room Code: <span className="ml-1">{roomCode}</span>
        </span>

        <button
          onClick={handleCopy}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-full text-sm shadow-md transition-all"
          title="Copy code"
        >
          <FaRegCopy className="text-sm" />
        </button>
      </div>

      {/* Copied Message */}
      {copied && (
        <p className="text-green-500 text-sm mt-2 animate-pulse">
          ✅ Room code copied!
        </p>
      )}

      {/* Creator Info */}
      {creatorName && (
        <p className="text-sm mt-3 text-gray-700">
        <span className="font-semibold text-gray-800">Room Creator:</span> {creatorName}
        </p>
      )}
    </div>
  );
};

export default RoomCopyBar;

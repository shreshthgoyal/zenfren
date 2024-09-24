import React from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

export default function MicButton({ listening, handleMicClick }) {
  return (
    <button
      onClick={handleMicClick}
      className="ml-4 p-4 rounded-full focus:outline-none"
    >
      {listening ? (
        <FaMicrophone className="text-2xl text-red-600 animate-pulse" />
      ) : (
        <FaMicrophoneSlash className="text-2xl text-gray-600" />
      )}
    </button>
  );
}

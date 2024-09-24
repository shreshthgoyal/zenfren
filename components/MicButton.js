import React from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

export default function MicButton({ listening, handleMicClick }) {
  return (
    <button
      className="ml-4 text-2xl text-indigo-600 focus:outline-none"
      onClick={handleMicClick}
      title={listening ? 'Stop Recording' : 'Start Recording'}
    >
      <div className="relative">
        {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
        {listening && (
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
        )}
      </div>
    </button>
  );
}

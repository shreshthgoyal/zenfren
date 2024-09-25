import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedCompanion = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [message, setMessage] = useState('');

  const messages = [
    "Hi there!",
    "You got this!",
    "Stay positive!",
    "Keep going!",
    "Believe in you!",
    "Smile :)",
    "You're great!",
    "Good vibes~",
  ];

  const handleHover = () => {
    setIsHovered(true);
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
  };

  return (
    <motion.div
      className="fixed bottom-3 left-3"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={handleHover}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white px-2 py-1 rounded-full shadow-lg"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <p className="text-xs text-purple-600 whitespace-nowrap">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <svg className="w-20 h-20" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED">
              <animate attributeName="offset" values="0;1;0" dur="20s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#3B82F6">
              <animate attributeName="offset" values="1;0;1" dur="20s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
        <path d="M100,10 C150,10 190,50 190,100 C190,150 150,190 100,190 C50,190 10,150 10,100 C10,50 50,10 100,10 Z" fill="none" stroke="url(#gradient)" strokeWidth="4">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 100 100"
            to="360 100 100"
            dur="20s"
            repeatCount="indefinite"
          />
        </path>
        <path d="M100,30 C130,30 160,60 160,100 C160,140 130,170 100,170 C70,170 40,140 40,100 C40,60 70,30 100,30 Z" fill="none" stroke="url(#gradient)" strokeWidth="4">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="360 100 100"
            to="0 100 100"
            dur="15s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </motion.div>
  );
};

export default AnimatedCompanion;
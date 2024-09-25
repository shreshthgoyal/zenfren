import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MicButton from './MicButton';
import { FaMicrophoneSlash, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { Button } from './ui/button';
import BreathingExercise from './BreathingExercise';
import MeditationComponent from './MeditationComponent';

const WriteAction = () => (
  <Button 
    onClick={() => console.log("Write action:", action)}
    className="mt-2 bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
  >
    Write: {action}
  </Button>
);

const BreatheAction = () => (
  <BreathingExercise triggerType="button" triggerText="Breathe Zen" />
);

const MeditateAction = () => (
  <MeditationComponent triggerType="button" triggerText="Zenful Meditation" />
);

const GeneralAction = () => (
  <div className="flex flex-row space-x-2">
    <BreatheAction />
    <MeditateAction />
  </div>
);

export default function ChatPage({
  phase, pageVariants, pageTransition, messages, isTyping,
  input, setInput, handleMicClick, listening, handleSend, toggleTts, ttsEnabled,
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      e.preventDefault();
      handleSend(input);
    }
  };

  const renderActionButton = (action) => {
    const [actionType, ...actionDetails] = action.split(':');
    const actionContent = actionDetails.join(':').trim();

    switch (actionType.toLowerCase()) {
      case 'write':
        return <WriteAction />;
      case 'breathe':
        return <BreatheAction />;
      case 'meditate':
        return <MeditateAction />;
      default:
        return <GeneralAction />;
    }
  };

  return phase === 'chat' && (
    <motion.div
      key="chat"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={pageTransition}
      className="w-full max-w-2xl flex flex-col h-full"
    >
      <h1 className="text-3xl font-bold mb-4 text-indigo-700 text-center">Chat with AI</h1>
      <div className="flex justify-end items-center mb-2">
        <button
          onClick={toggleTts}
          className="flex items-center text-indigo-600 focus:outline-none"
        >
          {ttsEnabled ? (
            <>
              <FaVolumeUp className="text-2xl mr-2" />
              <span className="font-semibold">Bot Voice On</span>
            </>
          ) : (
            <>
              <FaVolumeMute className="text-2xl mr-2" />
              <span className="font-semibold">Bot Voice Off</span>
            </>
          )}
        </button>
      </div>
      <div
        className="flex-grow overflow-y-auto mb-6 space-y-4 p-4 scrollbar"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#A5B4FC #E0E7FF' }}
      >
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-3/4 p-3 rounded-lg ${message.sender === 'bot' ? 'bg-indigo-100 text-indigo-800' : 'bg-purple-100 text-purple-800'}`}
              >
                <p className="text-lg">{message.text}</p>
                {message.action && renderActionButton(message.action)}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-indigo-100 text-indigo-800 p-3 rounded-lg">
                <p className="text-lg">Typing...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <div className="flex w-full relative items-center mb-4">
        <input
          type="text"
          className="flex-grow p-4 text-lg bg-white rounded-full focus:outline-none border border-indigo-300"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <MicButton listening={listening} handleMicClick={handleMicClick} />
        <button
          className="ml-4 px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-full hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none"
          onClick={() => handleSend(input)}
        >
          Send
        </button>
      </div>
    </motion.div>
  );
}
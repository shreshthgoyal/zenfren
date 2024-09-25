import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MicButton from './MicButton';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { HiDotsCircleHorizontal } from 'react-icons/hi';
import { Button } from './ui/button';
import BreathingExercise from './BreathingExercise';
import MeditationComponent from './MeditationComponent';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const WriteAction = () => (
  <Button className="w-full bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
    Write
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
    <WriteAction />
  </div>
);

const ActionPopover = () => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 rounded-full"
      >
        <HiDotsCircleHorizontal className="h-6 w-6" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-48 p-2 bg-white border border-indigo-100 rounded-xl shadow-lg">
      <div className="space-y-2">
        <BreatheAction />
        <MeditateAction />
        <WriteAction />
      </div>
    </PopoverContent>
  </Popover>
);

const CustomActionMessage = "Here are some actions you can take.";

export default function ChatPage({
  phase,
  pageVariants,
  pageTransition,
  messages,
  isTyping,
  input,
  setInput,
  handleMicClick,
  listening,
  handleSend,
  toggleTts,
  ttsEnabled,
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      e.preventDefault();
      handleSend(input);
    }
  };

  const renderActionButton = (action) => {
    const actionType = action.toLowerCase();
    switch (actionType) {
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

  if (phase !== 'chat') return null;

  return (
    <motion.div
      key="chat"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={pageTransition}
      className="w-full max-w-2xl flex flex-col h-full relative"
    >
      <div className="flex justify-between items-center mb-6 bg-indigo-100 p-4 rounded-lg">
        <button
          onClick={toggleTts}
          className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200 focus:outline-none"
        >
          {ttsEnabled ? (
            <FaVolumeUp className="text-2xl" />
          ) : (
            <FaVolumeMute className="text-2xl" />
          )}
        </button>
        <h1 className="text-3xl font-bold text-indigo-700 text-center flex-grow">Chat with AI</h1>
        <ActionPopover />
      </div>
      <div
        className="flex-grow overflow-y-auto mb-6 p-4 scrollbar"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#A5B4FC #E0E7FF' }}
      >
        <AnimatePresence>
          {(() => {
            let botMessageCount = 0;
            return messages.map((message, index) => {
              const isBot = message.sender === 'bot';
              if (isBot) botMessageCount++;
              const showActions = isBot && (botMessageCount === 1 || botMessageCount % 3 === 0);
              const customMessage = showActions ? CustomActionMessage : '';

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
                >
                  <div
                    className={`max-w-3/4 p-3 rounded-lg ${
                      isBot ? 'bg-indigo-100 text-indigo-800' : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    <p className="text-lg leading-relaxed">
                      {message.text}
                      {isBot && showActions && customMessage && (
                        <span className="block mt-4">{customMessage}</span>
                      )}
                    </p>
                    {showActions && message.action && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.action.map((action, actionIndex) => (
                          <React.Fragment key={actionIndex}>
                            {renderActionButton(action)}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            });
          })()}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start mb-4"
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

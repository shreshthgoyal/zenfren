import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MicButton from './MicButton';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { HiDotsCircleHorizontal } from 'react-icons/hi';
import { Button } from './ui/button';
import { BsSend } from "react-icons/bs";
import BreathingExercise from './BreathingExercise';
import MeditationComponent from './MeditationComponent';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import EmailModal from '@/components/EmailModal';
import useCreateDocOrSheet from '@/pages/hooks/useCreateDocOrSheet';
import useHandleClick from '@/pages/hooks/useHandleClick';



const WriteAction = () => {
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [currentAction, setCurrentAction] = useState('doc');
  const { loading: createLoading, handleCreateDocOrSheet } = useCreateDocOrSheet();
  const { loading: loadingReflect, handleClick: handleReflectClick } = useHandleClick();
  const { loading: loadingConnect, handleClick: handleConnectClick } = useHandleClick();

  const handleCreateDocumentOrSheet = (email, action) => {
    handleCreateDocOrSheet(email, action, () => {
      setShowEmailPopup(false);
    });
  };

  const handleWriteClick = () => {
    setCurrentAction('doc');  
    setShowEmailPopup(true); 
  };

  return (<>
    <Button
      onClick={() => handleReflectClick('doc', setCurrentAction, setShowEmailPopup)}
      variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-100"
    >
      Mindful Notes
    </Button>

    <EmailModal
      isOpen={showEmailPopup}
      onClose={() => setShowEmailPopup(false)}
      onSubmit={handleCreateDocumentOrSheet}
      action={currentAction} 
    />
  </>);
};

const TrackMoodAction = () => {
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [currentAction, setCurrentAction] = useState('doc');
  const { loading: createLoading, handleCreateDocOrSheet } = useCreateDocOrSheet();
  const { loading: loadingReflect, handleClick: handleReflectClick } = useHandleClick();
  const { loading: loadingConnect, handleClick: handleConnectClick } = useHandleClick();

  const handleCreateDocumentOrSheet = (email, action) => {
    handleCreateDocOrSheet(email, action, () => {
      setShowEmailPopup(false);
    });
  };

  const handleWriteClick = () => {
    setCurrentAction('sheet');
    setShowEmailPopup(true); 
  };

  return (<>
    <Button
      onClick={() => handleConnectClick('sheet', setCurrentAction, setShowEmailPopup)}
      variant="outline" className="border-cyan-300 text-cyan-600 hover:bg-cyan-200"
    >
      Mood Meter
    </Button>

    <EmailModal
      isOpen={showEmailPopup}
      onClose={() => setShowEmailPopup(false)}
      onSubmit={handleCreateDocumentOrSheet}
      action={currentAction}
    />
  </>);
};

const CrisisAction = () => (
  <Button 
  className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg shadow-lg w-48 mx-auto block transform transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-opacity-50"
  onClick={() => (window.location.href = 'tel:919820466726')}
>
  SOS
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
    <TrackMoodAction />
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
        <TrackMoodAction />
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
    console.log(actionType)
    switch (actionType) {
      case 'write':
        return <div className="flex flex-row space-x-2">
        <WriteAction />
        <TrackMoodAction />
      </div>
      case 'breathe':
        return <BreatheAction />;
      case 'meditate':
        return <MeditateAction />;
      case 'crisis':
        return <CrisisAction />;
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
        <h1 className="text-3xl font-bold text-indigo-700 text-center flex-grow">Find Your Zen</h1>
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
              const showActions = (isBot && (botMessageCount === 1 || botMessageCount % 3 === 0) && message.action) || message.action === 'crisis';
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
          className="ml-2 px-4 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-full hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none"
          onClick={() => handleSend(input)}
        >
          <BsSend />
        </button>
      </div>
    </motion.div>
  );
}

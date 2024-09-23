// pages/express.js

import 'regenerator-runtime/runtime';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVolumeUp,
  FaVolumeMute,
} from 'react-icons/fa';

export default function ExpressAndChat() {
  const [phase, setPhase] = useState('express');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const [currentPrompt, setCurrentPrompt] = useState(
    "What's on your mind right now?"
  );
  const prompts = [
    "What's on your mind right now?",
    'How are you feeling today?',
    "Is there anything you'd like to talk about?",
    "What's been on your mind lately?",
    'Feel free to share your thoughts...',
  ];

  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);

  // State for Quote
  const [quote, setQuote] = useState(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(true);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript =
          event.results[event.results.length - 1][0].transcript.trim();
        if (!isBotSpeaking) {
          setInput((prevInput) => prevInput + ' ' + transcript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };

      recognitionRef.current.onstart = () => {
        setListening(true);
      };

      navigator.mediaDevices.getUserMedia({ audio: true }).catch((error) => {
        console.error('Microphone permission denied:', error);
      });
    } else {
      alert('Browser does not support speech recognition.');
    }
  }, []);

  const speak = (text) => {
    if (ttsEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';

      if (recognitionRef.current && listening) {
        recognitionRef.current.stop();
      }
      setIsBotSpeaking(true);

      utterance.onend = () => {
        setIsBotSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // Fetch Quote on Component Mount using the new API endpoint
  useEffect(() => {
    let isMounted = true;

    const fetchQuote = async () => {
      try {
        const response = await fetch('https://quotes-api-self.vercel.app/quote');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (isMounted) {
          setQuote(data);
          setIsLoadingQuote(false);
        }
      } catch (error) {
        console.error('Error fetching quote:', error.message);
        if (isMounted) {
          setIsLoadingQuote(false);
        }
      }
    };

    fetchQuote();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleExpress = () => {
    if (input.trim() !== '') {
      const userMessage = input.trim();
      const botMessage =
        "Hello! I'm here to listen and chat. How can I assist you today?";
      setMessages([
        { text: userMessage, sender: 'user' },
        { text: botMessage, sender: 'bot' },
      ]);

      // Add smooth transition
      setPhase('transition');
      setTimeout(() => {
        setPhase('chat');
      }, 500);

      setInput('');
    }
  };

  const handleSend = () => {
    if (input.trim() !== '') {
      const userMessage = input.trim();
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: userMessage, sender: 'user' },
      ]);
      setInput('');
      setIsTyping(true);

      if (recognitionRef.current && listening) {
        recognitionRef.current.stop();
      }
      setIsBotSpeaking(true);

      setTimeout(() => {
        const botMessage = 'I understand. Can you tell me more about that?';
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botMessage, sender: 'bot' },
        ]);
        setIsTyping(false);
        speak(botMessage);
        setIsBotSpeaking(false);
      }, 1500);
    }
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const toggleTts = () => {
    setTtsEnabled(!ttsEnabled);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Animation variants for smoother transitions
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: -20,
    },
  };

  const pageTransition = {
    duration: 0.5,
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center font-sans p-4 sm:p-8">
      <AnimatePresence mode="wait">
        {phase === 'express' && (
          <motion.div
          key="express"
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={pageTransition}
          className="w-full max-w-2xl flex flex-col items-center relative"
        >
          <h1 className="text-4xl font-bold mb-4 text-indigo-700">
            Express Yourself
          </h1>
        
          <p className="text-xl text-indigo-600 italic mb-2">
            Feel free to share your thoughts...
          </p>
        
          <div className="w-full flex justify-center items-center mb-6">
          <textarea
  className="w-full h-48 p-4 text-xl bg-transparent rounded-xl resize-none overflow-auto transition duration-300 ease-in-out focus:outline-none scrollbar"
  placeholder="Start typing your thoughts here..."
  value={input}
  onChange={(e) => setInput(e.target.value)}
/>

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
          </div>
        
          <button
            className="px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-full hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none"
            onClick={handleExpress}
          >
            Share Thoughts
          </button>
        
          {!isLoadingQuote && quote && (
            <div className="w-full flex justify-center mt-6 pointer-events-none">
              <p className="text-lg text-indigo-600 italic opacity-50 text-center"
                 style={{
                   fontWeight: '300',
                   textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'
                 }}>
                "{quote.quote}" - {quote.author}
              </p>
            </div>
          )}
        </motion.div>        
        )}

        {phase === 'chat' && (
          <motion.div
            key="chat"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
            className="w-full max-w-2xl flex flex-col h-full"
          >
            <h1 className="text-3xl font-bold mb-4 text-indigo-700 text-center">
              Chat with AI
            </h1>

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
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#A5B4FC #E0E7FF',
              }}
            >
              <style jsx>{`
                .scrollbar::-webkit-scrollbar {
                  width: 8px;
                }
                .scrollbar::-webkit-scrollbar-track {
                  background: #e0e7ff;
                  border-radius: 8px;
                }
                .scrollbar::-webkit-scrollbar-thumb {
                  background-color: #a5b4fc;
                  border-radius: 8px;
                  border: 2px solid #e0e7ff;
                }
                .scrollbar::-webkit-scrollbar-thumb:hover {
                  background-color: #6366f1;
                }
              `}</style>

              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`flex ${
                      message.sender === 'bot'
                        ? 'justify-start'
                        : 'justify-end'
                    }`}
                  >
                    <div
                      className={`max-w-3/4 p-3 rounded-lg ${
                        message.sender === 'bot'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      <p className="text-lg">{message.text}</p>
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
              <div ref={chatEndRef} />
            </div>

            <div className="flex w-full relative items-center mb-4">
              <input
                type="text"
                className="flex-grow p-4 text-lg bg-white rounded-full focus:outline-none border border-indigo-300"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                className="absolute right-36 text-2xl text-indigo-600 focus:outline-none"
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-4 px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-full hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none"
                onClick={handleSend}
              >
                Send
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

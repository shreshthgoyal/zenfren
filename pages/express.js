import 'regenerator-runtime/runtime';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

export default function ExpressAndChat() {
  const [phase, setPhase] = useState('express');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const [currentPrompt, setCurrentPrompt] = useState("What's on your mind right now?");
  const prompts = [
    "What's on your mind right now?",
    "How are you feeling today?",
    "Is there anything you'd like to talk about?",
    "What's been on your mind lately?",
    "Feel free to share your thoughts..."
  ];

  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
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
        if (recognitionRef.current && listening) {
          recognitionRef.current.start();
        }
      };

      window.speechSynthesis.speak(utterance);
    }
  };

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
      const botMessage = "Hello! I'm here to listen and chat. How can I assist you today?";
      setMessages([
        { text: userMessage, sender: 'user' },
        { text: botMessage, sender: 'bot' }
      ]);
      setPhase('chat');
      setInput('');
      speak(botMessage);
      if (recognitionRef.current && !isBotSpeaking) {
        recognitionRef.current.start();
        setListening(true);
      }
    }
  };

  const handleSend = () => {
    if (input.trim() !== '') {
      const userMessage = input.trim();
      setMessages((prevMessages) => [...prevMessages, { text: userMessage, sender: 'user' }]);
      setInput('');
      setIsTyping(true);

      if (recognitionRef.current && listening) {
        recognitionRef.current.stop();
      }
      setIsBotSpeaking(true);

      setTimeout(() => {
        const botMessage = 'I understand. Can you tell me more about that?';
        setMessages((prevMessages) => [...prevMessages, { text: botMessage, sender: 'bot' }]);
        setIsTyping(false);
        speak(botMessage);
        setIsBotSpeaking(false);
        if (recognitionRef.current) {
          recognitionRef.current.start();
          setListening(true);
        }
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
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const toggleTts = () => {
    setTtsEnabled(!ttsEnabled);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center font-sans p-4 sm:p-8">
      <AnimatePresence mode="wait">
        {phase === 'express' ? (
          <motion.div
            key="express"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl flex flex-col items-center"
          >
            <h1 className="text-4xl font-bold mb-6 text-indigo-700">Express Yourself</h1>

            <div className="mb-6 h-8 text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentPrompt}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl text-indigo-600 italic"
                >
                  {currentPrompt}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="relative w-full mb-6">
              <textarea
                className="w-full h-48 p-4 text-xl bg-transparent rounded-xl resize-none transition duration-300 ease-in-out focus:outline-none"
                placeholder="Start typing your thoughts here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                className="absolute right-4 bottom-4 text-2xl text-indigo-600 focus:outline-none"
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

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-full hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none"
              onClick={handleExpress}
            >
              Share Thoughts
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
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
                  background: #E0E7FF;
                  border-radius: 8px;
                }
                .scrollbar::-webkit-scrollbar-thumb {
                  background-color: #A5B4FC;
                  border-radius: 8px;
                  border: 2px solid #E0E7FF;
                }
                .scrollbar::-webkit-scrollbar-thumb:hover {
                  background-color: #6366F1;
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
                      message.sender === 'bot' ? 'justify-start' : 'justify-end'
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
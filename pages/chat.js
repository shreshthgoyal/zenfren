import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (router.isReady) {
      const { input: initialInput, mood } = router.query;
      if (initialInput) {
        const decodedInput = decodeURIComponent(initialInput);
        setMessages([
          { text: decodedInput, sender: 'user' },
          { text: `I see you're feeling ${getMoodDescription(parseInt(mood))}. Can you tell me more about that?`, sender: 'bot' }
        ]);
      }
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getMoodDescription = (moodValue) => {
    const moods = ['very low', 'not great', 'neutral', 'good', 'great'];
    return moods[moodValue - 1] || 'neutral';
  };

  const handleSend = () => {
    if (input.trim() !== '') {
      setMessages(prevMessages => [...prevMessages, { text: input, sender: 'user' }]);
      setInput('');
      setIsTyping(true);
      
      // Simulate bot response
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prevMessages => [...prevMessages, { text: "I understand. Can you elaborate on that?", sender: 'bot' }]);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center p-8 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 flex flex-col h-[80vh]">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">Chat with AI</h1>
        
        <div className="flex-grow overflow-y-auto mb-4 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-3/4 p-3 rounded-lg ${message.sender === 'bot' ? 'bg-indigo-100 text-indigo-800' : 'bg-pink-100 text-pink-800'}`}>
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
        
        <div className="flex">
          <input
            type="text"
            className="flex-grow p-3 text-lg border-2 border-indigo-200 rounded-l-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-r-full hover:bg-indigo-700 transition duration-300 ease-in-out"
            onClick={handleSend}
          >
            Send
          </motion.button>
        </div>
      </div>
    </div>
  );
}
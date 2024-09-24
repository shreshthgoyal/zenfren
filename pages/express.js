import React, { useState } from 'react';
import ExpressPage from '../components/ExpressPage';
import ChatPage from '../components/ChatPage';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useQuotes } from '../hooks/useQuotes';

export default function ExpressAndChat() {
  const [phase, setPhase] = useState('express');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);

  const { startRecognition, stopRecognition, listening } = useSpeechRecognition({
    onResult: setInput,
    setIsBotSpeaking
  });
  const { speak } = useTextToSpeech({
    setIsBotSpeaking,
    ttsEnabled
  });
  const { quote, isLoadingQuote } = useQuotes();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };
  
  const pageTransition = {
    duration: 0.5
  };

  const handleExpress = () => {
    if (input.trim() !== '') {
      const userMessage = input.trim();
      const botMessage = "Hello! I'm here to listen and chat. How can I assist you today?";
      setMessages([{ text: userMessage, sender: 'user' }, { text: botMessage, sender: 'bot' }]);
      setPhase('transition');
      setTimeout(() => setPhase('chat'), 500);
      setInput('');
    }
  };

  const handleSend = () => {
    if (input.trim() !== '') {
      const userMessage = input.trim();
      setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
      setInput('');
      setIsTyping(true);
      setTimeout(() => {
        const botMessage = 'I understand. Can you tell me more about that?';
        setMessages(prev => [...prev, { text: botMessage, sender: 'bot' }]);
        setIsTyping(false);
        if (ttsEnabled) {
          speak(botMessage);
        }
      }, 1500);
    }
  };

  const handleMicClick = () => {
    if (listening) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  const toggleTts = () => {
    setTtsEnabled(!ttsEnabled);
    if (ttsEnabled) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center font-sans p-4 sm:p-8">
      <ExpressPage {...{ phase, pageVariants, pageTransition, input, setInput, listening, handleMicClick, handleExpress, isLoadingQuote, quote }} />
      <ChatPage {...{ phase, pageVariants, pageTransition, messages, isTyping, chatEndRef: {}, input, setInput, handleMicClick, listening, handleSend, toggleTts, ttsEnabled }} />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import ExpressPage from '../components/ExpressPage';
import ChatPage from '../components/ChatPage';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useQuotes } from '../hooks/useQuotes';
import { v4 as uuidv4 } from 'uuid';

export default function ExpressAndChat() {
  const [phase, setPhase] = useState('express');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const currentSessionId = sessionStorage.getItem('sessionId') || uuidv4();
    sessionStorage.setItem('sessionId', currentSessionId);
    setSessionId(currentSessionId);
  }, []);

  const { startRecognition, stopRecognition, listening } = useSpeechRecognition({
    onResult: setInput,
    setIsBotSpeaking: setIsTyping
  });
  const { speak } = useTextToSpeech({
    setIsBotSpeaking: setIsTyping,
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

  const handleExpress = async () => {
    if (input.trim() !== '') {
      const userMessage = input.trim();
      const { response } = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: userMessage, sessionId })
      }).then(res => res.json());

      const _response = `I understand that you may be feeling upset or frustrated right now.
        However, using harmful language is not the solution. There are healthier ways to express your emotions. Would you like to talk about what's bothering you?`;

      setMessages([{ text: userMessage, sender: 'user' }, { text: response || _response, sender: 'bot' }]);
      setPhase('transition');
      setTimeout(() => setPhase('chat'), 500);
      setInput('');
    }
  };

  const handleSend = async () => {
    if (input.trim() !== '') {
      const userMessage = input.trim();
      setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
      setInput('');
      setIsTyping(true);
      const { response } = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: userMessage, sessionId })
      }).then(res => res.json());

      const _response = `I understand that you may be feeling upset or frustrated right now.
      However, using harmful language is not the solution. There are healthier ways to express your emotions. Would you like to talk about what's bothering you?`;

      setMessages(prev => [...prev, { text: response || _response, sender: 'bot' }]);
      setIsTyping(false);
      if (ttsEnabled) {
        speak(response);
      }
    }
  };

  const handleMicClick = () => {
    listening ? stopRecognition() : startRecognition();
  };

  const toggleTts = () => {
    const newTtsEnabled = !ttsEnabled;
    setTtsEnabled(newTtsEnabled);
    if (newTtsEnabled === false) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center font-sans p-4 sm:p-8">
      <ExpressPage {...{ phase, pageVariants, pageTransition, input, setInput, listening, handleMicClick, handleExpress, isLoadingQuote, quote }} />
      <ChatPage {...{ phase, pageVariants, pageTransition, messages, isTyping, input, setInput, handleMicClick, listening, handleSend, toggleTts, ttsEnabled }} />
    </div>
  );
}

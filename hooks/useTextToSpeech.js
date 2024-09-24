export function useTextToSpeech({ setIsBotSpeaking, ttsEnabled }) {
    const speak = (text) => {
      if (!ttsEnabled) {
        return; 
      }

      if (!('speechSynthesis' in window)) {
        alert('This browser does not support text-to-speech.');
        return;
    }
  
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';

      setIsBotSpeaking(true);
  
      utterance.onend = () => {
        setIsBotSpeaking(false);
      };
  
      window.speechSynthesis.speak(utterance);
    };
  
    return { speak };
  }
  
export const speakText = ({ text, onEnd, onStart, setBotSpeaking }) => {
  if (!('speechSynthesis' in window)) {
      alert('Browser does not support text to speech.');
      return;
  }

  function setVoiceAndSpeak() {
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(voice => voice.name === 'Google UK English Female') || voices.find(voice => voice.lang.startsWith('en-'));

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.pitch = 0.8; 
      utterance.rate = 0.7;

      utterance.onstart = () => {
          onStart();
          setBotSpeaking(true);
      };

      utterance.onend = () => {
          onEnd();
          setBotSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
  }

  if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
  } else {
      setVoiceAndSpeak();
  }
};

export const cancelSpeech = () => {
  if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
  }
};

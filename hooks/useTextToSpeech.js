export function useTextToSpeech({ setIsBotSpeaking, ttsEnabled }) {
  const speak = (text) => {
      if (!('speechSynthesis' in window)) {
          alert('This browser does not support text-to-speech.');
          return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.onstart = () => {
          console.log('Speech synthesis started');
          setIsBotSpeaking(true);
      };
      utterance.onend = () => {
          console.log('Speech synthesis ended');
          setIsBotSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
  };

  return { speak };
}

export function initSpeechRecognition(handlers) {
  const { onResult, onError, onEnd, onStart, setListening } = handlers;

  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = event => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      onResult(transcript);
  };

  recognition.onerror = event => {
      console.error('Speech recognition error:', event.error);
      onError(event.error);
      setListening(false); // Updates state when an error occurs
  };

  recognition.onend = () => {
      onEnd();
      setListening(false); // Ensures state is updated when recognition ends
  };

  recognition.onstart = () => {
      onStart();
      setListening(true); // Ensures state is updated when recognition starts
  };

  return recognition;
}

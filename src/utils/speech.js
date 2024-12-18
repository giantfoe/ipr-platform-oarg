let speechInstance = null;

export const speak = (text) => {
  if (speechInstance) {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    speechInstance = null; // Reset the instance
  } else {
    speechInstance = new SpeechSynthesisUtterance(text);
    speechInstance.lang = 'en-US'; // Set the language
    window.speechSynthesis.speak(speechInstance);
  }
};

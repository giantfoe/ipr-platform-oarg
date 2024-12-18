import React from 'react';
import { speak } from '@/utils/speech';

interface ReadAloudButtonProps {
  text: string; // The text to read aloud
}

const ReadAloudButton: React.FC<ReadAloudButtonProps> = ({ text }) => {
  return (
    <button
      onClick={() => speak(text)}
      aria-label="Read aloud"
      className="fixed bottom-4 right-4 p-3 bg-primary text-white rounded-full shadow-lg"
    >
      📢
    </button>
  );
};

export default ReadAloudButton;

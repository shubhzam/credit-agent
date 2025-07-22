import { useState, useEffect } from 'react';

const TypingBot = ({ responseMessage }) => {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setDisplayedMessage(prev => prev + responseMessage[index]);
      index += 1;
      if (index === responseMessage.length) {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 100); // adjust typing speed here
    return () => clearInterval(typingInterval);
  }, [responseMessage]);

  return (
    <div>
      <p>{displayedMessage}</p>
      {isTyping && <span>...</span>}
    </div>
  );
};


export default TypingBot;

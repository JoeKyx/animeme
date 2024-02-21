import { useState, useEffect } from 'react';


export const useLoadingMessage = (messagesArray: string[]) => {
  const [loadingMessage, setLoadingMessage] = useState('');
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const getRandomMessage = () => {
      const randomIndex = Math.floor(Math.random() * messagesArray.length);
      return messagesArray[randomIndex];
    };

    setLoadingMessage(getRandomMessage());

    const messageInterval = setInterval(() => {
      setLoadingMessage(getRandomMessage());
      setDotCount(0);
    }, 4000); // Adjust interval as needed

    const dotInterval = setInterval(() => {
      setDotCount(prevCount => (prevCount === 3 ? 0 : prevCount + 1));
    }, 1000); // Adjust interval as needed

    return () => {
      clearInterval(messageInterval);
      clearInterval(dotInterval);
    };
  }, [messagesArray]);

  const renderDots = () => {
    return new Array(dotCount).fill('.').join('');
  };

  return `${loadingMessage}`;
};

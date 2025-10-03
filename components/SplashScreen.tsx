import React, { useState, useEffect } from 'react';

const SplashScreen: React.FC = () => {
  const [animationClass, setAnimationClass] = useState('animate-intro-bounce');

  useEffect(() => {
    // Start the explode animation after 9 seconds. The animation itself takes 1 second.
    // This times it to finish around the 10-second mark when the component unmounts.
    const timer = setTimeout(() => {
      setAnimationClass('animate-explode');
    }, 9000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-black overflow-hidden">
      <img 
        src="https://i.ibb.co/QZ0zRxp/IMG-3953.png" 
        alt="SiloSphere Logo" 
        className={`w-32 h-32 rounded-full ${animationClass}`}
      />
    </div>
  );
};

export default SplashScreen;

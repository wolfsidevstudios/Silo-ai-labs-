import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <img 
        src="https://i.ibb.co/QZ0zRxp/IMG-3953.png" 
        alt="SiloSphere Logo" 
        className="w-32 h-32 rounded-full animate-pulse-glow"
      />
    </div>
  );
};

export default SplashScreen;

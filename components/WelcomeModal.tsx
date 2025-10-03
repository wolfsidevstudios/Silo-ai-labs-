import React from 'react';

interface WelcomeModalProps {
  onSignUp: () => void;
  onSignIn: () => void;
  onGuest: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onSignUp, onSignIn, onGuest }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-black/50 border border-white/20 rounded-2xl shadow-2xl p-8 text-center flex flex-col items-center">
        <img 
          src="https://i.ibb.co/QZ0zRxp/IMG-3953.png" 
          alt="SiloSphere Logo" 
          className="w-24 h-24 mb-4" 
        />
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Welcome to SiloSphere</h1>
        <p className="text-gray-400 mb-8 max-w-sm">Join the community to create, share, and discover AI-powered content.</p>
        
        <div className="w-full space-y-4">
          <button
            onClick={onSignUp}
            className="w-full px-8 py-4 rounded-full font-semibold bg-white text-black shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transform hover:-translate-y-px active:translate-y-px active:shadow-inner transition-all duration-200 ease-in-out"
          >
            Sign Up
          </button>
          <button
            onClick={onSignIn}
            className="w-full px-8 py-4 rounded-full font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors"
          >
            Sign In
          </button>
        </div>

        <button
          onClick={onGuest}
          className="mt-6 text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
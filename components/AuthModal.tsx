import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleAuthAction = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
      setError(null);

      try {
        if (view === 'sign_in') {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
        } else {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            alert("Check your email for a confirmation link!");
        }
        onClose(); // Close modal on success
      } catch (err: any) {
         setError(err.error_description || err.message);
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-black/50 border border-white/20 rounded-2xl shadow-2xl p-8 text-center flex flex-col items-center relative">
         <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>
        <img 
          src="https://i.ibb.co/QZ0zRxp/IMG-3953.png" 
          alt="SiloSphere Logo" 
          className="w-20 h-20 mb-4" 
        />
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            {view === 'sign_in' ? "Sign In to SiloSphere" : "Create Your Account"}
        </h1>
        <p className="text-gray-400 mb-8">
            {view === 'sign_in' ? "Welcome back to the community." : "Join to create, share, and discover."}
        </p>
        
        <form onSubmit={handleAuthAction} className="w-full space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
              required
            />
             <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
              required
            />
            <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-3 rounded-full font-semibold bg-white text-black shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transform hover:-translate-y-px active:translate-y-px active:shadow-inner transition-all duration-200 ease-in-out disabled:opacity-50"
            >
                {loading ? 'Processing...' : (view === 'sign_in' ? 'Sign In' : 'Sign Up')}
            </button>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </form>

        <button
          onClick={() => {
              setView(view === 'sign_in' ? 'sign_up' : 'sign_in');
              setError(null);
          }}
          className="mt-6 text-sm text-gray-400 hover:text-white transition-colors"
        >
          {view === 'sign_in' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

// The onClose prop is passed from App.tsx but is no longer needed visually.
// We keep it in the signature to avoid breaking the App.tsx call, though it does nothing.
interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  
  const handleAuthAction = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
      setError(null);

      try {
        if (view === 'sign_in') {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            // No need to call onClose(), auth state change handles the redirect.
        } else {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            setEmailSent(true);
        }
      } catch (err: any) {
         setError(err.error_description || err.message);
      } finally {
        setLoading(false);
      }
  };

  const RightPaneContent = () => {
    if (emailSent) {
      return (
        <div className="w-full max-w-sm text-center">
            <img 
              src="https://i.ibb.co/QZ0zRxp/IMG-3953.png" 
              alt="SiloSphere Logo" 
              className="w-20 h-20 mb-4 mx-auto" 
            />
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                Confirm your email
            </h1>
            <p className="text-gray-400">
                We've sent a confirmation link to <strong className="text-white">{email}</strong>. Please click the link to finish signing up.
            </p>
        </div>
      );
    }

    return (
        <div className="w-full max-w-sm">
            <img 
              src="https://i.ibb.co/QZ0zRxp/IMG-3953.png" 
              alt="SiloSphere Logo" 
              className="w-20 h-20 mb-4 mx-auto md:hidden" // Show logo on mobile
            />
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2 text-center">
                {view === 'sign_in' ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-400 mb-8 text-center">
                {view === 'sign_in' ? "Sign in to continue to SiloSphere." : "Join to create, share, and discover."}
            </p>
            
            <form onSubmit={handleAuthAction} className="w-full space-y-4">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                  required
                />
                 <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                  required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-3 rounded-full font-semibold bg-white text-black shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transform hover:-translate-y-px active:translate-y-px active:shadow-inner transition-all duration-200 ease-in-out disabled:opacity-50"
                >
                    {loading ? 'Processing...' : (view === 'sign_in' ? 'Sign In' : 'Sign Up')}
                </button>
                {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
            </form>

            <button
              onClick={() => {
                  setView(view === 'sign_in' ? 'sign_up' : 'sign_in');
                  setError(null);
              }}
              className="mt-6 text-sm text-gray-400 hover:text-white transition-colors w-full text-center"
            >
              {view === 'sign_in' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white flex animate-fade-in">
      {/* Left Pane (Animated) */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-gray-900 via-black to-indigo-900/80 relative items-center justify-center p-12 overflow-hidden">
        {/* Animated Shapes */}
        <div className="absolute top-10 -left-20 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-drift opacity-50" style={{ animationDelay: '0s', animationDuration: '25s' }}></div>
        <div className="absolute bottom-20 -right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-drift opacity-40" style={{ animationDelay: '5s', animationDuration: '30s' }}></div>
        <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-drift opacity-60" style={{ animationDelay: '10s', animationDuration: '35s' }}></div>

        <div className="relative z-10 text-center">
            <img 
              src="https://i.ibb.co/QZ0zRxp/IMG-3953.png" 
              alt="SiloSphere Logo" 
              className="w-40 h-40 mb-8 mx-auto animate-float"
            />
            <h1 className="text-5xl font-extrabold text-white tracking-tight">
                SiloSphere
            </h1>
            <p className="text-lg text-gray-300 mt-4 max-w-sm mx-auto">
                The future of AI-powered social media. Create, inspire, and connect.
            </p>
        </div>
      </div>

      {/* Right Pane (Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <RightPaneContent />
      </div>
    </div>
  );
};

export default AuthModal;
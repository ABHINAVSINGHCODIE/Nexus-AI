import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
        onSuccess('Successfully authenticated.');
        onClose();
      } else if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
        onSuccess('Account created successfully.');
        onClose();
      } else {
        await sendPasswordResetEmail(auth, email);
        onSuccess('Password reset email sent.');
        setMode('signin');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onSuccess('Google Sign-in successful.');
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md glass-panel p-8 rounded-3xl relative overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-brand-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="text-brand-primary w-6 h-6" />
              </div>
              <h2 className="text-2xl font-display font-bold">
                {mode === 'signin' ? 'Access Nexus Grid' : mode === 'signup' ? 'Create Node Identity' : 'Neural Recovery'}
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                {mode === 'signin' ? 'Enter your credentials to synchronize.' : mode === 'signup' ? 'Initiate your presence in the future.' : 'Reset your authentication parameters.'}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  placeholder="Neural Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-colors"
                  required
                />
              </div>

              {mode !== 'forgot' && (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    placeholder="Security Key"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-colors"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-primary text-black font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,242,255,0.3)] transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : mode === 'signin' ? 'Synchronize' : mode === 'signup' ? 'Initialize' : 'Reset Neural Link'}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-4">
              <button
                onClick={handleGoogleSignIn}
                className="w-full border border-white/10 bg-white/5 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-sm font-medium"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                Continue with Google
              </button>

              <div className="flex justify-between items-center text-xs text-gray-500">
                {mode === 'signin' ? (
                  <>
                    <button onClick={() => setMode('signup')} className="hover:text-brand-primary transition-colors">Create Identity</button>
                    <button onClick={() => setMode('forgot')} className="hover:text-brand-primary transition-colors">Forgot Key?</button>
                  </>
                ) : (
                  <button onClick={() => setMode('signin')} className="w-full hover:text-brand-primary transition-colors text-center">Back to Sign In</button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

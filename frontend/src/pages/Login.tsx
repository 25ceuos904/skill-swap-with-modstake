import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import { Mail, Lock, LogIn, AlertCircle, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo Account Auto-Fill
  const handleQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-[#F8F1F5] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Subtle Pastel Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C38EB4]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#86A8CF]/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-[#D4B8C9] shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Branding */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md overflow-hidden bg-white p-0.5">
            <Logo className="w-full h-full" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#26425A]">SkillSwap</h1>
          <p className="text-sm text-[#5A7288] font-semibold">
            Peer-to-Peer Skill Exchange Platform
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#26425A] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#86A8CF] absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full bg-[#F8F1F5] border border-[#D4B8C9] focus:border-[#C38EB4] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#26425A] placeholder-[#5A7288] outline-none transition font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26425A] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#86A8CF] absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F8F1F5] border border-[#D4B8C9] focus:border-[#C38EB4] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#26425A] placeholder-[#5A7288] outline-none transition font-medium"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl gradient-button flex items-center justify-center gap-2 text-sm font-bold mt-2"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Log In
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Assistant */}
        <div className="mt-6 pt-5 border-t border-[#D4B8C9]">
          <p className="text-[11px] text-[#5A7288] font-bold uppercase tracking-wider text-center mb-2.5">
            Quick Test Accounts (Click to Fill)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('alice@skillswap.edu', 'password123')}
              className="text-left p-2.5 rounded-xl bg-[#F8F1F5] hover:bg-[#C38EB4]/20 border border-[#D4B8C9] text-xs text-[#26425A] transition"
            >
              <div className="font-bold truncate">Alice (React)</div>
              <div className="text-[10px] text-[#5A7288]">alice@skillswap.edu</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('bob@skillswap.edu', 'password123')}
              className="text-left p-2.5 rounded-xl bg-[#F8F1F5] hover:bg-[#C38EB4]/20 border border-[#D4B8C9] text-xs text-[#26425A] transition"
            >
              <div className="font-bold truncate">Bob (Python)</div>
              <div className="text-[10px] text-[#5A7288]">bob@skillswap.edu</div>
            </button>
          </div>
        </div>

        {/* Register Redirect Link */}
        <div className="mt-6 text-center text-xs text-[#5A7288] font-semibold">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#86A8CF] hover:text-[#26425A] font-bold underline inline-flex items-center gap-0.5">
            Register Here <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

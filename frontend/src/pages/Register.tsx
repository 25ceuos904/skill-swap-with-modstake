import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SkillTagInput } from '../components/SkillTagInput';
import { Logo } from '../components/Logo';
import { User, Mail, Lock, UserPlus, AlertCircle, ArrowRight, GraduationCap } from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [education, setEducation] = useState('');
  const [skillsOffered, setSkillsOffered] = useState<string[]>(['React', 'TypeScript']);
  const [skillsWanted, setSkillsWanted] = useState<string[]>(['Python', 'Node.js']);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name,
        email,
        password,
        skillsOffered,
        skillsWanted,
        bio,
        education,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F1F5] flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Background Subtle Pastel Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C38EB4]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#86A8CF]/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-xl glass-card rounded-3xl p-8 border border-[#D4B8C9] shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Branding */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md overflow-hidden bg-white p-0.5">
            <Logo className="w-full h-full" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#26425A]">Join SkillSwap</h1>
          <p className="text-sm text-[#5A7288] font-semibold">
            Create your student profile and start exchanging skills
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#26425A] uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#86A8CF] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="w-full bg-[#F8F1F5] border border-[#D4B8C9] focus:border-[#C38EB4] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#26425A] placeholder-[#5A7288] outline-none transition font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#26425A] uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#86A8CF] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@university.edu"
                  className="w-full bg-[#F8F1F5] border border-[#D4B8C9] focus:border-[#C38EB4] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#26425A] placeholder-[#5A7288] outline-none transition font-medium"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#26425A] uppercase tracking-wider mb-1.5">
                Password *
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

            <div>
              <label className="block text-xs font-bold text-[#26425A] uppercase tracking-wider mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#86A8CF] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F8F1F5] border border-[#D4B8C9] focus:border-[#C38EB4] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#26425A] placeholder-[#5A7288] outline-none transition font-medium"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26425A] uppercase tracking-wider mb-1.5">
              Education / University
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-[#86A8CF] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="Computer Science, Senior Year"
                className="w-full bg-[#F8F1F5] border border-[#D4B8C9] focus:border-[#C38EB4] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#26425A] placeholder-[#5A7288] outline-none transition font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26425A] uppercase tracking-wider mb-1.5">
              Short Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell peers what you love to learn and teach..."
              rows={2}
              className="w-full bg-[#F8F1F5] border border-[#D4B8C9] focus:border-[#C38EB4] rounded-xl p-3 text-sm text-[#26425A] placeholder-[#5A7288] outline-none transition resize-none font-medium"
            ></textarea>
          </div>

          <div className="space-y-4 pt-2 border-t border-[#D4B8C9]">
            <SkillTagInput
              label="Skills You Can Teach (Skills Offered)"
              placeholder="Type skill & press enter (e.g., React, Java)..."
              tags={skillsOffered}
              onChange={setSkillsOffered}
              colorTheme="emerald"
            />

            <SkillTagInput
              label="Skills You Want To Learn (Skills Wanted)"
              placeholder="Type skill & press enter (e.g., Python, Figma)..."
              tags={skillsWanted}
              onChange={setSkillsWanted}
              colorTheme="indigo"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl gradient-button flex items-center justify-center gap-2 text-sm font-bold mt-4"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Creating Account...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Create Profile & Start Swapping
              </>
            )}
          </button>
        </form>

        {/* Login Redirect */}
        <div className="mt-6 text-center text-xs text-[#5A7288] font-semibold">
          Already have an account?{' '}
          <Link to="/login" className="text-[#86A8CF] hover:text-[#26425A] font-bold underline inline-flex items-center gap-0.5">
            Log In Here <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

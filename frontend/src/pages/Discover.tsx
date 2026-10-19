import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { sessionService } from '../services/sessionService';
import { MatchResult } from '../types';
import { MatchCard } from '../components/MatchCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Logo } from '../components/Logo';
import { Search, SlidersHorizontal, CheckCircle2, X } from 'lucide-react';

export const Discover: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTag, setActiveTag] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal State
  const [selectedPeer, setSelectedPeer] = useState<MatchResult['user'] | null>(null);
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [meetingLink, setMeetingLink] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const popularSkills = ['React', 'Python', 'TypeScript', 'Java', 'Figma', 'Node.js', 'SQL', 'Data Science'];

  const fetchMatches = async (skillParam?: string) => {
    if (!user?._id) return;
    setIsLoading(true);
    try {
      const data = await userService.getMatches(user._id, skillParam);
      setMatches(data);
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMatches(searchQuery || activeTag);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, activeTag, user?._id]);

  const handleTagClick = (skill: string) => {
    if (activeTag === skill) {
      setActiveTag('');
    } else {
      setActiveTag(skill);
      setSearchQuery('');
    }
  };

  const handleRequestSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPeer) return;
    setIsSending(true);
    try {
      await sessionService.createSession({
        recipientId: selectedPeer._id,
        scheduledTime: scheduledTime || undefined,
        meetingLink: meetingLink || undefined,
      });
      setSuccessMessage(`Session requested with ${selectedPeer.name}!`);
      setTimeout(() => {
        setSelectedPeer(null);
        setSuccessMessage('');
        setScheduledTime('');
        setMeetingLink('');
      }, 1500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to request session.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Search Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#26425A] flex items-center gap-2">
            <Search className="w-7 h-7 text-[#86A8CF]" />
            Discover Peer Mentors & Learners
          </h1>
          <p className="text-sm text-[#5A7288] font-semibold">
            Search peers by skill to calculate weighted compatibility match scores.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 text-[#86A8CF] absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveTag('');
            }}
            placeholder="Search by skill keyword (e.g. React, Python, Machine Learning)..."
            className="w-full bg-[#F8F1F5] border border-[#D4B8C9] focus:border-[#C38EB4] rounded-2xl pl-12 pr-10 py-3 text-sm text-[#26425A] placeholder-[#5A7288] outline-none transition font-medium shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-[#5A7288] hover:text-[#26425A]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Popular Filter Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-[#5A7288] flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Popular:
          </span>
          {popularSkills.map((skill, idx) => {
            const isActive = activeTag === skill;
            return (
              <button
                key={idx}
                onClick={() => handleTagClick(skill)}
                className={`text-xs font-bold px-3 py-1 rounded-full transition ${
                  isActive
                    ? 'bg-[#C38EB4] text-white shadow-md'
                    : 'bg-[#F8F1F5] hover:bg-[#E1CBD7] text-[#26425A] border border-[#D4B8C9]'
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Peer Grid */}
      {isLoading ? (
        <LoadingSkeleton count={6} />
      ) : matches.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-[#D4B8C9] space-y-3">
          <Logo className="w-12 h-12 mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-[#26425A]">No Matched Peers Found</h3>
          <p className="text-xs text-[#5A7288] font-semibold max-w-md mx-auto">
            Try searching for a different skill or clear your filter. You can also add more skills to your own profile to discover new candidates!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match, idx) => (
            <MatchCard
              key={idx}
              match={match}
              onRequestSession={(peer) => setSelectedPeer(peer)}
            />
          ))}
        </div>
      )}

      {/* Session Request Modal */}
      {selectedPeer && (
        <div className="fixed inset-0 z-50 bg-[#26425A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 border border-[#D4B8C9] max-w-md w-full animate-in fade-in zoom-in-95 duration-150 bg-[#E1CBD7]">
            <h3 className="text-xl font-bold text-[#26425A] mb-1">
              Request Session with {selectedPeer.name}
            </h3>
            <p className="text-xs text-[#5A7288] font-semibold mb-4">
              Schedule a learning exchange session. Peer will confirm your request.
            </p>

            {successMessage ? (
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-900 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>{successMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleRequestSession} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#26425A] uppercase tracking-wider mb-1">
                    Scheduled Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full bg-[#F8F1F5] border border-[#D4B8C9] rounded-xl p-2.5 text-sm text-[#26425A] outline-none focus:border-[#C38EB4] font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#26425A] uppercase tracking-wider mb-1">
                    Meeting Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://meet.jit.si/skillswap-session"
                    className="w-full bg-[#F8F1F5] border border-[#D4B8C9] rounded-xl p-2.5 text-sm text-[#26425A] outline-none focus:border-[#C38EB4] font-medium"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4B8C9]">
                  <button
                    type="button"
                    onClick={() => setSelectedPeer(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F8F1F5] text-[#26425A] hover:bg-[#E1CBD7] border border-[#D4B8C9]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-5 py-2 rounded-xl text-xs font-bold gradient-button"
                  >
                    {isSending ? 'Sending Request...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

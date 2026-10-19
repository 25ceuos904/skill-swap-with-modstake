import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { sessionService } from '../services/sessionService';
import { MatchResult, Session } from '../types';
import { StatCard } from '../components/StatCard';
import { MatchCard } from '../components/MatchCard';
import { SessionCard } from '../components/SessionCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import {
  Award,
  Calendar,
  BookOpen,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  Users,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [requestModalUser, setRequestModalUser] = useState<MatchResult['user'] | null>(null);

  // Request Session Modal State
  const [scheduledTime, setScheduledTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState('');

  const loadDashboardData = async () => {
    if (!user?._id) return;
    setIsLoading(true);
    try {
      const [matchRes, sessionRes] = await Promise.all([
        userService.getMatches(user._id),
        sessionService.getUserSessions(user._id),
      ]);
      setMatches(matchRes);
      setSessions(sessionRes);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user?._id]);

  const activeSessionsCount = sessions.filter(
    (s) => s.status === 'requested' || s.status === 'confirmed'
  ).length;

  const handleCreateSessionRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestModalUser) return;
    setIsRequesting(true);
    try {
      await sessionService.createSession({
        recipientId: requestModalUser._id,
        scheduledTime: scheduledTime || undefined,
        meetingLink: meetingLink || undefined,
      });
      setRequestSuccess(`Session requested successfully with ${requestModalUser.name}!`);
      setTimeout(() => {
        setRequestModalUser(null);
        setRequestSuccess('');
        setScheduledTime('');
        setMeetingLink('');
        loadDashboardData();
      }, 1500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to request session.');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleUpdateStatus = async (sessionId: string, newStatus: any) => {
    try {
      await sessionService.updateSessionStatus(sessionId, newStatus);
      loadDashboardData();
    } catch (err) {
      console.error('Failed to update session status:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="glass-card rounded-3xl p-8 border border-[#D4B8C9] relative overflow-hidden bg-[#E1CBD7]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C38EB4]/20 border border-[#C38EB4]/40 text-[#26425A] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#C38EB4]" /> Peer-to-Peer Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#26425A] tracking-tight">
              Welcome back, <span className="text-[#C38EB4]">{user?.name}</span> 👋
            </h1>
            <p className="text-sm text-[#5A7288] font-semibold leading-relaxed">
              Connect with matched peers, schedule dual-capability learning sessions, share resources, and boost your skill portfolio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/discover"
              className="px-5 py-3 rounded-2xl gradient-button text-sm font-bold flex items-center gap-2 shadow-lg"
            >
              <Search className="w-4 h-4" /> Find Mentors
            </Link>
            <Link
              to="/resources"
              className="px-5 py-3 rounded-2xl bg-[#F8F1F5] hover:bg-[#E1CBD7] border border-[#D4B8C9] text-[#26425A] text-sm font-bold transition flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#86A8CF]" /> Resources
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Points"
          value={`${user?.points || 0} pts`}
          subtitle="Earned from sessions & resources"
          icon={Award}
        />
        <StatCard
          title="Active Sessions"
          value={activeSessionsCount}
          subtitle="Requested & Confirmed"
          icon={Calendar}
        />
        <StatCard
          title="Skills Offered"
          value={user?.skillsOffered?.length || 0}
          subtitle="Skills you teach peers"
          icon={Users}
        />
        <StatCard
          title="Skills Wanted"
          value={user?.skillsWanted?.length || 0}
          subtitle="Skills you seek to learn"
          icon={Sparkles}
        />
      </div>

      {/* Top Matches Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#26425A] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C38EB4]" />
              Your Top Compatible Matches
            </h2>
            <p className="text-xs text-[#5A7288] font-semibold">
              Ranked using weighted mutual compatibility logic
            </p>
          </div>

          <Link
            to="/discover"
            className="text-xs font-bold text-[#86A8CF] hover:text-[#26425A] flex items-center gap-1 transition"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <LoadingSkeleton count={3} />
        ) : matches.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center border border-[#D4B8C9]">
            <p className="text-sm text-[#5A7288] font-semibold">No matches found yet. Add more skills to your profile to trigger matches!</p>
            <Link to="/profile" className="inline-block mt-3 px-4 py-2 gradient-button rounded-xl text-xs font-bold">
              Update Profile Skills
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {matches.slice(0, 3).map((match, idx) => (
              <MatchCard
                key={idx}
                match={match}
                onRequestSession={(peer) => setRequestModalUser(peer)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Session Activity Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#26425A] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#86A8CF]" />
              Recent Sessions
            </h2>
            <p className="text-xs text-[#5A7288] font-semibold">Track and manage your upcoming & past sessions</p>
          </div>

          <Link
            to="/sessions"
            className="text-xs font-bold text-[#86A8CF] hover:text-[#26425A] flex items-center gap-1 transition"
          >
            Session Tracker <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <LoadingSkeleton count={2} />
        ) : sessions.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center border border-[#D4B8C9]">
            <p className="text-sm text-[#5A7288] font-semibold">You don't have any sessions yet. Request a session with a peer from Discover!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sessions.slice(0, 3).map((sess) => (
              <SessionCard
                key={sess._id}
                session={sess}
                currentUserId={user?._id}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* Request Session Modal */}
      {requestModalUser && (
        <div className="fixed inset-0 z-50 bg-[#26425A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 border border-[#D4B8C9] max-w-md w-full animate-in fade-in zoom-in-95 duration-150 bg-[#E1CBD7]">
            <h3 className="text-xl font-bold text-[#26425A] mb-1">
              Request Session with {requestModalUser.name}
            </h3>
            <p className="text-xs text-[#5A7288] font-semibold mb-4">
              Schedule a skill exchange session. Peer will be notified to confirm.
            </p>

            {requestSuccess ? (
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-900 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>{requestSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleCreateSessionRequest} className="space-y-4">
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
                    Meeting Link (Optional Jitsi/Zoom/Google Meet)
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
                    onClick={() => setRequestModalUser(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F8F1F5] text-[#26425A] hover:bg-[#E1CBD7] border border-[#D4B8C9]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isRequesting}
                    className="px-5 py-2 rounded-xl text-xs font-bold gradient-button"
                  >
                    {isRequesting ? 'Sending...' : 'Send Session Request'}
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

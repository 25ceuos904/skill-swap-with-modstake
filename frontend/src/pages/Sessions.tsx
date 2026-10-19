import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sessionService } from '../services/sessionService';
import { Session, SessionStatus } from '../types';
import { SessionCard } from '../components/SessionCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Calendar } from 'lucide-react';

export const Sessions: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | SessionStatus>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSessions = async () => {
    if (!user?._id) return;
    setIsLoading(true);
    try {
      const data = await sessionService.getUserSessions(user._id);
      setSessions(data);
    } catch (err) {
      console.error('Error fetching user sessions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user?._id]);

  const handleUpdateStatus = async (sessionId: string, newStatus: SessionStatus) => {
    try {
      await sessionService.updateSessionStatus(sessionId, newStatus);
      if (newStatus === 'completed') {
        // Refresh user context to show updated +50 points badge!
        await refreshUser();
      }
      fetchSessions();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update session status.');
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (activeTab === 'all') return true;
    return s.status === activeTab;
  });

  const tabCounts = {
    all: sessions.length,
    requested: sessions.filter((s) => s.status === 'requested').length,
    confirmed: sessions.filter((s) => s.status === 'confirmed').length,
    completed: sessions.filter((s) => s.status === 'completed').length,
    rejected: sessions.filter((s) => s.status === 'rejected').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#26425A] flex items-center gap-2">
          <Calendar className="w-7 h-7 text-[#86A8CF]" />
          Session Tracker
        </h1>
        <p className="text-sm text-[#5A7288] font-semibold">
          Manage session lifecycle requests, schedule links, and earn 50 points upon session completion.
        </p>
      </div>

      {/* Tabs Row */}
      <div className="flex flex-wrap items-center gap-2 bg-[#F8F1F5] p-2 rounded-2xl border border-[#D4B8C9]">
        {[
          { key: 'all', label: 'All Sessions', count: tabCounts.all },
          { key: 'requested', label: 'Requested', count: tabCounts.requested },
          { key: 'confirmed', label: 'Confirmed', count: tabCounts.confirmed },
          { key: 'completed', label: 'Completed', count: tabCounts.completed },
          { key: 'rejected', label: 'Rejected', count: tabCounts.rejected },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === tab.key
                ? 'bg-[#C38EB4] text-white shadow-md'
                : 'text-[#5A7288] hover:text-[#26425A] hover:bg-[#E1CBD7]/60'
            }`}
          >
            {tab.label}
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-[#E1CBD7] text-[#26425A]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Sessions Grid */}
      {isLoading ? (
        <LoadingSkeleton count={3} />
      ) : filteredSessions.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-[#D4B8C9] space-y-3 bg-[#E1CBD7]">
          <Calendar className="w-10 h-10 text-[#86A8CF] mx-auto" />
          <h3 className="text-lg font-bold text-[#26425A]">No {activeTab} sessions found</h3>
          <p className="text-xs text-[#5A7288] font-semibold">
            Go to the Discover tab to connect with peers and request new learning sessions!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((sess) => (
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
  );
};

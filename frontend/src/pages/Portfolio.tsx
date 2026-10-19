import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { portfolioService } from '../services/portfolioService';
import { PortfolioData } from '../types';
import { ResourceCard } from '../components/ResourceCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import {
  Briefcase,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  Share2,
  Check,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react';

export const Portfolio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();

  const targetUserId = id || currentUser?._id;

  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!targetUserId) return;
      setIsLoading(true);
      try {
        const data = await portfolioService.getPortfolio(targetUserId);
        setPortfolio(data);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [targetUserId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Portfolio Not Found</h2>
      </div>
    );
  }

  const { user, skillsLearned, skillsTaught, completedSessions, sharedResources, totalPoints } = portfolio;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Portfolio Header Banner */}
      <div className="glass-card rounded-3xl p-8 border border-slate-800 relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-extrabold text-3xl shadow-xl shadow-indigo-600/30">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                <Briefcase className="w-3 h-3" /> Learning Portfolio
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                {user.name}
              </h1>
              {user.education && (
                <p className="text-xs text-indigo-300 font-semibold flex items-center gap-1">
                  <GraduationCap className="w-4 h-4 text-indigo-400" />
                  <span>{user.education}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-3">
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-2 rounded-full text-sm font-extrabold w-fit">
              <Award className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{totalPoints} Total Points</span>
            </div>

            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" /> Link Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-indigo-400" /> Share Portfolio Link
                </>
              )}
            </button>
          </div>
        </div>

        {user.bio && (
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <p className="text-sm text-slate-300 leading-relaxed italic bg-slate-900/50 p-3.5 rounded-2xl border border-slate-800/80">
              "{user.bio}"
            </p>
          </div>
        )}
      </div>

      {/* Auto-Compiled Skills Taught & Learned */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Taught */}
        <div className="glass-card rounded-3xl p-6 border border-emerald-500/20 space-y-3">
          <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Skills Taught (As Mentor)
          </h3>
          <p className="text-xs text-slate-400">
            Auto-derived from completed mentoring sessions
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {skillsTaught.map((skill, idx) => (
              <span
                key={idx}
                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold px-3 py-1 rounded-full text-xs"
              >
                {skill}
              </span>
            ))}
            {skillsTaught.length === 0 && (
              <span className="text-xs text-slate-500 italic">No completed teaching sessions yet</span>
            )}
          </div>
        </div>

        {/* Skills Learned */}
        <div className="glass-card rounded-3xl p-6 border border-indigo-500/20 space-y-3">
          <h3 className="text-base font-bold text-indigo-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Skills Learned (As Student)
          </h3>
          <p className="text-xs text-slate-400">
            Auto-derived from completed learning sessions
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {skillsLearned.map((skill, idx) => (
              <span
                key={idx}
                className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-semibold px-3 py-1 rounded-full text-xs"
              >
                {skill}
              </span>
            ))}
            {skillsLearned.length === 0 && (
              <span className="text-xs text-slate-500 italic">No completed learning sessions yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Completed Sessions Record */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          Completed Session History ({completedSessions.length})
        </h3>

        {completedSessions.length === 0 ? (
          <div className="glass-card rounded-2xl p-6 text-center border border-slate-800">
            <p className="text-xs text-slate-400">No completed sessions logged in portfolio yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {completedSessions.map((sess) => {
              const req = sess.requesterId as any;
              const rec = sess.recipientId as any;
              const isLearner = req?._id === user._id;
              const partner = isLearner ? rec : req;

              return (
                <div
                  key={sess._id}
                  className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm">
                        {isLearner ? `Learned from ${partner?.name}` : `Mentored ${partner?.name}`}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Session Completed • Earned +50 Points
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-slate-500 font-medium">
                    {formatDate(sess.updatedAt || sess.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Shared Resources Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          Shared Resources ({sharedResources.length})
        </h3>

        {sharedResources.length === 0 ? (
          <div className="glass-card rounded-2xl p-6 text-center border border-slate-800">
            <p className="text-xs text-slate-400">No public resources shared yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sharedResources.map((res) => (
              <ResourceCard key={res._id} resource={res} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

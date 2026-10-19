import React from 'react';
import { Link } from 'react-router-dom';
import { MatchResult } from '../types';
import { CalendarPlus, GraduationCap, Sparkles } from 'lucide-react';

interface MatchCardProps {
  match: MatchResult;
  onRequestSession?: (peerUser: MatchResult['user']) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onRequestSession }) => {
  const { user: peer, mutualScore, aOffersToB, bOffersToA } = match;

  return (
    <div className="glass-card rounded-2xl p-5 hover:border-[#C38EB4] transition-all duration-300 hover:shadow-xl hover:shadow-[#C38EB4]/10 flex flex-col justify-between group relative overflow-hidden">
      <div>
        {/* Card Header: User Avatar + Name + Score Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C38EB4] flex items-center justify-center text-white font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
              {peer.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <Link
                to={`/profile/${peer._id}`}
                className="font-bold text-[#26425A] hover:text-[#86A8CF] text-lg line-clamp-1 transition"
              >
                {peer.name}
              </Link>
              {peer.education && (
                <p className="text-xs text-[#5A7288] flex items-center gap-1 mt-0.5 font-medium">
                  <GraduationCap className="w-3.5 h-3.5 text-[#86A8CF]" />
                  <span className="truncate max-w-[140px]">{peer.education}</span>
                </p>
              )}
            </div>
          </div>

          {/* Mutual Score Ring / Badge */}
          <div className="flex flex-col items-center justify-center px-3 py-1.5 rounded-2xl bg-[#C38EB4] text-white shadow-md border border-[#C38EB4]">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span className="text-base font-extrabold">{mutualScore}%</span>
            </div>
            <span className="text-[9px] uppercase font-bold tracking-wider opacity-90">Match</span>
          </div>
        </div>

        {/* Bio Snippet */}
        {peer.bio && (
          <p className="text-[#26425A] text-xs mt-3 line-clamp-2 italic bg-[#F8F1F5] p-2.5 rounded-xl border border-[#D4B8C9] font-medium">
            "{peer.bio}"
          </p>
        )}

        {/* Skill Breakdown */}
        <div className="mt-4 space-y-2.5">
          {/* They can teach you */}
          <div>
            <span className="text-[11px] font-bold text-[#26425A] uppercase tracking-wider block mb-1">
              They Can Teach You:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(bOffersToA.length > 0 ? bOffersToA : peer.skillsOffered.slice(0, 3)).map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-[#86A8CF]/20 border border-[#86A8CF]/40 text-[#26425A] text-xs font-bold px-2.5 py-0.5 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {peer.skillsOffered.length === 0 && (
                <span className="text-xs text-[#5A7288] italic">No skills listed yet</span>
              )}
            </div>
          </div>

          {/* You can teach them */}
          <div>
            <span className="text-[11px] font-bold text-[#26425A] uppercase tracking-wider block mb-1">
              They Want To Learn:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(aOffersToB.length > 0 ? aOffersToB : peer.skillsWanted.slice(0, 3)).map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-[#C38EB4]/20 border border-[#C38EB4]/40 text-[#26425A] text-xs font-bold px-2.5 py-0.5 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {peer.skillsWanted.length === 0 && (
                <span className="text-xs text-[#5A7288] italic">No skills listed yet</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-[#D4B8C9] flex items-center justify-between gap-2">
        <Link
          to={`/profile/${peer._id}`}
          className="flex-1 text-center text-xs font-bold text-[#26425A] hover:bg-[#F8F1F5] bg-[#E1CBD7] py-2 rounded-xl border border-[#D4B8C9] transition"
        >
          View Profile
        </Link>
        {onRequestSession && (
          <button
            onClick={() => onRequestSession(peer)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold gradient-button py-2 rounded-xl"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            Request Session
          </button>
        )}
      </div>
    </div>
  );
};

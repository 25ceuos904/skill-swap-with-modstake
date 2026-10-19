import React from 'react';
import { Session, SessionStatus, User } from '../types';
import { Clock, Video, CheckCircle2, XCircle, Award, ExternalLink } from 'lucide-react';

interface SessionCardProps {
  session: Session;
  currentUserId?: string;
  onUpdateStatus?: (sessionId: string, newStatus: SessionStatus) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, currentUserId, onUpdateStatus }) => {
  const requester = session.requesterId as User;
  const recipient = session.recipientId as User;

  const isRequester = typeof requester === 'object' && requester?._id === currentUserId;
  const peerUser = isRequester ? (recipient as User) : (requester as User);

  const getStatusBadge = (status: SessionStatus) => {
    switch (status) {
      case 'requested':
        return {
          label: 'Requested',
          bg: 'bg-amber-500/20 text-amber-900 border-amber-500/40',
          dot: 'bg-amber-600',
        };
      case 'confirmed':
        return {
          label: 'Confirmed',
          bg: 'bg-[#86A8CF]/25 text-[#26425A] border-[#86A8CF]/50',
          dot: 'bg-[#86A8CF]',
        };
      case 'completed':
        return {
          label: 'Completed (+50 pts)',
          bg: 'bg-emerald-500/20 text-emerald-900 border-emerald-500/40',
          dot: 'bg-emerald-600',
        };
      case 'rejected':
        return {
          label: 'Rejected',
          bg: 'bg-rose-500/20 text-rose-900 border-rose-500/40',
          dot: 'bg-rose-600',
        };
      default:
        return {
          label: status,
          bg: 'bg-[#F8F1F5] text-[#26425A] border-[#D4B8C9]',
          dot: 'bg-[#5A7288]',
        };
    }
  };

  const statusStyle = getStatusBadge(session.status);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'TBD';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-[#D4B8C9] hover:border-[#C38EB4] transition flex flex-col justify-between">
      <div>
        {/* Header: Peer info + Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C38EB4] flex items-center justify-center text-white font-bold text-base shadow">
              {peerUser?.name ? peerUser.name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <span className="text-xs text-[#5A7288] font-semibold">
                {isRequester ? 'Teaching Request to:' : 'Learning Request from:'}
              </span>
              <h4 className="font-bold text-[#26425A] text-base leading-tight">{peerUser?.name || 'Peer User'}</h4>
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusStyle.bg}`}
          >
            <span className={`w-2 h-2 rounded-full ${statusStyle.dot} animate-pulse`}></span>
            <span>{statusStyle.label}</span>
          </div>
        </div>

        {/* Scheduled Time & Meeting Details */}
        <div className="mt-4 bg-[#F8F1F5] rounded-xl p-3 border border-[#D4B8C9] space-y-2 text-xs text-[#26425A]">
          <div className="flex items-center gap-2 font-medium">
            <Clock className="w-4 h-4 text-[#86A8CF]" />
            <span>Scheduled: <strong className="text-[#26425A] font-bold">{formatDate(session.scheduledTime)}</strong></span>
          </div>

          {session.meetingLink && (
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-[#86A8CF]" />
              <a
                href={session.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#86A8CF] hover:underline flex items-center gap-1 font-bold truncate"
              >
                Join Meeting Room <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Action Pipeline Buttons */}
      <div className="mt-5 pt-3 border-t border-[#D4B8C9] flex items-center justify-end gap-2">
        {/* Recipient Actions on Requested */}
        {!isRequester && session.status === 'requested' && onUpdateStatus && (
          <>
            <button
              onClick={() => onUpdateStatus(session._id, 'rejected')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-900 border border-rose-500/40 transition flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" /> Reject
            </button>
            <button
              onClick={() => onUpdateStatus(session._id, 'confirmed')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#C38EB4] hover:bg-[#B37AA4] text-white shadow-md transition flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Confirm
            </button>
          </>
        )}

        {/* Requester Actions on Requested */}
        {isRequester && session.status === 'requested' && (
          <span className="text-xs text-amber-800 font-bold italic">Waiting for peer to confirm request...</span>
        )}

        {/* Actions on Confirmed Session */}
        {session.status === 'confirmed' && onUpdateStatus && (
          <button
            onClick={() => onUpdateStatus(session._id, 'completed')}
            className="w-full py-2 rounded-xl text-xs font-bold bg-[#C38EB4] hover:bg-[#B37AA4] text-white shadow-md transition flex items-center justify-center gap-1.5"
          >
            <Award className="w-4 h-4 text-amber-200" />
            Mark Session Completed (+50 Pts)
          </button>
        )}

        {/* Completed Status */}
        {session.status === 'completed' && (
          <div className="flex items-center gap-1 text-xs text-emerald-800 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Completed & 50 Points Awarded</span>
          </div>
        )}
      </div>
    </div>
  );
};

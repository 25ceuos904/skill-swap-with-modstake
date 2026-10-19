import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { sessionService } from '../services/sessionService';
import { User } from '../types';
import { SkillTagInput } from '../components/SkillTagInput';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import {
  GraduationCap,
  Award,
  Edit3,
  CheckCircle2,
  CalendarPlus,
  ArrowLeft,
  Briefcase,
  Sparkles,
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, updateUser } = useAuth();
  const navigate = useNavigate();

  const isOwnProfile = !id || id === currentUser?._id;
  const targetUserId = isOwnProfile ? currentUser?._id : id;

  const [profileUser, setProfileUser] = useState<User | null>(isOwnProfile ? currentUser : null);
  const [isLoading, setIsLoading] = useState<boolean>(!isOwnProfile);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Form Fields State
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [education, setEducation] = useState('');
  const [skillsOffered, setSkillsOffered] = useState<string[]>([]);
  const [skillsWanted, setSkillsWanted] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>('');

  // Request Session Modal State (when viewing peer profile)
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [meetingLink, setMeetingLink] = useState<string>('');
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [requestSuccess, setRequestSuccess] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!targetUserId) return;
      if (isOwnProfile && currentUser) {
        setProfileUser(currentUser);
        setName(currentUser.name);
        setBio(currentUser.bio || '');
        setEducation(currentUser.education || '');
        setSkillsOffered(currentUser.skillsOffered || []);
        setSkillsWanted(currentUser.skillsWanted || []);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await userService.getProfile(targetUserId);
        setProfileUser(data);
        setName(data.name);
        setBio(data.bio || '');
        setEducation(data.education || '');
        setSkillsOffered(data.skillsOffered || []);
        setSkillsWanted(data.skillsWanted || []);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id, currentUser?._id]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?._id) return;
    setIsSaving(true);
    setSaveMessage('');

    try {
      const updated = await userService.updateProfile(currentUser._id, {
        name,
        bio,
        education,
        skillsOffered,
        skillsWanted,
      });

      updateUser(updated);
      setProfileUser(updated);
      setIsEditing(false);
      setSaveMessage('Profile saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileUser?._id) return;
    setIsRequesting(true);
    try {
      await sessionService.createSession({
        recipientId: profileUser._id,
        scheduledTime: scheduledTime || undefined,
        meetingLink: meetingLink || undefined,
      });
      setRequestSuccess(`Session requested successfully with ${profileUser.name}!`);
      setTimeout(() => {
        setShowRequestModal(false);
        setRequestSuccess('');
      }, 1500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to request session.');
    } finally {
      setIsRequesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoadingSkeleton count={2} />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#26425A] mb-2">User Not Found</h2>
        <button
          onClick={() => navigate('/discover')}
          className="px-4 py-2 gradient-button text-xs font-bold rounded-xl"
        >
          Back to Discover
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Back Button */}
      {!isOwnProfile && (
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A7288] hover:text-[#26425A] transition"
        >
          <ArrowLeft className="w-4 h-4 text-[#86A8CF]" /> Back
        </button>
      )}

      {/* Save Success Alert */}
      {saveMessage && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-900 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="glass-card rounded-3xl p-8 border border-[#D4B8C9] relative overflow-hidden bg-[#E1CBD7]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-[#C38EB4] flex items-center justify-center text-white font-extrabold text-3xl shadow-xl">
              {profileUser.name.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26425A] tracking-tight">
                {profileUser.name}
              </h1>
              <p className="text-xs text-[#5A7288] font-semibold">{profileUser.email}</p>

              {profileUser.education && (
                <p className="text-xs text-[#26425A] font-bold flex items-center gap-1.5 pt-1">
                  <GraduationCap className="w-4 h-4 text-[#86A8CF]" />
                  <span>{profileUser.education}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-3">
            <div className="flex items-center gap-2 bg-[#C38EB4]/20 border border-[#C38EB4]/40 text-[#26425A] px-4 py-2 rounded-full text-sm font-extrabold w-fit">
              <Award className="w-4 h-4 text-[#C38EB4]" />
              <span>{profileUser.points} Points</span>
            </div>

            {isOwnProfile ? (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 rounded-xl bg-[#F8F1F5] hover:bg-[#E1CBD7] border border-[#D4B8C9] text-xs font-bold text-[#26425A] transition flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#86A8CF]" />
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="px-5 py-2.5 rounded-xl gradient-button text-xs font-bold flex items-center gap-1.5"
                >
                  <CalendarPlus className="w-4 h-4" /> Request Session
                </button>
                <button
                  onClick={() => navigate(`/portfolio/${profileUser._id}`)}
                  className="px-4 py-2.5 rounded-xl bg-[#F8F1F5] hover:bg-[#E1CBD7] border border-[#D4B8C9] text-xs font-bold text-[#26425A] flex items-center gap-1.5"
                >
                  <Briefcase className="w-4 h-4 text-[#C38EB4]" /> Portfolio
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bio Section */}
        {profileUser.bio && !isEditing && (
          <div className="mt-6 pt-6 border-t border-[#D4B8C9]">
            <h4 className="text-xs font-bold text-[#5A7288] uppercase tracking-wider mb-1">About Me</h4>
            <p className="text-sm text-[#26425A] font-medium leading-relaxed italic bg-[#F8F1F5] p-4 rounded-2xl border border-[#D4B8C9]">
              "{profileUser.bio}"
            </p>
          </div>
        )}
      </div>

      {/* Profile Details or Edit Form */}
      {isEditing ? (
        <form onSubmit={handleSaveProfile} className="glass-card rounded-3xl p-8 border border-[#D4B8C9] space-y-6 bg-[#E1CBD7]">
          <h3 className="text-lg font-bold text-[#26425A] flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-[#86A8CF]" /> Edit Profile Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#26425A] uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F8F1F5] border border-[#D4B8C9] rounded-xl p-3 text-sm text-[#26425A] outline-none focus:border-[#C38EB4] font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#26425A] uppercase tracking-wider mb-1">
                Education / University Major
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. Computer Science Senior"
                className="w-full bg-[#F8F1F5] border border-[#D4B8C9] rounded-xl p-3 text-sm text-[#26425A] outline-none focus:border-[#C38EB4] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26425A] uppercase tracking-wider mb-1">
              Short Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell peers what you love to learn and teach..."
              className="w-full bg-[#F8F1F5] border border-[#D4B8C9] rounded-xl p-3 text-sm text-[#26425A] outline-none focus:border-[#C38EB4] resize-none font-medium"
            ></textarea>
          </div>

          <div className="space-y-6 pt-4 border-t border-[#D4B8C9]">
            <SkillTagInput
              label="Skills You Offer (To Teach)"
              tags={skillsOffered}
              onChange={setSkillsOffered}
              colorTheme="emerald"
            />

            <SkillTagInput
              label="Skills You Want (To Learn)"
              tags={skillsWanted}
              onChange={setSkillsWanted}
              colorTheme="indigo"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4B8C9]">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#F8F1F5] text-[#26425A] hover:bg-[#E1CBD7] border border-[#D4B8C9]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl text-xs font-bold gradient-button"
            >
              {isSaving ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skills Offered Card */}
          <div className="glass-card rounded-3xl p-6 border border-[#D4B8C9] space-y-3 bg-[#E1CBD7]">
            <h3 className="text-base font-bold text-[#26425A] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C38EB4]" />
              Skills Offered (To Teach)
            </h3>
            <p className="text-xs text-[#5A7288] font-semibold">
              Skills {profileUser.name} is ready to mentor peers in
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {profileUser.skillsOffered?.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-[#86A8CF]/20 border border-[#86A8CF]/40 text-[#26425A] font-bold px-3 py-1 rounded-full text-xs"
                >
                  {skill}
                </span>
              ))}
              {(!profileUser.skillsOffered || profileUser.skillsOffered.length === 0) && (
                <span className="text-xs text-[#5A7288] italic">No offered skills listed</span>
              )}
            </div>
          </div>

          {/* Skills Wanted Card */}
          <div className="glass-card rounded-3xl p-6 border border-[#D4B8C9] space-y-3 bg-[#E1CBD7]">
            <h3 className="text-base font-bold text-[#26425A] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#86A8CF]" />
              Skills Wanted (To Learn)
            </h3>
            <p className="text-xs text-[#5A7288] font-semibold">
              Skills {profileUser.name} is seeking to learn from peers
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {profileUser.skillsWanted?.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-[#C38EB4]/20 border border-[#C38EB4]/40 text-[#26425A] font-bold px-3 py-1 rounded-full text-xs"
                >
                  {skill}
                </span>
              ))}
              {(!profileUser.skillsWanted || profileUser.skillsWanted.length === 0) && (
                <span className="text-xs text-[#5A7288] italic">No wanted skills listed</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Request Session Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-[#26425A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 border border-[#D4B8C9] max-w-md w-full animate-in fade-in zoom-in-95 duration-150 bg-[#E1CBD7]">
            <h3 className="text-xl font-bold text-[#26425A] mb-1">
              Request Session with {profileUser.name}
            </h3>
            <p className="text-xs text-[#5A7288] font-semibold mb-4">
              Propose a date/time to exchange skills with {profileUser.name}.
            </p>

            {requestSuccess ? (
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-900 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>{requestSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleCreateSession} className="space-y-4">
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
                    placeholder="https://meet.jit.si/skillswap"
                    className="w-full bg-[#F8F1F5] border border-[#D4B8C9] rounded-xl p-2.5 text-sm text-[#26425A] outline-none focus:border-[#C38EB4] font-medium"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4B8C9]">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
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

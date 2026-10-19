import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { resourceService } from '../services/resourceService';
import { Resource } from '../types';
import { ResourceCard } from '../components/ResourceCard';
import { SkillTagInput } from '../components/SkillTagInput';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { BookOpen, PlusCircle, Search, CheckCircle2, Award, X } from 'lucide-react';

export const Resources: React.FC = () => {
  const { refreshUser } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Post Resource Modal State
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [tags, setTags] = useState<string[]>(['Tutorial', 'Documentation']);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [postSuccess, setPostSuccess] = useState<string>('');

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const data = await resourceService.getResources(selectedTag, searchQuery);
      setResources(data);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResources();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedTag]);

  const handlePostResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !link) return;
    setIsPosting(true);
    try {
      await resourceService.createResource({
        title,
        description,
        link,
        tags,
      });

      // Award +10 points for resource contribution -> refresh user context!
      await refreshUser();

      setPostSuccess('Resource shared successfully! +10 Points Awarded 🎉');
      setTimeout(() => {
        setShowPostModal(false);
        setPostSuccess('');
        setTitle('');
        setDescription('');
        setLink('');
        setTags(['Tutorial']);
        fetchResources();
      }, 1500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to share resource.');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header & Post Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#26425A] flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-[#86A8CF]" />
            Learning Resource Library
          </h1>
          <p className="text-sm text-[#5A7288] font-semibold">
            Post and discover community guides, videos, repository links, and articles. Earn 10 points for each shared resource!
          </p>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="px-5 py-3 rounded-2xl gradient-button text-sm font-bold flex items-center gap-2 shrink-0 shadow-lg"
        >
          <PlusCircle className="w-4 h-4" /> Share a Resource (+10 pts)
        </button>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-[#86A8CF] absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources by title, keyword, or tag..."
            className="w-full bg-[#F8F1F5] border border-[#D4B8C9] focus:border-[#C38EB4] rounded-2xl pl-12 pr-10 py-3 text-sm text-[#26425A] placeholder-[#5A7288] outline-none transition font-medium"
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

        {selectedTag && (
          <button
            onClick={() => setSelectedTag('')}
            className="px-3.5 py-2.5 rounded-xl bg-[#C38EB4]/20 border border-[#C38EB4]/40 text-[#26425A] text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            Tag: {selectedTag} <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Resource Cards Grid */}
      {isLoading ? (
        <LoadingSkeleton count={6} />
      ) : resources.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-[#D4B8C9] space-y-3 bg-[#E1CBD7]">
          <BookOpen className="w-10 h-10 text-[#86A8CF] mx-auto" />
          <h3 className="text-lg font-bold text-[#26425A]">No Resources Found</h3>
          <p className="text-xs text-[#5A7288] font-semibold max-w-md mx-auto">
            Be the first to contribute a learning guide, documentation, or video link!
          </p>
          <button
            onClick={() => setShowPostModal(true)}
            className="px-4 py-2 gradient-button text-xs font-bold rounded-xl"
          >
            Share Resource
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => (
            <ResourceCard
              key={res._id}
              resource={res}
              onTagClick={(tag) => setSelectedTag(tag)}
            />
          ))}
        </div>
      )}

      {/* Share Resource Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-[#26425A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 border border-[#D4B8C9] max-w-lg w-full animate-in fade-in zoom-in-95 duration-150 bg-[#E1CBD7]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#26425A] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#86A8CF]" /> Share Learning Resource
              </h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-[#5A7288] hover:text-[#26425A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {postSuccess ? (
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-900 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>{postSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handlePostResource} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#26425A] uppercase tracking-wider mb-1">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Complete React & TypeScript Cheat Sheet 2026"
                    className="w-full bg-[#F8F1F5] border border-[#D4B8C9] rounded-xl p-2.5 text-sm text-[#26425A] outline-none focus:border-[#C38EB4] font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#26425A] uppercase tracking-wider mb-1">
                    URL Link *
                  </label>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-[#F8F1F5] border border-[#D4B8C9] rounded-xl p-2.5 text-sm text-[#26425A] outline-none focus:border-[#C38EB4] font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#26425A] uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Briefly describe what peers will learn from this resource..."
                    className="w-full bg-[#F8F1F5] border border-[#D4B8C9] rounded-xl p-2.5 text-sm text-[#26425A] outline-none focus:border-[#C38EB4] resize-none font-medium"
                  ></textarea>
                </div>

                <SkillTagInput
                  label="Tags (e.g. React, Tutorial, Architecture)"
                  tags={tags}
                  onChange={setTags}
                  colorTheme="purple"
                />

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4B8C9]">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F8F1F5] text-[#26425A] hover:bg-[#E1CBD7] border border-[#D4B8C9]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPosting}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold gradient-button flex items-center gap-1.5"
                  >
                    <Award className="w-4 h-4 text-amber-200" />
                    {isPosting ? 'Publishing...' : 'Post Resource (+10 pts)'}
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

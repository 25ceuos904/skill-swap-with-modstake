import React from 'react';
import { Resource, User } from '../types';
import { ExternalLink, Tag, Calendar } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  onTagClick?: (tag: string) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onTagClick }) => {
  const author = typeof resource.userId === 'object' ? (resource.userId as User) : null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="glass-card rounded-2xl p-5 hover:border-[#C38EB4] transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Title & External Link */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-[#26425A] text-lg group-hover:text-[#86A8CF] transition line-clamp-2">
            {resource.title}
          </h3>
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-[#F8F1F5] border border-[#D4B8C9] text-[#86A8CF] hover:text-white hover:bg-[#C38EB4] transition shrink-0"
            title="Open Resource URL"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Description */}
        {resource.description && (
          <p className="text-[#26425A] text-xs mt-2.5 line-clamp-3 leading-relaxed font-medium">
            {resource.description}
          </p>
        )}

        {/* Tags list */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {resource.tags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => onTagClick && onTagClick(tag)}
                className="flex items-center gap-1 bg-[#C38EB4]/20 border border-[#C38EB4]/40 text-[#26425A] hover:bg-[#C38EB4]/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full transition"
              >
                <Tag className="w-3 h-3 text-[#86A8CF]" />
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Author & Date Footer */}
      <div className="mt-5 pt-3 border-t border-[#D4B8C9] flex items-center justify-between text-xs text-[#5A7288] font-semibold">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-[#C38EB4] flex items-center justify-center text-white text-[10px] font-bold">
            {author?.name ? author.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="font-bold text-[#26425A]">{author?.name || 'Community Member'}</span>
        </div>

        {resource.createdAt && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#86A8CF]" />
            <span>{formatDate(resource.createdAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

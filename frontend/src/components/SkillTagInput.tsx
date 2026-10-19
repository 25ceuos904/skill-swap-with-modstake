import React, { useState } from 'react';
import { Plus, X, Tag } from 'lucide-react';

interface SkillTagInputProps {
  label: string;
  placeholder?: string;
  tags: string[];
  onChange: (newTags: string[]) => void;
  colorTheme?: 'emerald' | 'indigo' | 'purple';
}

export const SkillTagInput: React.FC<SkillTagInputProps> = ({
  label,
  placeholder = 'Add a skill (e.g., React, Python)...',
  tags,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...tags, trimmed]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-[#26425A] uppercase tracking-wider">
        {label}
      </label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="w-4 h-4 text-[#86A8CF] absolute left-3 top-3" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-[#F8F1F5] border border-[#D4B8C9] focus:border-[#C38EB4] rounded-xl pl-9 pr-3 py-2 text-sm text-[#26425A] placeholder-[#5A7288] outline-none transition font-medium"
          />
        </div>
        <button
          type="button"
          onClick={handleAddTag}
          className="px-4 py-2 bg-[#C38EB4] hover:bg-[#B37AA4] text-white rounded-xl font-bold text-sm transition flex items-center gap-1 shadow-md"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Chip list */}
      <div className="flex flex-wrap gap-2 pt-1">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="flex items-center gap-1.5 bg-[#C38EB4]/20 border border-[#C38EB4]/40 text-[#26425A] text-xs font-bold px-3 py-1 rounded-full animate-in fade-in zoom-in-95 duration-150"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="hover:text-[#86A8CF] transition p-0.5 rounded-full hover:bg-black/5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {tags.length === 0 && (
          <span className="text-xs text-[#5A7288] italic">No skills added yet</span>
        )}
      </div>
    </div>
  );
};

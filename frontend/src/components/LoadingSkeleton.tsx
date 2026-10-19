import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
  type?: 'card' | 'row';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 3, type = 'card' }) => {
  return (
    <div
      className={
        type === 'card'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
          : 'space-y-4'
      }
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="glass-card rounded-2xl p-5 border border-[#D4B8C9] animate-pulse space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F8F1F5]"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-[#F8F1F5] rounded w-1/2"></div>
              <div className="h-3 bg-[#F8F1F5]/60 rounded w-1/3"></div>
            </div>
          </div>
          <div className="h-12 bg-[#F8F1F5]/50 rounded-xl"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-[#F8F1F5] rounded-full w-16"></div>
            <div className="h-6 bg-[#F8F1F5] rounded-full w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

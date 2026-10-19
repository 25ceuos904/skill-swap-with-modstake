import React from 'react';

interface LogoProps {
  className?: string;
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = 'w-6 h-6', alt = 'SkillSwap Logo' }) => {
  return (
    <img
      src="/logo.jpg"
      alt={alt}
      className={`object-contain rounded-full ${className}`}
    />
  );
};

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorScheme?: 'indigo' | 'emerald' | 'amber' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
}) => {
  return (
    <div
      className="glass-card rounded-2xl p-5 border border-[#D4B8C9] hover:border-[#C38EB4] transition-all duration-300 hover:shadow-lg flex items-center justify-between group"
    >
      <div>
        <p className="text-xs font-bold text-[#5A7288] uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-extrabold text-[#26425A] mt-1 tracking-tight group-hover:scale-105 transition-transform origin-left">
          {value}
        </h3>
        {subtitle && <p className="text-xs text-[#5A7288] mt-1 font-semibold">{subtitle}</p>}
      </div>

      <div
        className="w-12 h-12 rounded-2xl bg-[#F8F1F5] text-[#86A8CF] border border-[#D4B8C9] flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform"
      >
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

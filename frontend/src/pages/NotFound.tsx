import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl p-10 max-w-md w-full text-center border border-slate-800 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
        </div>

        <div>
          <h1 className="text-6xl font-extrabold gradient-text tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-slate-100 mt-2">Page Not Found</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl gradient-button text-xs font-bold flex items-center gap-2"
          >
            <Home className="w-4 h-4" /> Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

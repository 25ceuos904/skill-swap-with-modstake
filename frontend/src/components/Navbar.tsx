import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';
import {
  Search,
  Calendar,
  BookOpen,
  User as UserIcon,
  LogOut,
  Award,
  ChevronDown,
  Menu,
  X,
  Briefcase,
  LayoutDashboard,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Discover', path: '/discover', icon: Search },
    { name: 'Sessions', path: '/sessions', icon: Calendar },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass-nav sticky top-0 z-50 px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
            <Logo className="w-9 h-9" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-[#26425A]">SkillSwap</span>
            <span className="block text-[10px] text-[#5A7288] font-semibold -mt-1 tracking-wider uppercase">
              P2P Exchange
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-[#F8F1F5] p-1.5 rounded-full border border-[#D4B8C9]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-[#C38EB4] text-white shadow-md shadow-[#C38EB4]/30'
                    : 'text-[#5A7288] hover:text-[#26425A] hover:bg-[#E1CBD7]/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#86A8CF]'}`} />
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Action Icons & User Dropdown */}
        <div className="hidden md:flex items-center gap-4">
          {/* Points Badge */}
          <div className="flex items-center gap-1.5 bg-[#C38EB4]/20 border border-[#C38EB4]/40 text-[#26425A] px-3.5 py-1.5 rounded-full text-sm font-bold shadow-inner">
            <Award className="w-4 h-4 text-[#C38EB4]" />
            <span>{user?.points || 0} pts</span>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-[#F8F1F5] border border-[#D4B8C9] hover:border-[#C38EB4] p-1.5 pr-3 rounded-full transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-[#C38EB4] flex items-center justify-center text-white font-bold text-sm shadow">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-sm font-bold text-[#26425A] max-w-[100px] truncate">
                {user?.name}
              </span>
              <ChevronDown className="w-4 h-4 text-[#86A8CF]" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 glass-card rounded-2xl shadow-2xl py-2 z-50 border border-[#D4B8C9] animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="px-4 py-2 border-b border-[#D4B8C9]">
                  <p className="text-xs text-[#5A7288] font-medium">Logged in as</p>
                  <p className="text-sm font-bold text-[#26425A] truncate">{user?.email}</p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#26425A] hover:bg-[#C38EB4]/20 transition"
                >
                  <UserIcon className="w-4 h-4 text-[#86A8CF]" />
                  My Profile
                </Link>

                <Link
                  to={`/portfolio/${user?._id}`}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#26425A] hover:bg-[#C38EB4]/20 transition"
                >
                  <Briefcase className="w-4 h-4 text-[#C38EB4]" />
                  My Portfolio
                </Link>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-500/10 transition border-t border-[#D4B8C9] mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-[#E1CBD7] border border-[#D4B8C9] text-[#26425A]"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#D4B8C9] space-y-2 animate-in fade-in duration-150">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  active ? 'bg-[#C38EB4] text-white' : 'text-[#26425A] hover:bg-[#E1CBD7]'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-[#D4B8C9] flex items-center justify-between px-4">
            <div className="flex items-center gap-1.5 text-[#26425A] text-sm font-bold">
              <Award className="w-4 h-4 text-[#C38EB4]" />
              <span>{user?.points || 0} pts</span>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
                navigate('/login');
              }}
              className="text-sm text-rose-600 font-semibold flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

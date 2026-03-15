import React from 'react';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import { useAuth, getInitials, getRoleLabel } from '../../context/AuthContext';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();
  const initials = getInitials(user?.full_name);
  const displayName = user?.full_name || '';
  const roleLabel = getRoleLabel(user?.role);

  return (
    <header className="h-[60px] bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40 gap-3">

      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all flex-shrink-0"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-sm hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties, inquiries..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-200 transition-all"
          />
        </div>
      </div>

      {/* Spacer on mobile so right side stays right */}
      <div className="flex-1 sm:hidden" />

      {/* Right side */}
      <div className="flex items-center gap-1.5">

        {/* Notification bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-all">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        <div className="w-px h-5 bg-gray-100 mx-1" />

        {/* Profile */}
        <button className="flex items-center gap-2 pl-1 pr-2.5 py-1.5 rounded-xl hover:bg-gray-50 transition-all group">
          <div className="w-8 h-8 rounded-lg bg-[#EEF5F8] flex items-center justify-center overflow-hidden flex-shrink-0">
            {user?.profile_picture_url ? (
              <img src={user.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[#002C3D] font-bold text-[11px]">{initials}</span>
            )}
          </div>
          <div className="text-left hidden md:block">
            <p className="text-[13px] font-semibold text-gray-800 leading-tight">{displayName || 'Loading...'}</p>
            <p className="text-[10px] text-gray-400 font-medium">{roleLabel}</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors hidden md:block" />
        </button>

      </div>
    </header>
  );
};

export default Header;

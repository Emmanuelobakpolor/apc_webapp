import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  User,
  LogOut,
  X,
} from 'lucide-react';
import apcLogo from '../../assets/image.png';
import { cn } from '../../utils/cn';
import { useAuth, getInitials } from '../../context/AuthContext';

const links = [
  { to: '/owner/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/owner/properties', label: 'Properties', icon: Building2       },
  { to: '/owner/inquiries',  label: 'Inquiries',  icon: MessageSquare   },
  { to: '/owner/account',    label: 'Account',    icon: User            },
];

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const initials = getInitials(user?.full_name);

  return (
    <aside className="w-[260px] h-screen bg-[#002C3D] flex flex-col overflow-y-auto">

      {/* Brand */}
      <div className="px-6 pt-7 pb-5 flex items-center justify-between">
        <div>
          <img src={apcLogo} alt="APC" className="w-8 h-8 rounded-lg object-cover" />
          <p className="text-white/35 text-[10px] font-semibold uppercase tracking-widest mt-0.5">Owner Platform</p>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="h-px bg-white/8 mx-5" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest px-3 mb-3">Main Menu</p>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 relative group',
              isActive
                ? 'bg-white/12 text-white'
                : 'text-white/50 hover:text-white/90 hover:bg-white/8'
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-white rounded-r-full" />
                )}
                <span className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150',
                  isActive ? 'bg-white/15' : 'bg-transparent group-hover:bg-white/8'
                )}>
                  <link.icon className="w-4 h-4" />
                </span>
                <span>{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-6 space-y-1">
        <div className="h-px bg-white/8 mx-2 mb-4" />
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/6 mb-1">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0 overflow-hidden">
            {user?.profile_picture_url ? (
              <img src={user.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
            ) : initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-[13px] font-semibold truncate leading-tight">{user?.full_name || ''}</p>
            <p className="text-white/35 text-[10px] font-medium truncate">Property Owner</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="flex items-center gap-3 text-white/40 hover:text-white/80 text-[13px] font-medium transition-all duration-150 w-full px-3 py-2.5 rounded-xl hover:bg-white/8"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

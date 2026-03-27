import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  MessageSquare,
  User,
  LogOut,
  X,
  ChevronRight,
} from 'lucide-react';
import apcLogo from '../../assets/image.png';
import { cn } from '../../utils/cn';
import { useAuth, getInitials } from '../../context/AuthContext';

const links = [
  { to: '/agent/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/agent/properties', label: 'My Properties', icon: Home },
  { to: '/agent/inquiries', label: 'Inquiries', icon: MessageSquare },
  { to: '/agent/settings', label: 'Account', icon: User },
];

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const initials = getInitials(user?.full_name);

  return (
    <aside className="w-[280px] h-screen bg-gradient-to-b from-[#032B3A] via-[#022635] to-[#011C27] text-white flex flex-col border-r border-white/10 shadow-2xl overflow-hidden">
      {/* Top section */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shadow-lg backdrop-blur-sm overflow-hidden">
              <img
                src={apcLogo}
                alt="APC"
                className="w-8 h-8 object-cover rounded-lg"
              />
            </div>

            <div>
              <h1 className="text-[16px] font-semibold tracking-wide">APC</h1>
              <p className="text-white/45 text-[11px] font-medium uppercase tracking-[0.18em]">
                Agent Platform
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Welcome card */}
        <div className="mt-5 rounded-2xl bg-white/6 border border-white/10 p-4 backdrop-blur-sm">
          <p className="text-white/40 text-[11px] uppercase tracking-[0.15em] font-semibold">
            Welcome back
          </p>
          <p className="mt-1 text-[15px] font-semibold text-white truncate">
            {user?.full_name || 'Agent'}
          </p>
          <p className="mt-1 text-[12px] text-white/50 leading-relaxed">
            Manage your properties, inquiries, and account from one place.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-white/10" />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5">
        <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
          Navigation
        </p>

        <div className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center justify-between rounded-2xl px-3 py-3 transition-all duration-200',
                    isActive
                      ? 'bg-white text-[#002C3D] shadow-lg'
                      : 'text-white/65 hover:text-white hover:bg-white/8'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
                          isActive
                            ? 'bg-[#002C3D]/10 text-[#002C3D]'
                            : 'bg-white/5 text-white/70 group-hover:bg-white/10 group-hover:text-white'
                        )}
                      >
                        <Icon className="w-4.5 h-4.5" />
                      </div>

                      <div className="min-w-0">
                        <p
                          className={cn(
                            'text-[13px] font-semibold truncate',
                            isActive ? 'text-[#002C3D]' : 'text-inherit'
                          )}
                        >
                          {link.label}
                        </p>
                      </div>
                    </div>

                    <ChevronRight
                      className={cn(
                        'w-4 h-4 transition-all duration-200',
                        isActive
                          ? 'text-[#002C3D]'
                          : 'text-white/25 group-hover:text-white/55 group-hover:translate-x-0.5'
                      )}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="px-4 pb-5">
        <div className="h-px bg-white/10 mb-4" />

        <div className="rounded-2xl border border-white/10 bg-white/6 p-3 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 overflow-hidden flex items-center justify-center text-white font-bold text-[12px] shrink-0">
              {user?.profile_picture_url ? (
                <img
                  src={user.profile_picture_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-white truncate">
                {user?.full_name || 'User'}
              </p>
              <p className="text-[11px] text-white/45 truncate">
                Property Agent
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[13px] font-medium text-white/70 hover:bg-red-500/10 hover:text-red-300 hover:border-red-400/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
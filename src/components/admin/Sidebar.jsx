import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Home,
  UserCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import apcLogo from '../../assets/image.png';

const AdminSidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'users', name: 'Users', icon: Users, path: '/admin/users' },
    { id: 'agents', name: 'Agents', icon: Users, path: '/admin/agents' },
    { id: 'properties', name: 'Properties', icon: Home, path: '/admin/properties' },
    { id: 'account', name: 'Account', icon: UserCircle, path: '/admin/account' },
  ];

  const handleLogout = () => navigate('/admin/login');

  return (
    <aside className="w-[270px] h-screen bg-gradient-to-b from-[#032B3A] via-[#022635] to-[#011C27] text-white flex flex-col border-r border-white/10 shadow-2xl overflow-hidden">
      {/* Top Brand Section */}
      <div className="px-5 pt-6 pb-5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden shadow-lg">
              <img
                src={apcLogo}
                alt="APC"
                className="w-8 h-8 rounded-lg object-cover"
              />
            </div>

            <div>
              <h1 className="text-[16px] font-semibold tracking-wide">APC</h1>
              <p className="text-white/45 text-[11px] uppercase tracking-[0.18em] font-medium">
                Admin Panel
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

        {/* Admin Info Card */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white/80" />
            </div>
            <div>
              <p className="text-white text-[13px] font-semibold">Administrator</p>
              <p className="text-white/45 text-[11px]">System management access</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-5 h-px bg-white/10" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
          Main Menu
        </p>

        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-2xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-white text-[#002C3D] shadow-lg'
                    : 'text-white/65 hover:bg-white/8 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-[#002C3D]/10 text-[#002C3D]'
                        : 'bg-white/5 text-white/70 group-hover:bg-white/10 group-hover:text-white'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>

                  <span className="text-[13px] font-semibold truncate">
                    {item.name}
                  </span>
                </div>

                <ChevronRight
                  className={`w-4 h-4 transition-all ${
                    isActive
                      ? 'text-[#002C3D]'
                      : 'text-white/25 group-hover:text-white/50 group-hover:translate-x-0.5'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Logout */}
      <div className="px-4 pb-5 flex-shrink-0">
        <div className="h-px bg-white/10 mb-4" />

        <div className="rounded-2xl border border-white/10 bg-white/6 p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[13px] font-medium text-white/70 hover:bg-red-500/10 hover:text-red-300 hover:border-red-400/20 transition-all"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Home, UserCircle, LogOut } from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard',  name: 'Dashboard',  icon: LayoutDashboard, path: '/admin/dashboard'  },
    { id: 'users',      name: 'Users',      icon: Users,           path: '/admin/users'       },
    { id: 'agents',     name: 'Agents',     icon: Users,           path: '/admin/agents'      },
    { id: 'properties', name: 'Properties', icon: Home,            path: '/admin/properties'  },
    { id: 'account',    name: 'Account',    icon: UserCircle,      path: '/admin/account'     },
  ];

  const handleLogout = () => navigate('/admin/login');

  return (
    <div className="w-56 bg-[#002C3D] text-white flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-[#002C3D] font-bold text-sm tracking-widest">APC</span>
        </div>
        <span className="font-bold text-sm">Admin Panel</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 border-t border-white/10 pt-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

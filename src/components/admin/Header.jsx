import React, { useState, useEffect } from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AUTH_API = 'https://apc-backend-vj85.onrender.com/api/auth';
const PROP_API = 'https://apc-backend-vj85.onrender.com/api/properties';

const adminFetch = (url) =>
  fetch(url, { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } });

const getAdminUser = () => {
  try { return JSON.parse(localStorage.getItem('admin_user')) || {}; }
  catch { return {}; }
};

const timeAgo = (dateStr) => {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const AdminHeader = () => {
  const navigate    = useNavigate();
  const adminUser   = getAdminUser();
  const displayName = adminUser.fullName || adminUser.full_name ||
    `${adminUser.first_name || ''} ${adminUser.last_name || ''}`.trim() || 'Admin User';
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'A';

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile,       setShowProfile]       = useState(false);

  useEffect(() => {
    Promise.all([
      adminFetch(`${AUTH_API}/admin/users/?role=user`)
        .then(r => r.ok ? r.json() : [])
        .then(data => (Array.isArray(data) ? data : []).slice(0, 3).map(u => ({
          id: `u-${u.id}`,
          title: `${u.full_name || u.email} registered as a user`,
          time: u.date_joined,
        }))),
      adminFetch(`${AUTH_API}/admin/users/?role=agent`)
        .then(r => r.ok ? r.json() : [])
        .then(data => (Array.isArray(data) ? data : []).slice(0, 3).map(u => ({
          id: `a-${u.id}`,
          title: `${u.full_name || u.email} registered as an agent`,
          time: u.date_joined,
        }))),
      adminFetch(`${PROP_API}/admin/all/`)
        .then(r => r.ok ? r.json() : [])
        .then(data => (Array.isArray(data) ? data : []).slice(0, 3).map(p => ({
          id: `p-${p.id}`,
          title: `"${p.title}" was listed`,
          time: p.created_at || p.date_listed,
        }))),
    ])
      .then(([users, agents, props]) => {
        const all = [...users, ...agents, ...props]
          .filter(n => n.time)
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 8);
        setNotifications(all);
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Search */}
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search for anything..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002C3D] focus:border-transparent outline-none transition-all" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Bell */}
        <div className="relative">
          <button onClick={() => { setShowNotifications(v => !v); setShowProfile(false); }}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center px-0.5 font-bold">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                <span className="text-xs text-gray-400">{notifications.length} recent</span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {notifications.length > 0 ? notifications.map(n => (
                  <div key={n.id} className="p-3.5 hover:bg-gray-50 transition-colors">
                    <p className="text-sm text-gray-800 leading-snug">{n.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(n.time)}</p>
                  </div>
                )) : (
                  <p className="text-sm text-gray-400 text-center py-8">No notifications yet.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button onClick={() => { setShowProfile(v => !v); setShowNotifications(false); }}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-[#002C3D] rounded-full flex items-center justify-center text-white font-medium text-sm">
              {initials}
            </div>
            <span className="text-sm font-medium text-gray-700">{displayName}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <div className="font-medium text-gray-900 text-sm">{displayName}</div>
                <div className="text-xs text-gray-500 mt-0.5">{adminUser.email || ''}</div>
              </div>
              <div className="p-2">
                <button onClick={() => { navigate('/admin/account'); setShowProfile(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  Settings
                </button>
                <button onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

import React, { useEffect, useState } from 'react';
import { Users, Home, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8000/api';

const adminFetch = (url) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
  });

const StatCard = ({ label, value, icon: Icon, color, loading }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {loading ? (
          <div className="h-8 w-20 bg-gray-100 rounded animate-pulse mt-2" />
        ) : (
          <p className="text-2xl font-bold text-gray-900 mt-2">{value ?? '—'}</p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch(`${API}/auth/admin/stats/`)
      .then((r) => {
        if (r.status === 401 || r.status === 403) {
          localStorage.removeItem('admin_token');
          navigate('/admin/login');
          return null;
        }
        return r.json();
      })
      .then((data) => { if (data) setStats(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  const statCards = [
    { label: 'Total Users',      value: stats?.users,               icon: Users, color: 'bg-blue-100 text-blue-600'   },
    { label: 'Total Agents',     value: stats?.agents,              icon: Users, color: 'bg-green-100 text-green-600'  },
    { label: 'Total Owners',     value: stats?.owners,              icon: Users, color: 'bg-purple-100 text-purple-600' },
    { label: 'Total Properties', value: stats?.total_properties,    icon: Home,  color: 'bg-orange-100 text-orange-600' },
    { label: 'Available',        value: stats?.available_properties, icon: Home, color: 'bg-teal-100 text-teal-600'     },
    { label: 'Sold',             value: stats?.sold_properties,     icon: TrendingUp, color: 'bg-red-100 text-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview — live data from the database.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} loading={loading} />
        ))}
      </div>

      {/* Recent Registrations */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Registrations</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : stats?.recent_users?.length ? (
          <div className="space-y-3">
            {stats.recent_users.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-[#002C3D]/10 rounded-full flex items-center justify-center text-[#002C3D] font-bold text-xs flex-shrink-0">
                  {u.full_name?.[0] || u.email[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{u.full_name || u.email}</p>
                  <p className="text-xs text-gray-400">{u.role} · {new Date(u.date_joined).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  u.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                }`}>
                  {u.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 py-6 text-center">No users yet.</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { title: 'Manage Users',      desc: 'View all user accounts', path: '/admin/users'      },
            { title: 'Manage Agents',     desc: 'View agent accounts',    path: '/admin/agents'     },
            { title: 'View Properties',   desc: 'Browse all listings',    path: '/admin/properties' },
            { title: 'Account Settings',  desc: 'Admin account settings', path: '/admin/account'    },
          ].map((a) => (
            <button key={a.path} onClick={() => navigate(a.path)}
              className="text-left p-4 rounded-lg border border-gray-200 hover:border-[#002C3D] hover:bg-gray-50 transition-colors">
              <h3 className="text-sm font-medium text-gray-900">{a.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronDown, MoreVertical, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

const API = 'https://apc-backend-vj85.onrender.com/api/auth';

const adminFetch = (url, opts = {}) =>
  fetch(url, {
    ...opts,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      'Content-Type': 'application/json',
      ...opts.headers,
    },
  });

const typeBadge = (role) => {
  if (role === 'user')  return 'bg-[#002C3D] text-white';
  if (role === 'agent') return 'bg-gray-500 text-white';
  if (role === 'owner') return 'border border-gray-300 text-gray-700 bg-white';
  return 'bg-yellow-100 text-yellow-700';
};

const typeLabel = (role) => {
  if (role === 'user')  return 'User';
  if (role === 'agent') return 'Agent';
  if (role === 'owner') return 'Property Owner';
  return role;
};

const ActiveBadge = ({ isActive }) => (
  <span className={cn(
    'flex items-center gap-1.5 text-xs font-medium',
    isActive ? 'text-green-600' : 'text-red-500'
  )}>
    <span className={cn('w-2 h-2 rounded-full', isActive ? 'bg-green-500' : 'bg-red-400')} />
    {isActive ? 'Active' : 'Disabled'}
  </span>
);

const UserDetail = ({ user, onBack, onToggle, onDelete }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <button onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" /> User Details
      </button>
      <ActiveBadge isActive={user.is_active} />
    </div>

    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user.full_name || `${user.first_name} ${user.last_name}`}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Location: <span className="font-semibold text-gray-700">{user.location || '—'}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onToggle(user)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            {user.is_active ? 'Disable Account' : 'Enable Account'}
          </button>
          <button onClick={() => onDelete(user)}
            className="px-4 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            Delete Account
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-x-8 gap-y-6">
        <div>
          <p className="text-xs text-gray-400 mb-1">Email Address</p>
          <p className="text-sm font-medium text-gray-800">{user.email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Phone Number</p>
          <p className="text-sm font-bold text-gray-900">{user.phone || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Account Type</p>
          <span className={cn('px-3 py-1 rounded-full text-xs font-semibold', typeBadge(user.role))}>
            {typeLabel(user.role)}
          </span>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Date Joined</p>
          <p className="text-sm font-bold text-[#002C3D]">
            {new Date(user.date_joined).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Status</p>
          <ActiveBadge isActive={user.is_active} />
        </div>
      </div>
    </div>
  </div>
);

const TABS = [
  { label: 'All',    key: 'all'   },
  { label: 'Users',  key: 'user'  },
  { label: 'Agents', key: 'agent' },
  { label: 'Owners', key: 'owner' },
];

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState('all');
  const [search, setSearch]             = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openMenu, setOpenMenu]         = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const loadUsers = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeTab !== 'all') params.set('role', activeTab);
    if (search) params.set('search', search);

    adminFetch(`${API}/admin/users/?${params}`)
      .then((r) => {
        if (r.status === 401 || r.status === 403) { navigate('/admin/login'); return null; }
        return r.json();
      })
      .then((data) => { if (data) setUsers(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTab, search, navigate]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleToggle = async (user) => {
    setActionLoading(user.id);
    try {
      const r = await adminFetch(`${API}/admin/users/${user.id}/toggle/`, { method: 'PATCH' });
      if (r.ok) {
        const data = await r.json();
        setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, is_active: data.is_active } : u));
        if (selectedUser?.id === user.id) setSelectedUser((u) => ({ ...u, is_active: data.is_active }));
      }
    } finally {
      setActionLoading(null);
      setOpenMenu(null);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.full_name || user.email}? This cannot be undone.`)) return;
    setActionLoading(user.id);
    try {
      const r = await adminFetch(`${API}/admin/users/${user.id}/delete/`, { method: 'DELETE' });
      if (r.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        setSelectedUser(null);
      }
    } finally {
      setActionLoading(null);
      setOpenMenu(null);
    }
  };

  const tabCount = (key) => key === 'all' ? users.length : users.filter((u) => u.role === key).length;

  if (selectedUser) {
    return (
      <UserDetail
        user={selectedUser}
        onBack={() => setSelectedUser(null)}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="space-y-6" onClick={() => openMenu && setOpenMenu(null)}>
      <div>
        <h1 className="text-xl font-bold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {loading ? 'Loading...' : `${users.length} total accounts`}
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-3">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={cn(
              'py-4 px-5 rounded-xl border text-left transition-all',
              activeTab === t.key ? 'border-gray-300 bg-white shadow-sm' : 'border-gray-100 bg-gray-50 hover:bg-white'
            )}>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? <span className="inline-block w-8 h-7 bg-gray-200 rounded animate-pulse" /> : tabCount(t.key)}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{t.label}</div>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#002C3D]/20 focus:border-[#002C3D]/40" />
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Filter <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="border-b border-gray-100 bg-gray-50/50">
                <tr>
                  {['Full Name', 'Email Address', 'Account Type', 'Joined', 'Status', 'Action'].map((h) => (
                    <th key={h} className="px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-sm font-medium text-gray-800 whitespace-nowrap">
                      {u.full_name || `${u.first_name} ${u.last_name}`}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">{u.email}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn('px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap', typeBadge(u.role))}>
                        {typeLabel(u.role)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(u.date_joined).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap"><ActiveBadge isActive={u.is_active} /></td>
                    <td className="px-4 py-3.5 relative" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)}
                        disabled={actionLoading === u.id}
                        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40">
                        {actionLoading === u.id
                          ? <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          : <MoreVertical className="w-4 h-4" />}
                      </button>
                      {openMenu === u.id && (
                        <div className="absolute right-4 top-10 z-20 bg-white border border-gray-200 rounded-xl shadow-lg w-44 py-1 text-sm">
                          <button onClick={() => { setSelectedUser(u); setOpenMenu(null); }}
                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700 font-medium">View Details</button>
                          <button onClick={() => handleToggle(u)}
                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700">
                            {u.is_active ? 'Disable Account' : 'Enable Account'}
                          </button>
                          <button onClick={() => handleDelete(u)}
                            className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600">Delete Account</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;

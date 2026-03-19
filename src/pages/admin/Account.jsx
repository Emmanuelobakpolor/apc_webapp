import React, { useState, useEffect } from 'react';
import { User, Lock, Bell, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const API      = 'https://apc-backend-vj85.onrender.com/api/auth';
const PROP_API = 'https://apc-backend-vj85.onrender.com/api/properties';

const TABS = [
  { key: 'profile',       label: 'Profile',       icon: User },
  { key: 'security',      label: 'Security',      icon: Lock },
  { key: 'notifications', label: 'Notifications', icon: Bell },
];

const adminFetch = (url, opts = {}) =>
  fetch(url, {
    ...opts,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      'Content-Type': 'application/json',
      ...opts.headers,
    },
  });

const getAdminUser = () => {
  try { return JSON.parse(localStorage.getItem('admin_user')) || {}; }
  catch { return {}; }
};

/* ── Profile ─────────────────────────────────────────────────────────────── */
const ProfileTab = () => {
  const stored = getAdminUser();
  const [form, setForm] = useState({
    firstName: stored.first_name || stored.fullName?.split(' ')[0] || 'Admin',
    lastName:  stored.last_name  || stored.fullName?.split(' ').slice(1).join(' ') || 'User',
    email:     stored.email      || '',
    phone:     stored.phone      || stored.phoneNumber || '',
  });
  const initials = `${form.firstName?.[0] || ''}${form.lastName?.[0] || ''}`.toUpperCase() || 'A';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-[#002C3D] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{form.firstName} {form.lastName}</p>
          <p className="text-xs text-gray-500 mt-0.5">Administrator</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        {[
          { label: 'First Name', key: 'firstName' },
          { label: 'Last Name',  key: 'lastName'  },
          { label: 'Email Address', key: 'email', type: 'email' },
          { label: 'Phone Number',  key: 'phone'  },
        ].map(({ label, key, type }) => (
          <div key={key}>
            <label className="label-text">{label}</label>
            <input value={form[key]} type={type || 'text'}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              className="input-field" />
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2">
        <button className="px-6 py-2.5 bg-[#002C3D] text-white text-sm font-semibold rounded-lg hover:bg-[#003F54] transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
};

/* ── Security ────────────────────────────────────────────────────────────── */
const SecurityTab = () => {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // { type: 'success'|'error', text }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (form.newPass !== form.confirm) {
      setMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (form.newPass.length < 8) {
      setMsg({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }
    setLoading(true);
    try {
      const res = await adminFetch(`${API}/me/password/`, {
        method: 'POST',
        body: JSON.stringify({ old_password: form.current, new_password: form.newPass }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: 'Password updated successfully.' });
        setForm({ current: '', newPass: '', confirm: '' });
      } else {
        setMsg({ type: 'error', text: data.detail || 'Failed to update password.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Unable to connect to server.' });
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, fkey }) => (
    <div>
      <label className="label-text">{label}</label>
      <div className="relative">
        <input
          type={show[fkey] ? 'text' : 'password'}
          value={form[fkey]}
          onChange={e => setForm(f => ({ ...f, [fkey]: e.target.value }))}
          placeholder="••••••••"
          className="input-field pr-12"
          required
        />
        <button type="button" onClick={() => setShow(s => ({ ...s, [fkey]: !s[fkey] }))}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
          {show[fkey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-1">Change Password</h3>
        <p className="text-xs text-gray-500">Make sure your new password is at least 8 characters long.</p>
      </div>

      <Field label="Current Password" fkey="current" />
      <Field label="New Password"     fkey="newPass" />
      <Field label="Confirm Password" fkey="confirm" />

      {msg && (
        <div className={cn(
          'flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm',
          msg.type === 'success'
            ? 'bg-green-50 border border-green-100 text-green-700'
            : 'bg-red-50 border border-red-100 text-red-600'
        )}>
          {msg.type === 'success'
            ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {msg.text}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 bg-[#002C3D] text-white text-sm font-semibold rounded-lg hover:bg-[#003F54] transition-colors disabled:opacity-60 flex items-center gap-2">
          {loading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          Update Password
        </button>
      </div>
    </form>
  );
};

/* ── Notifications ───────────────────────────────────────────────────────── */
const Toggle = ({ checked, onChange }) => (
  <button type="button" onClick={() => onChange(!checked)}
    className={cn('relative w-10 h-5 rounded-full transition-colors flex-shrink-0', checked ? 'bg-[#002C3D]' : 'bg-gray-200')}>
    <span className={cn('absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform', checked ? 'translate-x-5' : 'translate-x-0')} />
  </button>
);

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const NotificationsTab = () => {
  const [settings, setSettings] = useState({ newUser: true, newAgent: true, newProperty: true });
  const [feed, setFeed]         = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetches = [
      adminFetch(`${API}/admin/users/?role=user`)
        .then(r => r.ok ? r.json() : [])
        .then(data => (Array.isArray(data) ? data : []).slice(0, 5).map(u => ({
          id: `u-${u.id}`, type: 'newUser',
          text: `${u.full_name || u.email} registered as a user`,
          date: u.date_joined,
        }))),
      adminFetch(`${API}/admin/users/?role=agent`)
        .then(r => r.ok ? r.json() : [])
        .then(data => (Array.isArray(data) ? data : []).slice(0, 5).map(u => ({
          id: `a-${u.id}`, type: 'newAgent',
          text: `${u.full_name || u.email} registered as an agent`,
          date: u.date_joined,
        }))),
      adminFetch(`${PROP_API}/admin/all/`)
        .then(r => r.ok ? r.json() : [])
        .then(data => (Array.isArray(data) ? data : []).slice(0, 5).map(p => ({
          id: `p-${p.id}`, type: 'newProperty',
          text: `"${p.title}" was listed`,
          date: p.created_at || p.date_listed,
        }))),
    ];

    Promise.all(fetches)
      .then(([users, agents, props]) => {
        const all = [...users, ...agents, ...props]
          .filter(n => n.date)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        setFeed(all);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const typeLabel = { newUser: 'User', newAgent: 'Agent', newProperty: 'Property' };
  const typeColor = {
    newUser:     'bg-blue-100 text-blue-600',
    newAgent:    'bg-green-100 text-green-700',
    newProperty: 'bg-orange-100 text-orange-600',
  };

  const visible = feed.filter(n => settings[n.type]);

  return (
    <div className="space-y-6">
      {/* Toggles */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Notification Preferences</h3>
        <div className="space-y-1">
          {[
            { key: 'newUser',     label: 'New User Registration',  desc: 'When a new user signs up'        },
            { key: 'newAgent',    label: 'New Agent Registration',  desc: 'When a new agent is registered'  },
            { key: 'newProperty', label: 'New Property Listed',     desc: 'When a new property is added'    },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <Toggle checked={settings[item.key]} onChange={val => setSettings(s => ({ ...s, [item.key]: val }))} />
            </div>
          ))}
        </div>
      </div>

      {/* Live feed */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Recent Activity</h3>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : visible.length > 0 ? (
          <div className="space-y-2">
            {visible.map(n => (
              <div key={n.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 flex-shrink-0', typeColor[n.type])}>
                  {typeLabel[n.type]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 truncate">{n.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.date)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 py-6 text-center">No recent activity.</p>
        )}
      </div>
    </div>
  );
};

/* ── Page ────────────────────────────────────────────────────────────────── */
const AdminAccount = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your admin account preferences</p>
      </div>

      <div className="flex gap-6">
        <div className="w-52 flex-shrink-0 space-y-1">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left',
                  activeTab === t.key ? 'bg-[#002C3D] text-white' : 'text-gray-600 hover:bg-gray-100'
                )}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6">
          {activeTab === 'profile'       && <ProfileTab />}
          {activeTab === 'security'      && <SecurityTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminAccount;

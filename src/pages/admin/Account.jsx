import React, { useState } from 'react';
import { User, Lock, Bell, Shield, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

const TABS = [
  { key: 'profile',       label: 'Profile',           icon: User   },
  { key: 'security',      label: 'Security',          icon: Lock   },
  { key: 'notifications', label: 'Notifications',     icon: Bell   },
];

const ProfileTab = () => {
  const [form, setForm] = useState({
    firstName: 'Eric',
    lastName:  'Kayser',
    email:     'admin@apc.com',
    phone:     '+234 800 000 0001',
  });

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-[#002C3D] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {form.firstName[0]}{form.lastName[0]}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{form.firstName} {form.lastName}</p>
          <p className="text-xs text-gray-500 mt-0.5">Administrator</p>
          <button className="mt-2 text-xs text-[#002C3D] font-semibold hover:underline">
            Change photo
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="label-text">First Name</label>
          <input
            value={form.firstName}
            onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-text">Last Name</label>
          <input
            value={form.lastName}
            onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-text">Email Address</label>
          <input
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            type="email"
            className="input-field"
          />
        </div>
        <div>
          <label className="label-text">Phone Number</label>
          <input
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="input-field"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button className="px-6 py-2.5 bg-[#002C3D] text-white text-sm font-semibold rounded-lg hover:bg-[#003F54] transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
};

const SecurityTab = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const PasswordField = ({ label, show, onToggle }) => (
    <div>
      <label className="label-text">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          placeholder="••••••••"
          className="input-field pr-12"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-1">Change Password</h3>
        <p className="text-xs text-gray-500">Make sure your new password is at least 8 characters long.</p>
      </div>
      <PasswordField label="Current Password"  show={showCurrent} onToggle={() => setShowCurrent(v => !v)} />
      <PasswordField label="New Password"      show={showNew}     onToggle={() => setShowNew(v => !v)}     />
      <PasswordField label="Confirm Password"  show={showConfirm} onToggle={() => setShowConfirm(v => !v)} />
      <div className="flex justify-end pt-2">
        <button className="px-6 py-2.5 bg-[#002C3D] text-white text-sm font-semibold rounded-lg hover:bg-[#003F54] transition-colors">
          Update Password
        </button>
      </div>
    </div>
  );
};

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={cn(
      'relative w-10 h-5 rounded-full transition-colors flex-shrink-0',
      checked ? 'bg-[#002C3D]' : 'bg-gray-200'
    )}
  >
    <span
      className={cn(
        'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
        checked ? 'translate-x-5' : 'translate-x-0'
      )}
    />
  </button>
);

const NotificationsTab = () => {
  const [settings, setSettings] = useState({
    newUser:    true,
    newAgent:   true,
    newProperty:false,
    disputes:   true,
    reports:    false,
    systemAlerts:true,
  });

  const items = [
    { key: 'newUser',      label: 'New User Registration',   desc: 'Get notified when a new user signs up'           },
    { key: 'newAgent',     label: 'New Agent Registration',  desc: 'Get notified when a new agent is verified'       },
    { key: 'newProperty',  label: 'New Property Listed',     desc: 'Get notified when a new property is listed'      },
    { key: 'disputes',     label: 'Disputes & Reports',      desc: 'Get notified about user disputes and reports'    },
    { key: 'reports',      label: 'Weekly Reports',          desc: 'Receive weekly platform performance reports'     },
    { key: 'systemAlerts', label: 'System Alerts',           desc: 'Critical system health and security alerts'      },
  ];

  return (
    <div className="space-y-4">
      {items.map(item => (
        <div key={item.key} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
          <div>
            <p className="text-sm font-semibold text-gray-800">{item.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
          </div>
          <Toggle
            checked={settings[item.key]}
            onChange={val => setSettings(s => ({ ...s, [item.key]: val }))}
          />
        </div>
      ))}
    </div>
  );
};

const AdminAccount = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const renderTab = () => {
    if (activeTab === 'profile')       return <ProfileTab />;
    if (activeTab === 'security')      return <SecurityTab />;
    if (activeTab === 'notifications') return <NotificationsTab />;
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your admin account preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-52 flex-shrink-0 space-y-1">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left',
                  activeTab === t.key
                    ? 'bg-[#002C3D] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6">
          {renderTab()}
        </div>
      </div>
    </div>
  );
};

export default AdminAccount;

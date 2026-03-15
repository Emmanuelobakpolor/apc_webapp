import React, { useState, useEffect, useRef } from 'react';
import { Camera, Eye, EyeOff, Bell, Shield, User, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth, getInitials, getRoleLabel } from '../../context/AuthContext';

const API = 'http://localhost:8000/api/auth';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
});

const SectionCard = ({ title, subtitle, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
    <div className="flex items-center gap-3 px-7 py-5 border-b border-gray-50">
      <div className="w-9 h-9 rounded-xl bg-[#EEF5F8] flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-[#002C3D]" />
      </div>
      <div>
        <h2 className="text-sm font-bold text-[#002C3D]">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="px-7 py-6">{children}</div>
  </div>
);

const Toggle = ({ on, onChange }) => (
  <button
    onClick={onChange}
    className={cn(
      'w-11 h-6 rounded-full transition-all relative flex-shrink-0',
      on ? 'bg-[#002C3D]' : 'bg-gray-200'
    )}
  >
    <span className={cn(
      'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all',
      on ? 'left-[22px]' : 'left-0.5'
    )} />
  </button>
);

const Settings = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
    profile_picture_url: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [newPicFile, setNewPicFile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwords, setPasswords] = useState({ old_password: '', new_password: '' });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState(null);

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    inquiries: true,
  });

  // Fetch real profile on mount
  useEffect(() => {
    fetch(`${API}/me/`, { headers: authHeaders() })
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then((data) => {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || '',
          phone_number: data.phoneNumber || '',
          address: data.address || '',
          profile_picture_url: data.avatarUrl || null,
        });
      })
      .catch(() => {});
  }, []);

  const handlePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewPicFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleProfileSave = async () => {
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      const fd = new FormData();
      fd.append('full_name', profile.full_name);
      fd.append('phone_number', profile.phone_number);
      fd.append('address', profile.address);
      if (newPicFile) fd.append('profile_picture', newPicFile);

      const res = await fetch(`${API}/me/update/`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Update failed.');

      setProfile((p) => ({
        ...p,
        full_name: data.full_name,
        phone_number: data.phoneNumber || p.phone_number,
        address: data.address,
        profile_picture_url: data.avatarUrl || p.profile_picture_url,
      }));
      // Sync sidebar/header
      updateUser({
        full_name: data.full_name,
        profile_picture_url: data.avatarUrl || profile.profile_picture_url,
      });
      setNewPicFile(null);
      setProfileMsg({ type: 'ok', text: 'Profile updated successfully.' });
    } catch (err) {
      setProfileMsg({ type: 'err', text: err.message });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    setPwdLoading(true);
    setPwdMsg(null);
    try {
      const res = await fetch(`${API}/me/password/`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(passwords),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Password change failed.');
      setPasswords({ old_password: '', new_password: '' });
      setPwdMsg({ type: 'ok', text: data.detail });
    } catch (err) {
      setPwdMsg({ type: 'err', text: err.message });
    } finally {
      setPwdLoading(false);
    }
  };

  const avatarSrc = previewUrl || profile.profile_picture_url;
  const initials = getInitials(profile.full_name || user?.full_name);
  const roleLabel = getRoleLabel(user?.role);

  return (
    <div className="max-w-3xl mx-auto space-y-7 animate-in fade-in duration-700">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#002C3D] tracking-tight">Account Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your profile and preferences</p>
      </div>

      {/* Profile Information */}
      <SectionCard title="Profile Information" subtitle="Update your personal details" icon={User}>
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-7">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#002C3D] flex items-center justify-center overflow-hidden">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-lg">{initials}</span>
              )}
            </div>
            <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePictureChange}
            />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">{profile.full_name || user?.full_name || ''}</p>
            <p className="text-xs text-gray-400 mt-0.5 mb-3">
              {roleLabel}{profile.address ? ` · ${profile.address}` : ''}
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all"
            >
              Change Photo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="label-text">Full Name</label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-text">Email Address</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="input-field opacity-60 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="label-text">Phone Number</label>
            <input
              type="text"
              value={profile.phone_number}
              onChange={(e) => setProfile((p) => ({ ...p, phone_number: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-text">Location</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
              className="input-field"
            />
          </div>
        </div>

        {profileMsg && (
          <p className={cn('mt-4 text-xs font-medium', profileMsg.type === 'ok' ? 'text-green-600' : 'text-red-500')}>
            {profileMsg.text}
          </p>
        )}

        <div className="flex justify-end mt-5">
          <button
            onClick={handleProfileSave}
            disabled={profileLoading}
            className="px-8 py-2.5 bg-[#002C3D] text-white rounded-xl text-sm font-bold hover:bg-[#003F54] transition-all shadow-sm disabled:opacity-60 flex items-center gap-2"
          >
            {profileLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Profile
          </button>
        </div>
      </SectionCard>

      {/* Security */}
      <SectionCard title="Security" subtitle="Change your password" icon={Shield}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="label-text">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                placeholder="••••••••"
                value={passwords.old_password}
                onChange={(e) => setPasswords((p) => ({ ...p, old_password: e.target.value }))}
                className="input-field pr-11"
              />
              <button
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="label-text">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={passwords.new_password}
                onChange={(e) => setPasswords((p) => ({ ...p, new_password: e.target.value }))}
                className="input-field pr-11"
              />
              <button
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {pwdMsg && (
          <p className={cn('mt-4 text-xs font-medium', pwdMsg.type === 'ok' ? 'text-green-600' : 'text-red-500')}>
            {pwdMsg.text}
          </p>
        )}

        <div className="flex justify-end mt-5">
          <button
            onClick={handlePasswordSave}
            disabled={pwdLoading}
            className="px-8 py-2.5 bg-[#002C3D] text-white rounded-xl text-sm font-bold hover:bg-[#003F54] transition-all shadow-sm disabled:opacity-60 flex items-center gap-2"
          >
            {pwdLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Change Password
          </button>
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard title="Notifications" subtitle="Choose how you receive updates" icon={Bell}>
        <div className="space-y-5">
          {[
            { key: 'email',     label: 'Email notifications',   desc: 'Receive updates and alerts via email'       },
            { key: 'sms',       label: 'SMS notifications',     desc: 'Get important alerts sent to your phone'    },
            { key: 'inquiries', label: 'New inquiry alerts',    desc: 'Be notified instantly when someone inquires' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
              <Toggle on={notifications[key]} onChange={() => setNotifications((p) => ({ ...p, [key]: !p[key] }))} />
            </div>
          ))}
        </div>
      </SectionCard>

    </div>
  );
};

export default Settings;

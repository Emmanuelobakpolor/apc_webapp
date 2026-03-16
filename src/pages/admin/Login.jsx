import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Lock, Mail } from 'lucide-react';
import apcLogo from '../../assets/image.png';

const API = 'http://localhost:8000/api/auth';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${API}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.non_field_errors?.[0] || data.detail || 'Invalid credentials.';
        setError(typeof msg === 'object' ? msg.email || 'Invalid credentials.' : msg);
        return;
      }

      if (data.user?.accountType !== 'admin') {
        setError('This account does not have admin access.');
        return;
      }

      localStorage.setItem('admin_token', data.access);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      navigate('/admin/dashboard');
    } catch {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-[420px] bg-[#002C3D] flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <img src={apcLogo} alt="APC" className="w-10 h-10 rounded-lg object-cover" />
          <span className="text-white font-bold text-xl">Admin Panel</span>
        </div>
        <div>
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-white text-3xl font-bold leading-snug mb-4">
            Manage everything<br />from one place
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            The APC admin portal gives you full control over users, agents, properties, and platform settings.
          </p>
        </div>
        <div className="bg-white/10 rounded-xl p-5 border border-white/10">
          <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-2">Note</p>
          <p className="text-white/70 text-sm">Sign in with an account that has admin role assigned in the backend.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <img src={apcLogo} alt="APC" className="w-10 h-10 rounded-lg object-cover" />
            <span className="text-[#002C3D] font-bold text-xl">Admin Panel</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 mb-8">Sign in to access the administrator dashboard</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-[18px] h-[18px]" />
                <input
                  id="email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#002C3D] focus:border-transparent outline-none transition-all text-sm"
                  required autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-[18px] h-[18px]" />
                <input
                  id="password" type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#002C3D] focus:border-transparent outline-none transition-all text-sm"
                  required autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full py-3 bg-[#002C3D] text-white font-semibold rounded-lg hover:bg-[#00374d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in...</>
              ) : 'Sign in to Dashboard'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Back to{' '}
            <button onClick={() => navigate('/')} className="text-[#002C3D] font-semibold hover:underline">Home</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

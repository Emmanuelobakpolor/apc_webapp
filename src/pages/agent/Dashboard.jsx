import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  ArrowUpRight,
  TrendingUp,
  Eye,
  MessageSquare,
  Star,
  Home,
  ChevronRight,
  MapPin,
  Loader2,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

const API = 'https://apc-backend-vj85.onrender.com/api/properties';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('access_token')}` });

const Avatar = ({ name }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const palettes = [
    'bg-violet-100 text-violet-700',
    'bg-blue-100 text-blue-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
  ];
  const color = palettes[name.charCodeAt(0) % palettes.length];
  return (
    <div className={cn('w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold', color)}>
      {initials}
    </div>
  );
};

const StatCard = ({ title, value, change, icon: Icon, accent, loading }) => (
  <div className={cn(
    'flex-1 min-w-[210px] p-6 rounded-2xl border transition-all hover:shadow-md cursor-pointer',
    accent ? 'bg-[#002C3D] border-transparent' : 'bg-white border-gray-100'
  )}>
    <div className="flex items-start justify-between mb-5">
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center',
        accent ? 'bg-white/10' : 'bg-[#EEF5F8]'
      )}>
        <Icon className={cn('w-5 h-5', accent ? 'text-white' : 'text-[#002C3D]')} />
      </div>
      {change && (
        <span className={cn(
          'text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1',
          accent ? 'bg-white/10 text-emerald-300' : 'bg-emerald-50 text-emerald-600'
        )}>
          <TrendingUp className="w-3 h-3" />
          {change}
        </span>
      )}
    </div>
    <p className={cn('text-[12px] font-medium mb-1.5', accent ? 'text-white/50' : 'text-gray-400')}>{title}</p>
    {loading ? (
      <div className={cn('w-12 h-8 rounded-lg animate-pulse', accent ? 'bg-white/10' : 'bg-gray-100')} />
    ) : (
      <p className={cn('text-3xl font-bold tracking-tight', accent ? 'text-white' : 'text-[#002C3D]')}>{value}</p>
    )}
  </div>
);

const TYPE_COLORS = {
  apartment: '#002C3D',
  villa:     '#476D7C',
  duplex:    '#6B99A8',
  bungalow:  '#8FB5BF',
  studio:    '#A8CAD4',
  land:      '#C5DEE3',
};

const PropertyMixChart = ({ properties }) => {
  const counts = {};
  properties.forEach(p => {
    const t = (p.property_type || 'other').toLowerCase();
    counts[t] = (counts[t] || 0) + 1;
  });
  const total = properties.length;
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-400">
        <Home className="w-8 h-8 mb-2 opacity-30" />
        <p className="text-sm font-medium">No properties yet</p>
      </div>
    );
  }

  let cum = 0;
  const segments = entries.map(([type, count]) => {
    const pct = (count / total) * 100;
    const color = TYPE_COLORS[type] || '#94A3B8';
    const seg = { type, count, pct, color, start: cum };
    cum += pct;
    return seg;
  });
  const gradient = segments.map(s => `${s.color} ${s.start}% ${s.start + s.pct}%`).join(', ');

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8">
      {/* Donut */}
      <div className="relative flex-shrink-0 w-36 h-36">
        <div
          className="w-full h-full rounded-full"
          style={{ background: `conic-gradient(${gradient})` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[86px] h-[86px] rounded-full bg-white flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#002C3D] leading-none">{total}</span>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5">listings</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 grid grid-cols-2 gap-3 w-full">
        {segments.map(s => (
          <div key={s.type} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100/80 transition-colors">
            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-700 capitalize truncate">{s.type}</p>
              <p className="text-[11px] text-gray-400">
                {s.count} &middot; {Math.round(s.pct)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const formatPrice = (price) =>
  Number(price).toLocaleString('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 });

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso);
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};


const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const firstName = user?.full_name?.split(' ')[0] || '';

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [allInquiries, setAllInquiries] = useState([]);
  const [totalInquiries, setTotalInquiries] = useState(0);

  useEffect(() => {
    fetch(`${API}/`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(data => { setProperties(Array.isArray(data) ? data : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(`${API}/inquiries/`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        setTotalInquiries(arr.length);
        setAllInquiries(arr);
        setRecentInquiries(arr.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  const totalViews = properties.reduce((s, p) => s + (p.views_count || 0), 0);
  const activeCount = properties.filter(p => p.status === 'available').length;
  const soldCount = properties.filter(p => p.status === 'sold').length;
  const newInquiriesCount = allInquiries.filter(i => !i.is_read).length;
  const repliedCount = allInquiries.filter(i => i.is_read).length;

  const stats = [
    { title: 'Listed Properties', value: String(properties.length), icon: Home,          accent: true },
    { title: 'Total Views',        value: totalViews.toLocaleString(), icon: Eye                       },
    { title: 'Inquiries',          value: String(totalInquiries),      icon: MessageSquare              },
    { title: 'Avg. Rating',        value: '4.8',  change: '+0.2',      icon: Star                      },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-7 animate-in fade-in duration-700">

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">{today}</p>
          <h1 className="text-2xl font-bold text-[#002C3D] tracking-tight">Good morning{firstName ? `, ${firstName}` : ''} 👋</h1>
          <p className="text-sm text-gray-400 mt-1">Here's what's happening with your listings today.</p>
        </div>
        <button
          onClick={() => navigate('/agent/properties')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#002C3D] text-white rounded-xl text-sm font-semibold hover:bg-[#003F54] transition-all shadow-sm mt-1"
        >
          <Plus className="w-4 h-4" />
          List Property
        </button>
      </div>

      {/* Stat Cards */}
      <div className="flex gap-4 overflow-x-auto pb-1">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} loading={loading} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Recent Inquiries */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <div>
              <h2 className="text-sm font-bold text-[#002C3D]">Recent Inquiries</h2>
              <p className="text-xs text-gray-400 mt-0.5">{recentInquiries.filter(i => !i.is_read).length} new</p>
            </div>
            <button onClick={() => navigate('/agent/inquiries')} className="text-xs font-semibold text-[#476D7C] hover:text-[#002C3D] flex items-center gap-0.5 transition-colors">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentInquiries.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">No inquiries yet.</p>
            ) : recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer">
                <Avatar name={inquiry.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800">{inquiry.name}</p>
                    {!inquiry.is_read && (
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-full">New</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{inquiry.property_title}</p>
                </div>
                <span className="text-[11px] text-gray-400 font-medium flex-shrink-0">{timeAgo(inquiry.created_at)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Listing Snapshot */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50">
            <h2 className="text-sm font-bold text-[#002C3D]">Listing Snapshot</h2>
            <p className="text-xs text-gray-400 mt-0.5">Live from your data</p>
          </div>
          <div className="px-6 py-6 space-y-5">
            {[
              { label: 'Available', value: activeCount,        total: properties.length, color: 'bg-emerald-500', sub: 'of your listings' },
              { label: 'Sold',      value: soldCount,          total: properties.length, color: 'bg-gray-400',    sub: 'of your listings' },
              { label: 'New',       value: newInquiriesCount,  total: totalInquiries,    color: 'bg-blue-500',    sub: 'of all inquiries' },
              { label: 'Replied',   value: repliedCount,       total: totalInquiries,    color: 'bg-[#476D7C]',  sub: 'of all inquiries' },
            ].map((item) => {
              const pct = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-semibold text-gray-700">{item.label}</span>
                      <span className="text-[11px] text-gray-400 ml-1.5">{item.sub}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#002C3D]">{item.value}</span>
                      <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">{pct}%</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full transition-all duration-700', item.color)} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Property Mix */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <div>
            <h2 className="text-sm font-bold text-[#002C3D]">Property Mix</h2>
            <p className="text-xs text-gray-400 mt-0.5">Breakdown of your listings by type</p>
          </div>
          <span className="text-[11px] font-semibold text-[#476D7C] bg-[#EEF5F8] px-3 py-1 rounded-full">
            {properties.length} total
          </span>
        </div>
        <div className="px-6 py-6">
          <PropertyMixChart properties={properties} />
        </div>
      </div>

      {/* My Properties */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <div>
            <h2 className="text-sm font-bold text-[#002C3D]">My Properties</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {loading ? 'Loading...' : `${activeCount} active listing${activeCount !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={() => navigate('/agent/properties')}
            className="text-xs font-semibold text-[#476D7C] hover:text-[#002C3D] flex items-center gap-0.5 transition-colors"
          >
            Manage All <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading properties...
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Home className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No properties yet</p>
              <p className="text-xs mt-1">Click "List Property" to add your first listing</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {properties.map((prop) => (
                <div
                  key={prop.id}
                  className="group relative overflow-hidden rounded-xl border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-300"
                  onClick={() => navigate('/agent/properties')}
                >
                  <div className="relative overflow-hidden h-44">
                    {prop.front_image_url ? (
                      <img
                        src={prop.front_image_url}
                        alt={prop.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#EEF5F8] flex items-center justify-center">
                        <Home className="w-8 h-8 text-[#476D7C]/40" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-[#002C3D]/90 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                      {prop.property_type}
                    </span>
                    <span className={cn(
                      'absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-sm',
                      prop.status === 'active'
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-gray-500/90 text-white'
                    )}>
                      {prop.status}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-gray-800 mb-1 truncate">{prop.title}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{prop.city_state}</span>
                    </p>
                    <p className="text-xs font-bold text-[#002C3D] mb-3">{formatPrice(prop.price)}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                        <Eye className="w-3 h-3" /> {(prop.views_count || 0).toLocaleString()} views
                      </span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                        <MessageSquare className="w-3 h-3" /> {prop.inquiries_count || 0} inquiries
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

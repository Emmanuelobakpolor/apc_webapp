import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MessageSquare, ChevronRight, MapPin, Phone } from 'lucide-react';

const PROP_API = 'https://apc-backend-vj85.onrender.com/api/properties';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('access_token')}` });

const TYPE_COLORS = {
  apartment: '#002C3D',
  villa:     '#476D7C',
  duplex:    '#6B99A8',
  bungalow:  '#8FB5BF',
  studio:    '#A8CAD4',
  land:      '#C5DEE3',
};

const PortfolioChart = ({ properties }) => {
  const counts = {};
  properties.forEach(p => { counts[p.property_type] = (counts[p.property_type] || 0) + 1; });
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const maxCount = entries[0]?.[1] || 1;
  if (entries.length === 0) return <p className="text-sm text-gray-400 text-center py-6">No properties yet.</p>;
  return (
    <div className="space-y-3">
      {entries.map(([type, count]) => (
        <div key={type} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-medium w-20 flex-shrink-0 capitalize">{TYPE_LABELS[type] || type}</span>
          <div className="flex-1 h-7 bg-gray-50 rounded-lg overflow-hidden">
            <div
              className="h-full rounded-lg flex items-center px-2.5 transition-all duration-700"
              style={{ width: `${Math.max((count / maxCount) * 100, 8)}%`, backgroundColor: TYPE_COLORS[type] || '#476D7C' }}
            >
              <span className="text-[10px] font-bold text-white/90 leading-none">{count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="flex-1 min-w-[150px] bg-white rounded-2xl border border-gray-100 shadow-card p-5 flex flex-col items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-[#EEF5F8] flex items-center justify-center">
      <Icon className="w-5 h-5 text-[#002C3D]" />
    </div>
    <div className="text-center">
      <p className="text-2xl font-bold text-[#002C3D]">{value}</p>
      <p className="text-xs text-gray-400 font-medium mt-0.5">{title}</p>
    </div>
  </div>
);

const PALETTES = [
  'bg-violet-100 text-violet-700',
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
];

const Avatar = ({ name }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const color = PALETTES[name.charCodeAt(0) % PALETTES.length];
  return (
    <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm ${color}`}>
      {initials}
    </div>
  );
};

const TYPE_LABELS = { apartment: 'Apartment', villa: 'Villa', duplex: 'Duplex', bungalow: 'Bungalow', studio: 'Studio', land: 'Land' };
const formatPrice = (p) => `₦${Number(p).toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;

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
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [totalProperties, setTotalProperties] = useState(0);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [totalInquiries, setTotalInquiries] = useState(0);

  useEffect(() => {
    fetch(`${PROP_API}/`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        setTotalProperties(arr.length);
        setAllProperties(arr);
        setProperties(arr.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${PROP_API}/inquiries/`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        setTotalInquiries(arr.length);
        setRecentInquiries(arr.slice(0, 5));
      })
      .catch(() => {});
  }, []);

  const availableCount = allProperties.filter(p => p.status === 'available').length;
  const soldCount = allProperties.filter(p => p.status === 'sold').length;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-700">

      {/* Stat Cards — removed Total Tenants */}
      <div className="flex gap-4 overflow-x-auto pb-1">
        <StatCard title="Total Properties" value={totalProperties} icon={Building2}     />
        <StatCard title="Total Inquiries"  value={totalInquiries} icon={MessageSquare} />
      </div>

      {/* Portfolio Overview */}
<div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_10px_40px_rgba(2,12,27,0.06)]">
  {/* Soft background accents */}
  <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-cyan-100/40 blur-3xl" />
  <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-emerald-100/40 blur-3xl" />

  {/* Header */}
  <div className="relative flex flex-col gap-4 border-b border-slate-100 px-6 py-6 md:flex-row md:items-center md:justify-between">
    <div className="space-y-1">
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-700">
        <span className="h-2 w-2 rounded-full bg-cyan-500" />
        Portfolio Summary
      </div>

      <h2 className="text-xl font-bold tracking-tight text-slate-900">
        Portfolio Overview
      </h2>

      <p className="text-sm text-slate-500">
        A quick breakdown of your properties by type and status.
      </p>
    </div>

    <div className="flex flex-wrap items-center gap-3">
      <div className="min-w-[110px] rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
          Available
        </p>
        <div className="mt-1 flex items-end gap-1">
          <span className="text-2xl font-bold text-emerald-700">
            {availableCount}
          </span>
          <span className="mb-1 text-xs text-emerald-500">Properties</span>
        </div>
      </div>

      <div className="min-w-[110px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Sold
        </p>
        <div className="mt-1 flex items-end gap-1">
          <span className="text-2xl font-bold text-slate-700">
            {soldCount}
          </span>
          <span className="mb-1 text-xs text-slate-400">Properties</span>
        </div>
      </div>
    </div>
  </div>

  {/* Chart section */}
  <div className="relative px-6 py-6">
    <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-cyan-50/40 p-4 md:p-5">
      <PortfolioChart properties={allProperties} />
    </div>
  </div>
</div>
      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Inquiries */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <h2 className="text-sm font-bold text-[#002C3D]">Recent Inquiries</h2>
            <button onClick={() => navigate('/owner/inquiries')} className="text-xs font-semibold text-[#476D7C] hover:text-[#002C3D] flex items-center gap-0.5 transition-colors">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentInquiries.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">No inquiries yet.</p>
            ) : recentInquiries.map((inq) => (
              <div key={inq.id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50/40 transition-colors">
                <Avatar name={inq.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800">{inq.name}</p>
                    {!inq.is_read && (
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-full">New</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{inq.property_title}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[11px] text-gray-400 font-medium">{timeAgo(inq.created_at)}</span>
                  <a href={`tel:${inq.phone}`} className="w-7 h-7 rounded-lg bg-[#EEF5F8] flex items-center justify-center text-[#476D7C] hover:bg-[#476D7C] hover:text-white transition-all">
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Properties Added */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <h2 className="text-sm font-bold text-[#002C3D]">Recent Properties Added</h2>
            <button onClick={() => navigate('/owner/properties')} className="text-xs font-semibold text-[#476D7C] hover:text-[#002C3D] flex items-center gap-0.5 transition-colors">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {properties.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">No properties added yet.</p>
            ) : properties.map((prop) => (
              <div key={prop.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/40 transition-colors">
                {prop.front_image_url ? (
                  <img src={prop.front_image_url} alt={prop.title} className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-[#EEF5F8] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-[#476D7C]" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{prop.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" />{prop.city_state}
                    <span className="text-gray-300 mx-1">·</span>
                    {TYPE_LABELS[prop.property_type] || prop.property_type}
                  </p>
                </div>
                <span className="text-sm font-bold text-[#002C3D] flex-shrink-0">{formatPrice(prop.price)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

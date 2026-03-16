import React, { useState, useEffect, useCallback } from 'react';
import { Search, MoreVertical, ArrowLeft, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

const AUTH_API  = 'http://localhost:8000/api/auth';
const PROP_API  = 'http://localhost:8000/api/properties';

const adminFetch = (url, opts = {}) =>
  fetch(url, {
    ...opts,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      'Content-Type': 'application/json',
      ...opts.headers,
    },
  });

const ActiveBadge = ({ isActive }) => (
  <span className={cn('flex items-center gap-1.5 text-xs font-medium', isActive ? 'text-green-600' : 'text-red-500')}>
    <span className={cn('w-2 h-2 rounded-full', isActive ? 'bg-green-500' : 'bg-red-400')} />
    {isActive ? 'Active' : 'Disabled'}
  </span>
);

const PropertyMiniCard = ({ prop }) => (
  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <div className="relative h-32 bg-gray-100">
      {prop.front_image_url ? (
        <img src={prop.front_image_url} alt={prop.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No image</div>
      )}
      <span className="absolute top-2 left-2 bg-[#002C3D] text-white text-[10px] font-bold px-2 py-0.5 rounded capitalize">
        {prop.property_type}
      </span>
      <span className="absolute top-2 right-2 bg-white border border-gray-200 text-[10px] font-bold px-2 py-0.5 rounded text-gray-700 capitalize">
        {prop.listing_type}
      </span>
    </div>
    <div className="p-3 space-y-1">
      <p className="text-xs font-semibold text-gray-800 line-clamp-1">{prop.title}</p>
      <p className="text-xs text-gray-500 flex items-center gap-1">
        <MapPin className="w-3 h-3 flex-shrink-0" /> {prop.city_state || prop.address}
      </p>
      <p className="text-xs font-bold text-[#002C3D]">₦{Number(prop.price).toLocaleString()}</p>
    </div>
  </div>
);

const AgentDetail = ({ agent, onBack, onToggle, onDelete, actionLoading }) => {
  const [properties, setProperties] = useState([]);
  const [propLoading, setPropLoading] = useState(true);

  useEffect(() => {
    adminFetch(`${PROP_API}/admin/all/?agent=${agent.id}`)
      .then((r) => r.json())
      .then((data) => setProperties(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setPropLoading(false));
  }, [agent.id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Agent Details
        </button>
        <ActiveBadge isActive={agent.is_active} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{agent.full_name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Location: <span className="font-semibold text-gray-700">{agent.location || '—'}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onToggle(agent)} disabled={actionLoading === agent.id}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
              {agent.is_active ? 'Disable Account' : 'Enable Account'}
            </button>
            <button onClick={() => onDelete(agent)} disabled={actionLoading === agent.id}
              className="px-4 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
              Delete Agent
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-8 gap-y-6">
          <div><p className="text-xs text-gray-400 mb-1">Email Address</p><p className="text-sm font-medium text-gray-800">{agent.email}</p></div>
          <div><p className="text-xs text-gray-400 mb-1">Phone Number</p><p className="text-sm font-bold text-gray-900">{agent.phone || '—'}</p></div>
          <div><p className="text-xs text-gray-400 mb-1">Date Joined</p>
            <p className="text-sm font-bold text-[#002C3D]">
              {new Date(agent.date_joined).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
          Properties ({propLoading ? '…' : properties.length})
        </h3>
        {propLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-44 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : properties.length === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">No properties listed yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {properties.map((p) => <PropertyMiniCard key={p.id} prop={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

const AdminAgents = () => {
  const navigate = useNavigate();
  const [agents, setAgents]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [openMenu, setOpenMenu]           = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const loadAgents = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ role: 'agent' });
    if (search) params.set('search', search);
    adminFetch(`${AUTH_API}/admin/users/?${params}`)
      .then((r) => {
        if (r.status === 401 || r.status === 403) { navigate('/admin/login'); return null; }
        return r.json();
      })
      .then((data) => { if (data) setAgents(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, navigate]);

  useEffect(() => { loadAgents(); }, [loadAgents]);

  const handleToggle = async (agent) => {
    setActionLoading(agent.id);
    try {
      const r = await adminFetch(`${AUTH_API}/admin/users/${agent.id}/toggle/`, { method: 'PATCH' });
      if (r.ok) {
        const data = await r.json();
        setAgents((prev) => prev.map((a) => a.id === agent.id ? { ...a, is_active: data.is_active } : a));
        if (selectedAgent?.id === agent.id) setSelectedAgent((a) => ({ ...a, is_active: data.is_active }));
      }
    } finally { setActionLoading(null); setOpenMenu(null); }
  };

  const handleDelete = async (agent) => {
    if (!window.confirm(`Delete ${agent.full_name}? This cannot be undone.`)) return;
    setActionLoading(agent.id);
    try {
      const r = await adminFetch(`${AUTH_API}/admin/users/${agent.id}/delete/`, { method: 'DELETE' });
      if (r.ok) { setAgents((prev) => prev.filter((a) => a.id !== agent.id)); setSelectedAgent(null); }
    } finally { setActionLoading(null); setOpenMenu(null); }
  };

  if (selectedAgent) {
    return (
      <AgentDetail
        agent={selectedAgent}
        onBack={() => setSelectedAgent(null)}
        onToggle={handleToggle}
        onDelete={handleDelete}
        actionLoading={actionLoading}
      />
    );
  }

  return (
    <div className="space-y-6" onClick={() => openMenu && setOpenMenu(null)}>
      <div>
        <h1 className="text-xl font-bold text-gray-900">Agent Management</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {loading ? 'Loading...' : `${agents.length} registered agents`}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#002C3D]/20 focus:border-[#002C3D]/40" />
          </div>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : agents.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No agents found.</div>
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
                {agents.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-sm font-medium text-gray-800 whitespace-nowrap">{a.full_name}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">{a.email}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500 text-white">Agent</span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(a.date_joined).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap"><ActiveBadge isActive={a.is_active} /></td>
                    <td className="px-4 py-3.5 relative" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setOpenMenu(openMenu === a.id ? null : a.id)}
                        disabled={actionLoading === a.id}
                        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40">
                        {actionLoading === a.id
                          ? <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          : <MoreVertical className="w-4 h-4" />}
                      </button>
                      {openMenu === a.id && (
                        <div className="absolute right-4 top-10 z-20 bg-white border border-gray-200 rounded-xl shadow-lg w-44 py-1 text-sm">
                          <button onClick={() => { setSelectedAgent(a); setOpenMenu(null); }}
                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700 font-medium">View Details</button>
                          <button onClick={() => handleToggle(a)}
                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700">
                            {a.is_active ? 'Disable Account' : 'Enable Account'}
                          </button>
                          <button onClick={() => handleDelete(a)}
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

export default AdminAgents;

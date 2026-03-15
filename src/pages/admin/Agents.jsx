import React, { useState } from 'react';
import { Search, ChevronDown, MoreVertical, ArrowLeft, Plus, MapPin, BedDouble, Bath } from 'lucide-react';
import { cn } from '../../utils/cn';

const AGENTS = [
  { id: 1, name: 'John Olamide Oboyibo', email: 'Johnolamideh@gmail.com', joined: '10 Nov 2025', status: 'online',    location: 'Lagos, Nigeria',         phone: '+234 8082428134', gender: 'Male'   },
  { id: 2, name: 'Sarah Adebayo',         email: 'sarah.adebayo@gmail.com',  joined: '10 Nov 2025', status: 'online',    location: 'Abuja, Nigeria',         phone: '+234 8082428135', gender: 'Female' },
  { id: 3, name: 'Damilola Sanni',        email: 'damilola.sanni@gmail.com', joined: '10 Nov 2025', status: 'last_8hr',  location: 'Port Harcourt, Nigeria', phone: '+234 8082428138', gender: 'Male'   },
  { id: 4, name: 'Adebayo Salami',        email: 'adebayo.salami@gmail.com', joined: '10 Nov 2025', status: 'last_3min', location: 'Lagos, Nigeria',         phone: '+234 8082428141', gender: 'Male'   },
  { id: 5, name: 'Amaka Eze',             email: 'amaka.eze@gmail.com',      joined: '10 Nov 2025', status: 'online',    location: 'Onitsha, Nigeria',       phone: '+234 8082428144', gender: 'Female' },
  { id: 6, name: 'Chinwe Bright',         email: 'chinwe.bright@gmail.com',  joined: '10 Nov 2025', status: 'online',    location: 'Lagos, Nigeria',         phone: '+234 8082428150', gender: 'Female' },
  { id: 7, name: 'Emeka Obi',             email: 'emeka.obi@gmail.com',      joined: '10 Nov 2025', status: 'online',    location: 'Enugu, Nigeria',         phone: '+234 8082428151', gender: 'Male'   },
  { id: 8, name: 'Yetunde Balogun',       email: 'yetunde.b@gmail.com',      joined: '10 Nov 2025', status: 'last_8hr',  location: 'Ibadan, Nigeria',        phone: '+234 8082428152', gender: 'Female' },
  { id: 9, name: 'Tunde Fashola',         email: 'tunde.f@gmail.com',        joined: '10 Nov 2025', status: 'online',    location: 'Lagos, Nigeria',         phone: '+234 8082428153', gender: 'Male'   },
];

const PROP_IMAGE = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=400';

const AGENT_PROPERTIES = [
  { id: 1, type: 'Duplex', label: 'For Rent', agent: 'Eng. Bright John', address: 'Plot 1, No 4 Abuja Street.', office: 'Estate Office', price: '₦2,500,000', occupants: '1', image: PROP_IMAGE },
  { id: 2, type: 'Duplex', label: 'For Rent', agent: '20+ Occupant',     address: 'Plot 1, No 4 Abuja Street.', office: 'Estate Office', price: '₦2,500,000', occupants: '20+', image: PROP_IMAGE },
  { id: 3, type: 'Duplex', label: 'For Rent', agent: 'Eng. Bright John', address: 'Plot 1, No 4 Abuja Street.', office: 'Estate Office', price: '₦2,500,000', occupants: '1', image: PROP_IMAGE },
  { id: 4, type: 'Duplex', label: 'For Rent', agent: 'Eng. Bright John', address: 'Plot 1, No 4 Abuja Street.', office: 'Estate Office', price: '₦2,500,000', occupants: '1', image: PROP_IMAGE },
  { id: 5, type: 'Duplex', label: 'For Rent', agent: 'Eng. Bright John', address: 'Plot 1, No 4 Abuja Street.', office: 'Estate Office', price: '₦2,500,000', occupants: '1', image: PROP_IMAGE },
  { id: 6, type: 'Duplex', label: 'For Rent', agent: '20+ Occupant',     address: 'Plot 1, No 4 Abuja Street.', office: 'Estate Office', price: '₦2,500,000', occupants: '20+', image: PROP_IMAGE },
  { id: 7, type: 'Duplex', label: 'For Rent', agent: 'Eng. Bright John', address: 'Plot 1, No 4 Abuja Street.', office: 'Estate Office', price: '₦2,500,000', occupants: '1', image: PROP_IMAGE },
  { id: 8, type: 'Duplex', label: 'For Rent', agent: 'Eng. Bright John', address: 'Plot 1, No 4 Abuja Street.', office: 'Estate Office', price: '₦2,500,000', occupants: '1', image: PROP_IMAGE },
];

const PROP_TABS = ['All', 'Recommended', 'BQ', 'Duplex', 'Bungalow', 'Apartment', 'Terrace', 'Commercial', 'Empty Plot', 'Flat'];

const StatusBadge = ({ status }) => {
  if (status === 'online')    return <span className="flex items-center gap-1.5 text-xs font-medium text-green-600"><span className="w-2 h-2 rounded-full bg-green-500" />Online</span>;
  if (status === 'last_8hr')  return <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500"><span className="w-2 h-2 rounded-full bg-gray-400" />Last 8 hr</span>;
  if (status === 'last_3min') return <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500"><span className="w-2 h-2 rounded-full bg-gray-400" />Last 3 min</span>;
  return null;
};

const PropertyMiniCard = ({ prop }) => (
  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <div className="relative h-32">
      <img src={prop.image} alt={prop.type} className="w-full h-full object-cover" />
      <span className="absolute top-2 left-2 bg-[#002C3D] text-white text-[10px] font-bold px-2 py-0.5 rounded">
        {prop.type}
      </span>
      <span className="absolute top-2 right-2 bg-white border border-gray-200 text-[10px] font-bold px-2 py-0.5 rounded text-gray-700">
        {prop.label}
      </span>
    </div>
    <div className="p-3 space-y-1">
      <p className="text-xs font-semibold text-gray-800 flex items-center gap-1">
        <BedDouble className="w-3 h-3 text-gray-400" /> {prop.agent}
      </p>
      <p className="text-xs text-gray-500 flex items-center gap-1">
        <MapPin className="w-3 h-3 flex-shrink-0" /> {prop.address}
      </p>
      <p className="text-xs text-gray-400">{prop.office}</p>
      <p className="text-xs font-bold text-[#002C3D]">{prop.price}<span className="font-normal text-gray-400"> per month</span></p>
    </div>
  </div>
);

const AgentDetail = ({ agent, onBack }) => {
  const [activePropTab, setActivePropTab] = useState('All');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Agent Details
        </button>
        <span className="flex items-center gap-1.5 text-sm font-semibold text-amber-500">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
          Active
        </span>
      </div>

      {/* Agent Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{agent.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Location: <span className="font-semibold text-gray-700">{agent.location}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Disable Account
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Delete Agent Account
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-8 gap-y-6">
          <div>
            <p className="text-xs text-gray-400 mb-1">Email Address</p>
            <p className="text-sm font-medium text-gray-800">{agent.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Phone Number</p>
            <p className="text-sm font-bold text-gray-900">{agent.phone}</p>
          </div>
          <div className="row-span-2 bg-gray-100 rounded-xl" />
          <div>
            <p className="text-xs text-gray-400 mb-1">Gender</p>
            <p className="text-sm font-medium text-gray-800">{agent.gender}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Date Joined</p>
            <p className="text-sm font-bold text-[#002C3D]">{agent.joined}</p>
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900 tracking-wide uppercase text-sm">Properties</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#002C3D] text-white text-sm font-semibold rounded-lg hover:bg-[#003F54] transition-colors">
            <Plus className="w-4 h-4" /> Add Property
          </button>
        </div>

        {/* Property type tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
          {PROP_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActivePropTab(tab)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0',
                activePropTab === tab
                  ? 'bg-[#002C3D] text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Properties grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {AGENT_PROPERTIES.map(prop => (
            <PropertyMiniCard key={prop.id} prop={prop} />
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminAgents = () => {
  const [search, setSearch]         = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [openMenu, setOpenMenu]     = useState(null);
  const [checked, setChecked]       = useState([]);

  const filtered = AGENTS.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedAgent) {
    return <AgentDetail agent={selectedAgent} onBack={() => setSelectedAgent(null)} />;
  }

  const toggleCheck = (id) =>
    setChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="space-y-6" onClick={() => openMenu && setOpenMenu(null)}>
      <div>
        <h1 className="text-xl font-bold text-gray-900">Agent Management</h1>
        <p className="text-sm text-gray-500 mt-0.5">{AGENTS.length} registered agents</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#002C3D]/20 focus:border-[#002C3D]/40"
            />
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            All Agents <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="border-b border-gray-100 bg-gray-50/50">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                {['Full Name', 'Email Address', 'Account Type', 'Joined', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={checked.includes(a.id)}
                      onChange={() => toggleCheck(a.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-800 whitespace-nowrap">{a.name}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">{a.email}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500 text-white">
                      Agent
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">{a.joined}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3.5 relative" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setOpenMenu(openMenu === a.id ? null : a.id)}
                      className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openMenu === a.id && (
                      <div className="absolute right-4 top-10 z-20 bg-white border border-gray-200 rounded-xl shadow-lg w-44 py-1 text-sm">
                        <button
                          onClick={() => { setSelectedAgent(a); setOpenMenu(null); }}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700 font-medium"
                        >
                          View Details
                        </button>
                        <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700">
                          Disable Account
                        </button>
                        <button className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600">
                          Delete Account
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAgents;

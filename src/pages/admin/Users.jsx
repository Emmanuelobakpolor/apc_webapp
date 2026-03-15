import React, { useState } from 'react';
import { Search, ChevronDown, MoreVertical, ArrowLeft } from 'lucide-react';
import { cn } from '../../utils/cn';

const TABS = [
  { label: 'All',    key: 'all',   count: 12 },
  { label: 'Users',  key: 'user',  count: 5  },
  { label: 'Agents', key: 'agent', count: 4  },
  { label: 'Owners', key: 'owner', count: 3  },
];

const ALL_USERS = [
  { id: 1,  name: 'John Olamide Oboyibo',  email: 'Johnolamideh@gmail.com',   type: 'user',  joined: '10 Nov 2025', status: 'online',    location: 'Lagos, Nigeria',         phone: '+234 8082428134', gender: 'Male'   },
  { id: 2,  name: 'Sarah Adebayo',          email: 'sarah.adebayo@gmail.com',   type: 'agent', joined: '10 Nov 2025', status: 'online',    location: 'Abuja, Nigeria',         phone: '+234 8082428135', gender: 'Female' },
  { id: 3,  name: 'Michael Okonjo',         email: 'michael.okonjo@gmail.com',  type: 'user',  joined: '10 Nov 2025', status: 'last_8hr',  location: 'Lagos, Nigeria',         phone: '+234 8082428136', gender: 'Male'   },
  { id: 4,  name: 'Funke Adeyemi',          email: 'funke.adeyemi@gmail.com',   type: 'owner', joined: '10 Nov 2025', status: 'online',    location: 'Lagos, Nigeria',         phone: '+234 8082428137', gender: 'Female' },
  { id: 5,  name: 'Damilola Sanni',         email: 'damilola.sanni@gmail.com',  type: 'agent', joined: '10 Nov 2025', status: 'last_3min', location: 'Port Harcourt, Nigeria', phone: '+234 8082428138', gender: 'Male'   },
  { id: 6,  name: 'Chinwe Okafor',          email: 'chinwe.okafor@gmail.com',   type: 'owner', joined: '10 Nov 2025', status: 'online',    location: 'Enugu, Nigeria',         phone: '+234 8082428139', gender: 'Female' },
  { id: 7,  name: 'Blessing Okonkwo',       email: 'blessing.okonkwo@gmail.com',type: 'user',  joined: '10 Nov 2025', status: 'online',    location: 'Lagos, Nigeria',         phone: '+234 8082428140', gender: 'Female' },
  { id: 8,  name: 'Adebayo Salami',         email: 'adebayo.salami@gmail.com',  type: 'agent', joined: '10 Nov 2025', status: 'online',    location: 'Lagos, Nigeria',         phone: '+234 8082428141', gender: 'Male'   },
  { id: 9,  name: 'Tolani Williams',         email: 'tolani.williams@gmail.com', type: 'owner', joined: '10 Nov 2025', status: 'online',    location: 'Lagos, Nigeria',         phone: '+234 8082428142', gender: 'Female' },
  { id: 10, name: 'David Okafor',           email: 'david.okafor@gmail.com',    type: 'user',  joined: '10 Nov 2025', status: 'online',    location: 'Ibadan, Nigeria',        phone: '+234 8082428143', gender: 'Male'   },
  { id: 11, name: 'Amaka Eze',              email: 'amaka.eze@gmail.com',       type: 'agent', joined: '10 Nov 2025', status: 'last_8hr',  location: 'Onitsha, Nigeria',       phone: '+234 8082428144', gender: 'Female' },
  { id: 12, name: 'Emeka Nwosu',            email: 'emeka.nwosu@gmail.com',     type: 'user',  joined: '10 Nov 2025', status: 'online',    location: 'Lagos, Nigeria',         phone: '+234 8082428145', gender: 'Male'   },
];

const typeBadge = (type) => {
  if (type === 'user')  return 'bg-[#002C3D] text-white';
  if (type === 'agent') return 'bg-gray-500 text-white';
  return 'border border-gray-300 text-gray-700 bg-white';
};

const typeLabel = (type) => {
  if (type === 'user')  return 'User';
  if (type === 'agent') return 'Agent';
  return 'Property Owner';
};

const StatusBadge = ({ status }) => {
  if (status === 'online')    return <span className="flex items-center gap-1.5 text-xs font-medium text-green-600"><span className="w-2 h-2 rounded-full bg-green-500" />Online</span>;
  if (status === 'last_8hr')  return <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500"><span className="w-2 h-2 rounded-full bg-gray-400" />Last 8 hr</span>;
  if (status === 'last_3min') return <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500"><span className="w-2 h-2 rounded-full bg-gray-400" />Last 3 min</span>;
  return null;
};

const UserDetail = ({ user, onBack }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        User Details
      </button>
      <span className="flex items-center gap-1.5 text-sm font-semibold text-amber-500">
        <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
        Active
      </span>
    </div>

    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Location: <span className="font-semibold text-gray-700">{user.location}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Disable Account
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Delete User Account
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
          <p className="text-sm font-bold text-gray-900">{user.phone}</p>
        </div>
        <div className="row-span-2 bg-gray-100 rounded-xl" />
        <div>
          <p className="text-xs text-gray-400 mb-1">Gender</p>
          <p className="text-sm font-medium text-gray-800">{user.gender}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Date Joined</p>
          <p className="text-sm font-bold text-[#002C3D]">{user.joined}</p>
        </div>
      </div>
    </div>
  </div>
);

const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch]       = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openMenu, setOpenMenu]   = useState(null);
  const [checked, setChecked]     = useState([]);

  const filtered = ALL_USERS.filter(u => {
    const matchTab    = activeTab === 'all' || u.type === activeTab;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  if (selectedUser) {
    return <UserDetail user={selectedUser} onBack={() => setSelectedUser(null)} />;
  }

  const toggleCheck = (id) =>
    setChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="space-y-6" onClick={() => openMenu && setOpenMenu(null)}>
      <div>
        <h1 className="text-xl font-bold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-500 mt-0.5">12 total accounts across all types</p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-3">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={cn(
              'py-4 px-5 rounded-xl border text-left transition-all',
              activeTab === t.key
                ? 'border-gray-300 bg-white shadow-sm'
                : 'border-gray-100 bg-gray-50 hover:bg-white'
            )}
          >
            <div className="text-2xl font-bold text-gray-900">{t.count}</div>
            <div className="text-xs text-gray-500 mt-0.5">{t.label}</div>
          </button>
        ))}
      </div>

      {/* Table card */}
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
            All User <ChevronDown className="w-4 h-4" />
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
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={checked.includes(u.id)}
                      onChange={() => toggleCheck(u.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-800 whitespace-nowrap">{u.name}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">{u.email}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn('px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap', typeBadge(u.type))}>
                      {typeLabel(u.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">{u.joined}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap"><StatusBadge status={u.status} /></td>
                  <td className="px-4 py-3.5 relative" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)}
                      className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openMenu === u.id && (
                      <div className="absolute right-4 top-10 z-20 bg-white border border-gray-200 rounded-xl shadow-lg w-44 py-1 text-sm">
                        <button
                          onClick={() => { setSelectedUser(u); setOpenMenu(null); }}
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

export default AdminUsers;

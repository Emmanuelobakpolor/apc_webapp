import React, { useState } from 'react';
import { Search, SlidersHorizontal, Plus, Mail, Phone, MoreHorizontal } from 'lucide-react';
import { cn } from '../../utils/cn';

const PALETTES = ['bg-violet-100 text-violet-700','bg-blue-100 text-blue-700','bg-emerald-100 text-emerald-700','bg-amber-100 text-amber-700','bg-rose-100 text-rose-700'];
const Avatar = ({ name }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return <div className={cn('w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold', PALETTES[name.charCodeAt(0) % PALETTES.length])}>{initials}</div>;
};

const users = [
  { id: 1, name: 'John Doe',       email: 'john@gmail.com',    phone: '+234 808 242 8134', property: 'Duplex - Plot 1, Abuja Street',    status: 'Active',  rent: '₦9,500,000' },
  { id: 2, name: 'Mary Doe',       email: 'mary@gmail.com',    phone: '+234 808 242 8135', property: 'Duplex - Plot 1, Abuja Street',    status: 'Active',  rent: '₦9,500,000' },
  { id: 3, name: 'John Statham',   email: 'jstatham@gmail.com',phone: '+234 808 242 8136', property: 'Apartment - Lekki Phase 1',        status: 'Pending', rent: '₦12,000,000' },
  { id: 4, name: 'Andrew Gita',    email: 'agita@gmail.com',   phone: '+234 808 242 8137', property: 'Bungalow - Victoria Island',       status: 'Active',  rent: '₦8,000,000' },
  { id: 5, name: 'Sarah Williams', email: 'sarah@gmail.com',   phone: '+234 808 242 8138', property: 'Duplex - Plot 1, Abuja Street',    status: 'Inactive',rent: '₦9,500,000' },
];

const Users = () => {
  const [search, setSearch] = useState('');
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-[1400px] mx-auto space-y-7 animate-in fade-in duration-700">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#002C3D] tracking-tight">Users / Tenants</h1>
          <p className="text-sm text-gray-400 mt-0.5">{users.length} registered tenants</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search tenants…" className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none shadow-card w-52" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-gray-100 rounded-xl text-sm font-semibold hover:bg-gray-50 shadow-card">
            <SlidersHorizontal className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-[#476D7C] text-white rounded-xl text-sm font-semibold hover:bg-[#5A8799] transition-all shadow-sm">
            <Plus className="w-4 h-4" /> Add Tenant
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-x-auto">
        <table className="w-full min-w-[700px] text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              {['Tenant', 'Contact', 'Property', 'Monthly Rent', 'Status', ''].map(h => (
                <th key={h} className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-gray-50/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} />
                    <span className="text-sm font-semibold text-gray-800">{u.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" />{u.email}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" />{u.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{u.property}</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-bold text-[#002C3D]">{u.rent}</span></td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn('px-2.5 py-1 rounded-lg text-[11px] font-bold border',
                    u.status === 'Active'   ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    u.status === 'Pending'  ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                             'bg-gray-100 text-gray-500 border-gray-200'
                  )}>{u.status}</span>
                </td>
                <td className="px-6 py-4">
                  <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;

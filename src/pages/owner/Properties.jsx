import React, { useState, useEffect } from 'react';
import {
  Search, SlidersHorizontal, Plus, Eye, Trash2, Upload,
  X, CheckCircle2, MapPin, AlertCircle, PencilLine,
  BedDouble, Bath, Maximize2, Tag, Calendar, BarChart2,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const API = 'https://apc-backend-vj85.onrender.com/api/properties';

const SELECT_ARROW = "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%234B5563%22%20stroke-width%3D%222%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1rem_1rem] bg-[right_0.75rem_center] bg-no-repeat";

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('access_token')}` });

const TYPE_LABELS = { apartment: 'Apartment', villa: 'Villa', duplex: 'Duplex', bungalow: 'Bungalow', studio: 'Studio', land: 'Land' };
const LIST_LABELS = { sale: 'For Sale', rent: 'For Rent', shortlet: 'Short-let' };
const FURN_LABELS = { fully: 'Fully Furnished', semi: 'Semi-Furnished', unfurnished: 'Unfurnished' };

const formatPrice = (p) => `₦${Number(p).toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;
const formatDate  = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const ImageBox = ({ label, tall, onChange, file, existingUrl }) => {
  const preview = file ? URL.createObjectURL(file) : existingUrl;
  return (
    <label className={cn(
      'relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer group overflow-hidden transition-all',
      preview ? 'border-gray-200' : 'border-gray-200 bg-gray-50 hover:bg-gray-100/60 hover:border-gray-300',
      tall ? 'p-0' : 'p-6'
    )}>
      {preview ? (
        <>
          <img src={preview} alt={label} className={cn('w-full object-cover rounded-xl', tall ? 'h-44' : 'h-28')} />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1 rounded-xl">
            <Upload className="w-5 h-5 text-white" />
            <span className="text-white text-xs font-semibold">Replace</span>
          </div>
        </>
      ) : (
        <>
          <div className={cn('rounded-xl bg-white flex items-center justify-center mb-3 shadow-card flex-shrink-0', tall ? 'w-11 h-11' : 'w-9 h-9')}>
            <Upload className={cn('text-gray-400 group-hover:text-[#476D7C] transition-colors', tall ? 'w-5 h-5' : 'w-4 h-4')} />
          </div>
          <p className="text-sm font-semibold text-gray-700">{label}</p>
          <p className="text-xs text-[#476D7C] font-medium mt-0.5">Click to browse</p>
          {tall && <p className="text-[11px] text-gray-400 mt-1">1600×1200 recommended · max 10 MB</p>}
        </>
      )}
      <input type="file" className="hidden" accept="image/*" onChange={onChange} />
    </label>
  );
};

const StepDot = ({ n, active, done }) => (
  <div className={cn(
    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 transition-all',
    done || active ? 'bg-[#476D7C] border-[#476D7C] text-white' : 'bg-white border-gray-200 text-gray-400'
  )}>
    {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : n}
  </div>
);

const EmptyState = ({ onAdd }) => (
  <tr><td colSpan={8}>
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#EEF5F8] flex items-center justify-center mb-4">
        <MapPin className="w-6 h-6 text-[#476D7C]" />
      </div>
      <p className="text-sm font-bold text-[#002C3D] mb-1">No properties listed yet</p>
      <p className="text-xs text-gray-400 mb-5">Click "Add Property" to add your first listing.</p>
      <button onClick={onAdd} className="flex items-center gap-2 px-5 py-2.5 bg-[#476D7C] text-white rounded-xl text-sm font-semibold hover:bg-[#5A8799] transition-all">
        <Plus className="w-4 h-4" /> Add Property
      </button>
    </div>
  </td></tr>
);

const DetailRow = ({ icon: Icon, label, value }) => value ? (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-[#EEF5F8] flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="w-3.5 h-3.5 text-[#476D7C]" />
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
    </div>
  </div>
) : null;

const PropertyFields = ({ form, set }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    <div className="md:col-span-2">
      <label className="label-text">Property Title</label>
      <input type="text" placeholder="e.g. Luxury 3-Bed Apartment in Lekki" className="input-field" value={form.title} onChange={set('title')} />
    </div>
    <div>
      <label className="label-text">Property Type</label>
      <select className={cn('input-field', SELECT_ARROW)} value={form.property_type} onChange={set('property_type')}>
        <option value="">Select Type</option>
        <option value="apartment">Apartment</option>
        <option value="villa">Villa</option>
        <option value="duplex">Duplex</option>
        <option value="bungalow">Bungalow</option>
        <option value="studio">Studio</option>
        <option value="land">Land</option>
      </select>
    </div>
    <div>
      <label className="label-text">Listing Type</label>
      <select className={cn('input-field', SELECT_ARROW)} value={form.listing_type} onChange={set('listing_type')}>
        <option value="">Select Type</option>
        <option value="sale">For Sale</option>
        <option value="rent">For Rent</option>
        <option value="shortlet">Short-let</option>
      </select>
    </div>
    <div>
      <label className="label-text">Property Address</label>
      <input type="text" placeholder="e.g. 12 Admiralty Way" className="input-field" value={form.address} onChange={set('address')} />
    </div>
    <div>
      <label className="label-text">City / State</label>
      <input type="text" placeholder="e.g. Lagos State" className="input-field" value={form.city_state} onChange={set('city_state')} />
    </div>
    <div>
      <label className="label-text">Price (₦)</label>
      <input type="number" placeholder="e.g. 45000000" className="input-field" value={form.price} onChange={set('price')} />
    </div>
    <div>
      <label className="label-text">Furnishing</label>
      <select className={cn('input-field', SELECT_ARROW)} value={form.furnishing} onChange={set('furnishing')}>
        <option value="">Select Type</option>
        <option value="fully">Fully Furnished</option>
        <option value="semi">Semi-Furnished</option>
        <option value="unfurnished">Unfurnished</option>
      </select>
    </div>
    <div>
      <label className="label-text">Bedrooms</label>
      <input type="number" placeholder="Number of bedrooms" className="input-field" value={form.bedrooms} onChange={set('bedrooms')} />
    </div>
    <div>
      <label className="label-text">Bathrooms</label>
      <input type="number" placeholder="Number of bathrooms" className="input-field" value={form.bathrooms} onChange={set('bathrooms')} />
    </div>
    <div>
      <label className="label-text">Total Size (sq m)</label>
      <input type="number" placeholder="e.g. 120" className="input-field" value={form.size_sqm} onChange={set('size_sqm')} />
    </div>
    <div className="md:col-span-2">
      <label className="label-text">Property Description</label>
      <textarea
        placeholder="Write a brief summary of the property — highlights, features, neighbourhood, etc."
        className="input-field resize-none"
        rows={4}
        value={form.description}
        onChange={set('description')}
      />
    </div>
  </div>
);

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', propertyType: '', listingType: '', location: '' });

  const [isAddOpen, setIsAddOpen]         = useState(false);
  const [addStep, setAddStep]             = useState(1);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [addError, setAddError]           = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const [editTarget, setEditTarget]     = useState(null);
  const [editStep, setEditStep]         = useState(1);
  const [isEditSaving, setIsEditSaving] = useState(false);
  const [editError, setEditError]       = useState('');

  const [viewTarget, setViewTarget] = useState(null);
  const [deleteId, setDeleteId]     = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const blankForm = { title: '', property_type: '', listing_type: '', address: '', city_state: '', bedrooms: '', bathrooms: '', size_sqm: '', furnishing: '', price: '', description: '', status: 'available' };
  const [form, setForm]             = useState(blankForm);
  const [frontImage, setFrontImage] = useState(null);
  const [sideImage, setSideImage]   = useState(null);
  const [backImage, setBackImage]   = useState(null);
  const [ownershipDoc, setOwnershipDoc] = useState(null);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.minPrice)     params.append('min_price',     filters.minPrice);
      if (filters.maxPrice)     params.append('max_price',     filters.maxPrice);
      if (filters.propertyType) params.append('property_type', filters.propertyType);
      if (filters.listingType)  params.append('listing_type',  filters.listingType);
      if (filters.location)     params.append('location',      filters.location);
      const res = await fetch(`${API}/?${params.toString()}`, { headers: authHeaders() });
      if (res.ok) setProperties(await res.json());
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProperties(); }, []);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const openAdd = () => {
    setForm(blankForm);
    setFrontImage(null); setSideImage(null); setBackImage(null); setOwnershipDoc(null);
    setAddError(''); setAddStep(1); setIsAddOpen(true);
  };

  const openEdit = (prop) => {
    setForm({
      title: prop.title, property_type: prop.property_type, listing_type: prop.listing_type,
      address: prop.address, city_state: prop.city_state, bedrooms: String(prop.bedrooms),
      bathrooms: String(prop.bathrooms), size_sqm: prop.size_sqm ? String(prop.size_sqm) : '',
      furnishing: prop.furnishing || '', price: String(prop.price),
      description: prop.description || '', status: prop.status || 'available',
    });
    setFrontImage(null); setSideImage(null); setBackImage(null); setOwnershipDoc(null);
    setEditError(''); setEditStep(1); setEditTarget(prop);
  };

  const buildFormData = (includeOwnership = false) => {
    const body = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v !== '') body.append(k, v); });
    if (frontImage)                       body.append('front_image',        frontImage);
    if (sideImage)                        body.append('side_image',         sideImage);
    if (backImage)                        body.append('back_image',         backImage);
    if (includeOwnership && ownershipDoc) body.append('ownership_document', ownershipDoc);
    return body;
  };

  const handleAddSubmit = async () => {
    setAddError(''); setIsSubmitting(true);
    try {
      const res = await fetch(`${API}/`, { method: 'POST', headers: authHeaders(), body: buildFormData(true) });
      const data = await res.json();
      if (!res.ok) { const f = Object.values(data)[0]; throw new Error(Array.isArray(f) ? f[0] : f); }
      setProperties((prev) => [data, ...prev]);
      setIsAddOpen(false); setIsSuccessOpen(true);
    } catch (err) { setAddError(err.message || 'Something went wrong.'); }
    finally { setIsSubmitting(false); }
  };

  const handleEditSubmit = async () => {
    setEditError(''); setIsEditSaving(true);
    try {
      const res = await fetch(`${API}/${editTarget.id}/update/`, { method: 'PATCH', headers: authHeaders(), body: buildFormData(true) });
      const data = await res.json();
      if (!res.ok) { const f = Object.values(data)[0]; throw new Error(Array.isArray(f) ? f[0] : f); }
      setProperties((prev) => prev.map((p) => p.id === data.id ? data : p));
      setEditTarget(null);
    } catch (err) { setEditError(err.message || 'Something went wrong.'); }
    finally { setIsEditSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API}/${deleteId}/delete/`, { method: 'DELETE', headers: authHeaders() });
      if (res.ok) { setProperties((prev) => prev.filter((p) => p.id !== deleteId)); setDeleteId(null); }
    } finally { setIsDeleting(false); }
  };

  const applyFilters = () => { fetchProperties(); setIsFilterOpen(false); };
  const resetFilters = () => {
    setFilters({ minPrice: '', maxPrice: '', propertyType: '', listingType: '', location: '' });
    fetchProperties();
    setIsFilterOpen(false);
  };

  const filtered = properties.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.city_state.toLowerCase().includes(search.toLowerCase())
  );

  const Spinner = () => <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />;

  return (
    <div className="max-w-[1400px] mx-auto space-y-7 animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#002C3D] tracking-tight">Properties</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {loading ? 'Loading...' : `${properties.length} listing${properties.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search properties…"
              className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-gray-200 transition-all shadow-card w-56" />
          </div>
          <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-gray-100 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all shadow-card">
            <SlidersHorizontal className="w-4 h-4" /> Filter
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2 bg-[#476D7C] text-white rounded-xl text-sm font-semibold hover:bg-[#5A8799] transition-all shadow-sm">
            <Plus className="w-4 h-4" /> Add Property
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsFilterOpen(false)} className="absolute right-6 top-6 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all z-10">
              <X className="w-4 h-4" />
            </button>
            <div className="p-8">
              <h2 className="text-xl font-bold text-[#002C3D] mb-1">Filter Properties</h2>
              <p className="text-sm text-gray-400 mb-7">Refine your property listings</p>
              <div className="space-y-6">
                <div>
                  <label className="label-text mb-3">Price Range (₦)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => setFilters(p => ({ ...p, minPrice: e.target.value }))} className="input-field" />
                    <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => setFilters(p => ({ ...p, maxPrice: e.target.value }))} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="label-text mb-3">Property Type</label>
                  <select value={filters.propertyType} onChange={(e) => setFilters(p => ({ ...p, propertyType: e.target.value }))} className={cn('input-field', SELECT_ARROW)}>
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="duplex">Duplex</option>
                    <option value="bungalow">Bungalow</option>
                    <option value="studio">Studio</option>
                    <option value="land">Land</option>
                  </select>
                </div>
                <div>
                  <label className="label-text mb-3">Listing Type</label>
                  <select value={filters.listingType} onChange={(e) => setFilters(p => ({ ...p, listingType: e.target.value }))} className={cn('input-field', SELECT_ARROW)}>
                    <option value="">All Types</option>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                    <option value="shortlet">Short-let</option>
                  </select>
                </div>
                <div>
                  <label className="label-text mb-3">Location</label>
                  <input type="text" placeholder="City, State, or Address" value={filters.location} onChange={(e) => setFilters(p => ({ ...p, location: e.target.value }))} className="input-field" />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={resetFilters} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">Reset</button>
                <button onClick={applyFilters} className="flex-[2] py-3 bg-[#476D7C] text-white rounded-xl text-sm font-bold hover:bg-[#5A8799] transition-all">Apply Filters</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-x-auto">
        <table className="w-full min-w-[900px] text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              {['Property', 'Location', 'Type', 'Price', 'Stats', 'Listed', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={8} className="px-6 py-16 text-center text-sm text-gray-400">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <EmptyState onAdd={openAdd} />
            ) : filtered.map((prop) => (
              <tr key={prop.id} className="hover:bg-gray-50/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {prop.front_image_url ? (
                      <img src={prop.front_image_url} alt={prop.title} className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-[#EEF5F8] flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-[#476D7C]" />
                      </div>
                    )}
                    <span className="text-sm font-semibold text-gray-800 max-w-[180px] truncate">{prop.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3 flex-shrink-0" />{prop.city_state}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-[11px] font-bold tracking-wide border border-blue-100">
                    {TYPE_LABELS[prop.property_type] || prop.property_type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-[#002C3D]">{formatPrice(prop.price)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{prop.views_count}</span>
                    <span className="flex items-center gap-1"><span className="text-gray-300">•</span>{prop.inquiries_count} inquiries</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">{formatDate(prop.created_at)}</td>
                <td className="px-6 py-4">
                  <span className={cn('px-2.5 py-1 rounded-lg text-[11px] font-bold border',
                    prop.status === 'available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100')}>
                    {prop.status === 'available' ? 'Available' : 'Sold'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => openEdit(prop)} title="Edit"
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#476D7C] hover:bg-[#EEF5F8] rounded-lg transition-all">
                      <PencilLine className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewTarget(prop)} title="View"
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#002C3D] hover:bg-[#EEF5F8] rounded-lg transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(prop.id)} title="Delete"
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsAddOpen(false)} className="absolute right-6 top-6 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all z-10">
              <X className="w-4 h-4" />
            </button>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <StepDot n={1} active={addStep >= 1} done={addStep > 1} />
                <span className={cn('text-xs font-bold uppercase tracking-widest', addStep >= 1 ? 'text-gray-800' : 'text-gray-400')}>Property Details</span>
                <div className="w-8 h-px bg-gray-200" />
                <StepDot n={2} active={addStep >= 2} done={false} />
                <span className={cn('text-xs font-bold uppercase tracking-widest', addStep >= 2 ? 'text-gray-800' : 'text-gray-400')}>Photos & Ownership</span>
              </div>
              <h2 className="text-xl font-bold text-[#002C3D] mb-1">{addStep === 1 ? 'Add Property' : 'Photos & Proof of Ownership'}</h2>
              <p className="text-sm text-gray-400 mb-7">Please ensure the property details are inputted correctly</p>

              {addStep === 1 ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <PropertyFields form={form} set={set} />
                  <button onClick={() => setAddStep(2)} className="w-full py-3 bg-[#476D7C] text-white rounded-xl text-sm font-bold hover:bg-[#5A8799] transition-all">
                    Next: Photos & Ownership
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <p className="label-text mb-3">Property Photos</p>
                    <ImageBox label="Upload front view photo" tall file={frontImage} onChange={(e) => setFrontImage(e.target.files[0] || null)} />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <ImageBox label="Side view photo" file={sideImage} onChange={(e) => setSideImage(e.target.files[0] || null)} />
                      <ImageBox label="Back view photo" file={backImage} onChange={(e) => setBackImage(e.target.files[0] || null)} />
                    </div>
                  </div>
                  <div>
                    <p className="label-text mb-3">Proof of Ownership</p>
                    <label className="border-2 border-dashed border-gray-200 rounded-xl flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100/60 hover:border-gray-300 cursor-pointer transition-all">
                      <div className="w-9 h-9 rounded-xl bg-white shadow-card flex items-center justify-center flex-shrink-0">
                        <Upload className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{ownershipDoc ? ownershipDoc.name : 'Upload ownership document'}</p>
                        <p className="text-xs text-[#476D7C] font-medium">PDF, JPG or PNG</p>
                      </div>
                      <input type="file" className="hidden" accept=".pdf,image/*" onChange={(e) => setOwnershipDoc(e.target.files[0] || null)} />
                    </label>
                  </div>
                  {addError && (
                    <div className="flex items-center gap-2.5 text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{addError}</span>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button onClick={() => setAddStep(1)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">Back</button>
                    <button onClick={handleAddSubmit} disabled={isSubmitting}
                      className="flex-[2] py-3 bg-[#476D7C] text-white rounded-xl text-sm font-bold hover:bg-[#5A8799] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {isSubmitting ? <><Spinner /> Uploading…</> : 'Upload Property'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {isSuccessOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm p-8 flex flex-col items-center text-center relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsSuccessOpen(false)} className="absolute right-5 top-5 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
              <X className="w-4 h-4" />
            </button>
            <div className="w-16 h-16 rounded-2xl bg-[#EEF5F8] flex items-center justify-center mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#476D7C] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#002C3D] mb-2">Property Added!</h3>
            <p className="text-sm text-gray-400 mb-7 leading-relaxed">Your property has been listed successfully.</p>
            <button onClick={() => { setIsSuccessOpen(false); openAdd(); }}
              className="w-full py-3 bg-[#476D7C] text-white rounded-xl text-sm font-bold hover:bg-[#5A8799] transition-all">
              Add Another Property
            </button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setEditTarget(null)} className="absolute right-6 top-6 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all z-10">
              <X className="w-4 h-4" />
            </button>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <StepDot n={1} active={editStep >= 1} done={editStep > 1} />
                <span className={cn('text-xs font-bold uppercase tracking-widest', editStep >= 1 ? 'text-gray-800' : 'text-gray-400')}>Property Details</span>
                <div className="w-8 h-px bg-gray-200" />
                <StepDot n={2} active={editStep >= 2} done={false} />
                <span className={cn('text-xs font-bold uppercase tracking-widest', editStep >= 2 ? 'text-gray-800' : 'text-gray-400')}>Photos & Ownership</span>
              </div>
              <h2 className="text-xl font-bold text-[#002C3D] mb-1">{editStep === 1 ? 'Edit Property' : 'Update Photos & Ownership'}</h2>
              <p className="text-sm text-gray-400 mb-7">Update the property details below</p>

              {editStep === 1 ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <PropertyFields form={form} set={set} />
                  <div>
                    <label className="label-text">Listing Status</label>
                    <div className="flex gap-3 mt-1">
                      <button type="button"
                        onClick={() => setForm((p) => ({ ...p, status: 'available' }))}
                        className={cn('flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all',
                          form.status === 'available'
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                            : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300')}>
                        Available
                      </button>
                      <button type="button"
                        onClick={() => setForm((p) => ({ ...p, status: 'sold' }))}
                        className={cn('flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all',
                          form.status === 'sold'
                            ? 'bg-red-50 border-red-400 text-red-700'
                            : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300')}>
                        Sold
                      </button>
                    </div>
                  </div>
                  <button onClick={() => setEditStep(2)} className="w-full py-3 bg-[#476D7C] text-white rounded-xl text-sm font-bold hover:bg-[#5A8799] transition-all">
                    Next: Photos & Ownership
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <p className="label-text mb-3">Property Photos <span className="text-gray-400 font-normal normal-case">(click a photo to replace it)</span></p>
                    <ImageBox label="Front view photo" tall file={frontImage} existingUrl={editTarget.front_image_url} onChange={(e) => setFrontImage(e.target.files[0] || null)} />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <ImageBox label="Side view photo" file={sideImage} existingUrl={editTarget.side_image_url} onChange={(e) => setSideImage(e.target.files[0] || null)} />
                      <ImageBox label="Back view photo" file={backImage} existingUrl={editTarget.back_image_url} onChange={(e) => setBackImage(e.target.files[0] || null)} />
                    </div>
                  </div>
                  <div>
                    <p className="label-text mb-3">Proof of Ownership <span className="text-gray-400 font-normal normal-case">(optional — only upload to replace)</span></p>
                    <label className="border-2 border-dashed border-gray-200 rounded-xl flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100/60 hover:border-gray-300 cursor-pointer transition-all">
                      <div className="w-9 h-9 rounded-xl bg-white shadow-card flex items-center justify-center flex-shrink-0">
                        <Upload className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          {ownershipDoc ? ownershipDoc.name : editTarget.ownership_document ? 'Document uploaded — click to replace' : 'Upload ownership document'}
                        </p>
                        <p className="text-xs text-[#476D7C] font-medium">PDF, JPG or PNG</p>
                      </div>
                      <input type="file" className="hidden" accept=".pdf,image/*" onChange={(e) => setOwnershipDoc(e.target.files[0] || null)} />
                    </label>
                  </div>
                  {editError && (
                    <div className="flex items-center gap-2.5 text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{editError}</span>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button onClick={() => setEditStep(1)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">Back</button>
                    <button onClick={handleEditSubmit} disabled={isEditSaving}
                      className="flex-[2] py-3 bg-[#476D7C] text-white rounded-xl text-sm font-bold hover:bg-[#5A8799] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {isEditSaving ? <><Spinner /> Saving…</> : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setViewTarget(null)} className="absolute right-5 top-5 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all z-10">
              <X className="w-4 h-4" />
            </button>
            {viewTarget.front_image_url ? (
              <div className="relative h-56 overflow-hidden rounded-t-2xl">
                <img src={viewTarget.front_image_url} alt={viewTarget.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-6 right-16">
                  <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full border mb-2 inline-block',
                    viewTarget.status === 'available' ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-red-500/90 text-white border-red-400')}>
                    {viewTarget.status === 'available' ? 'Available' : 'Sold'}
                  </span>
                  <h2 className="text-white text-lg font-bold leading-snug">{viewTarget.title}</h2>
                  <p className="text-white/70 text-xs flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{viewTarget.address}, {viewTarget.city_state}</p>
                </div>
              </div>
            ) : (
              <div className="h-24 bg-[#EEF5F8] rounded-t-2xl flex items-end p-6">
                <div>
                  <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full border mb-2 inline-block',
                    viewTarget.status === 'available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100')}>
                    {viewTarget.status === 'available' ? 'Available' : 'Sold'}
                  </span>
                  <h2 className="text-[#002C3D] text-lg font-bold">{viewTarget.title}</h2>
                  <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{viewTarget.address}, {viewTarget.city_state}</p>
                </div>
              </div>
            )}
            <div className="p-6 space-y-6">
              <div className="bg-[#EEF5F8] rounded-xl px-5 py-4">
                <p className="text-[10px] font-bold text-[#476D7C] uppercase tracking-wider mb-1">Asking Price</p>
                <p className="text-2xl font-bold text-[#002C3D]">{formatPrice(viewTarget.price)}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <DetailRow icon={Tag}       label="Type"      value={TYPE_LABELS[viewTarget.property_type] || viewTarget.property_type} />
                <DetailRow icon={Tag}       label="Listing"   value={LIST_LABELS[viewTarget.listing_type]  || viewTarget.listing_type} />
                <DetailRow icon={Tag}       label="Furnishing" value={FURN_LABELS[viewTarget.furnishing]   || viewTarget.furnishing} />
                <DetailRow icon={BedDouble} label="Bedrooms"  value={viewTarget.bedrooms ? `${viewTarget.bedrooms} Bed${viewTarget.bedrooms > 1 ? 's' : ''}` : null} />
                <DetailRow icon={Bath}      label="Bathrooms" value={viewTarget.bathrooms ? `${viewTarget.bathrooms} Bath${viewTarget.bathrooms > 1 ? 's' : ''}` : null} />
                <DetailRow icon={Maximize2} label="Size"      value={viewTarget.size_sqm ? `${viewTarget.size_sqm} sq m` : null} />
                <DetailRow icon={Calendar}  label="Listed"    value={formatDate(viewTarget.created_at)} />
                <DetailRow icon={Eye}       label="Views"     value={String(viewTarget.views_count)} />
                <DetailRow icon={BarChart2} label="Inquiries" value={String(viewTarget.inquiries_count)} />
              </div>

              {viewTarget.description && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{viewTarget.description}</p>
                </div>
              )}

              {(viewTarget.side_image_url || viewTarget.back_image_url) && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">More Photos</p>
                  <div className="grid grid-cols-2 gap-3">
                    {viewTarget.side_image_url && (
                      <div>
                        <img src={viewTarget.side_image_url} alt="Side view" className="w-full h-32 object-cover rounded-xl" />
                        <p className="text-[10px] text-gray-400 font-medium mt-1.5 text-center">Side View</p>
                      </div>
                    )}
                    {viewTarget.back_image_url && (
                      <div>
                        <img src={viewTarget.back_image_url} alt="Back view" className="w-full h-32 object-cover rounded-xl" />
                        <p className="text-[10px] text-gray-400 font-medium mt-1.5 text-center">Back View</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setViewTarget(null); openEdit(viewTarget); }}
                  className="flex-1 py-3 bg-[#476D7C] text-white rounded-xl text-sm font-bold hover:bg-[#5A8799] transition-all flex items-center justify-center gap-2">
                  <PencilLine className="w-4 h-4" /> Edit Property
                </button>
                <button onClick={() => { setViewTarget(null); setDeleteId(viewTarget.id); }}
                  className="py-3 px-5 border border-red-100 text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 transition-all flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm p-8 flex flex-col items-center text-center relative animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-2">Delete Property?</h3>
            <p className="text-sm text-gray-400 mb-7 leading-relaxed">This will permanently remove the listing. This cannot be undone.</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">Cancel</button>
              <button onClick={handleDelete} disabled={isDeleting}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {isDeleting ? <Spinner /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;

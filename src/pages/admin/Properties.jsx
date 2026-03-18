import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, X, ChevronLeft, ChevronRight, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

const PROP_API = 'https://apc-backend-vj85.onrender.com/api/properties';
const ITEMS_PER_PAGE = 6;

const adminFetch = (url, opts = {}) =>
  fetch(url, {
    ...opts,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      'Content-Type': 'application/json',
      ...opts.headers,
    },
  });

const PropertyDetailsModal = ({ property, onClose }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative">
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Property Details</h2>
        <button onClick={onClose}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
        {property.front_image_url && (
          <img src={property.front_image_url} alt={property.title}
            className="w-full h-48 object-cover rounded-xl" />
        )}
        <h3 className="text-xl font-bold text-gray-900">{property.title}</h3>

        <div className="space-y-3">
          {[
            { label: 'Price',        value: `₦${Number(property.price).toLocaleString()}` },
            { label: 'Type',         value: property.property_type },
            { label: 'Listing',      value: property.listing_type },
            { label: 'Location',     value: property.city_state || property.address },
            { label: 'Status',       value: property.status },
            { label: 'Listed By',    value: property.agent_name || '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start gap-4">
              <span className="w-28 text-sm text-gray-400 flex-shrink-0">{label}</span>
              <span className="text-sm font-bold text-gray-900 capitalize">{value}</span>
            </div>
          ))}
        </div>

        {property.description && (
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-2">Description</h4>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 leading-relaxed">
              {property.description}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const PropertyCard = ({ property, onView, onDelete, deleting }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
    <div className="relative h-48 overflow-hidden bg-gray-100">
      {property.front_image_url ? (
        <img src={property.front_image_url} alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
      )}
      <span className="absolute top-3 left-3 bg-[#002C3D]/80 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full capitalize">
        {property.property_type}
      </span>
      <span className="absolute top-3 right-3 bg-white/90 text-[11px] font-bold px-3 py-1 rounded-full text-gray-700 capitalize">
        {property.listing_type}
      </span>
      <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
        ₦{Number(property.price).toLocaleString()}
      </span>
    </div>

    <div className="p-4">
      <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-1">{property.title}</h3>
      <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
        <MapPin className="w-3 h-3 flex-shrink-0" /> {property.city_state || property.address}
      </p>
      {property.agent_name && (
        <p className="text-xs text-gray-400 mb-3">By {property.agent_name}</p>
      )}

      <div className="flex items-center gap-2 mt-3">
        <button onClick={() => onView(property)}
          className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <Eye className="w-4 h-4" /> View
        </button>
        <button onClick={() => onDelete(property)} disabled={deleting === property.id}
          className="w-10 h-9 flex items-center justify-center border border-red-100 rounded-lg text-red-500 hover:bg-red-50 transition-colors flex-shrink-0 disabled:opacity-40">
          {deleting === property.id
            ? <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
            : <Trash2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  </div>
);

const AdminProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentPage, setCurrentPage]       = useState(1);
  const [deleting, setDeleting]             = useState(null);

  const loadProperties = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    adminFetch(`${PROP_API}/admin/all/?${params}`)
      .then((r) => {
        if (r.status === 401 || r.status === 403) { navigate('/admin/login'); return null; }
        return r.json();
      })
      .then((data) => { if (data) setProperties(Array.isArray(data) ? data : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, navigate]);

  useEffect(() => { loadProperties(); }, [loadProperties]);

  const handleDelete = async (property) => {
    if (!window.confirm(`Delete "${property.title}"? This cannot be undone.`)) return;
    setDeleting(property.id);
    try {
      const r = await adminFetch(`${PROP_API}/admin/${property.id}/delete/`, { method: 'DELETE' });
      if (r.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== property.id));
        if (selectedProperty?.id === property.id) setSelectedProperty(null);
      }
    } finally {
      setDeleting(null);
    }
  };

  const totalPages = Math.ceil(properties.length / ITEMS_PER_PAGE);
  const paginated  = properties.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Listed Properties</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading ? 'Loading...' : `${properties.length} listed properties`}
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search property"
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#002C3D]/20 w-52" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : paginated.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginated.map((p) => (
            <PropertyCard key={p.id} property={p}
              onView={setSelectedProperty}
              onDelete={handleDelete}
              deleting={deleting} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-sm">No properties found.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-500">
            Showing <span className="font-semibold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
            <span className="font-semibold">{Math.min(currentPage * ITEMS_PER_PAGE, properties.length)}</span> of{' '}
            <span className="font-semibold">{properties.length}</span> results
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)}
                className={cn(
                  'w-8 h-8 flex items-center justify-center border rounded-lg text-sm font-medium transition-colors',
                  currentPage === page
                    ? 'bg-[#002C3D] text-white border-[#002C3D]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                )}>
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)} />
      )}
    </div>
  );
};

export default AdminProperties;

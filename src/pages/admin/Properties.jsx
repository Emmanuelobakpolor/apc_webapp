import React, { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, BedDouble, Maximize, X, ChevronLeft, ChevronRight, Trash2, Eye } from 'lucide-react';
import { cn } from '../../utils/cn';

const PROPERTIES = [
  {
    id: 1,
    title: 'Luxury 3-Bed Apartments in Lekki',
    type: 'Apartment',
    location: 'Lekki Phase 1, Lagos',
    beds: 6,
    sqft: '714m²',
    price: '₦2,500,000',
    fullPrice: 'N45.0M',
    bathrooms: 2,
    description: 'A stunning 3-bedroom apartment in the heart of Lekki Phase 1. Features modern finishes, spacious living areas, and world-class amenities including a rooftop pool and fully equiped gym.',
    amenities: ['Pool', 'GYM', 'Parking', 'Security', 'Elevator'],
    listedBy: 'Adebayo Salami',
    phone: '+2348082428134',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 2,
    title: 'Luxury 3-Bed Apartments in Lekki',
    type: 'Apartment',
    location: 'Lekki Phase 1, Lagos',
    beds: 6,
    sqft: '714m²',
    price: '₦2,500,000',
    fullPrice: 'N45.0M',
    bathrooms: 2,
    description: 'A stunning 3-bedroom apartment in the heart of Lekki Phase 1. Features modern finishes, spacious living areas, and world-class amenities including a rooftop pool and fully equiped gym.',
    amenities: ['Pool', 'GYM', 'Parking', 'Security'],
    listedBy: 'Adebayo Salami',
    phone: '+2348082428134',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 3,
    title: 'Luxury 3-Bed Apartments in Lekki',
    type: 'Apartment',
    location: 'Lekki Phase 1, Lagos',
    beds: 6,
    sqft: '714m²',
    price: '₦2,500,000',
    fullPrice: 'N38.0M',
    bathrooms: 3,
    description: 'Modern apartment with stunning city views. Perfect for professionals looking for comfort and convenience.',
    amenities: ['Pool', 'Parking', 'Security', 'Elevator'],
    listedBy: 'Chinwe Okafor',
    phone: '+2348082428139',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 4,
    title: 'Luxury 3-Bed Apartments in Lekki',
    type: 'Apartment',
    location: 'Lekki Phase 1, Lagos',
    beds: 6,
    sqft: '714m²',
    price: '₦2,500,000',
    fullPrice: 'N42.0M',
    bathrooms: 2,
    description: 'Elegantly designed apartment in a serene neighborhood with 24/7 security and modern facilities.',
    amenities: ['GYM', 'Parking', 'Security'],
    listedBy: 'Sarah Adebayo',
    phone: '+2348082428135',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 5,
    title: 'Luxury 3-Bed Apartments in Lekki',
    type: 'Apartment',
    location: 'Lekki Phase 1, Lagos',
    beds: 6,
    sqft: '714m²',
    price: '₦2,500,000',
    fullPrice: 'N50.0M',
    bathrooms: 3,
    description: 'Premium waterfront apartment with panoramic ocean views and top-notch amenities.',
    amenities: ['Pool', 'GYM', 'Parking', 'Security', 'Elevator'],
    listedBy: 'Adebayo Salami',
    phone: '+2348082428141',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 6,
    title: 'Luxury 3-Bed Apartments in Lekki',
    type: 'Apartment',
    location: 'Lekki Phase 1, Lagos',
    beds: 6,
    sqft: '714m²',
    price: '₦2,500,000',
    fullPrice: 'N35.0M',
    bathrooms: 2,
    description: 'Cozy yet luxurious apartment in prime Lekki location. Close to schools, shopping centers, and hospitals.',
    amenities: ['Parking', 'Security'],
    listedBy: 'Damilola Sanni',
    phone: '+2348082428138',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
  },
];

const ITEMS_PER_PAGE = 6;

const PropertyDetailsModal = ({ property, onClose }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative">
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Property Details</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-900">{property.title}</h3>

        <div className="space-y-3">
          {[
            { label: 'Price',     value: property.fullPrice },
            { label: 'Type',      value: property.type },
            { label: 'Location',  value: property.location },
            { label: 'Bedroom',   value: property.beds },
            { label: 'Bathrooms', value: property.bathrooms },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-4">
              <span className="w-28 text-sm text-gray-400">{label}</span>
              <span className="text-sm font-bold text-gray-900">{value}</span>
            </div>
          ))}
        </div>

        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-2">Description</h4>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 leading-relaxed">
            {property.description}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-2">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {property.amenities.map(a => (
              <span key={a} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700">
                {a}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-2">Listed By</h4>
          <p className="text-sm font-semibold text-gray-800">{property.listedBy}</p>
          <p className="text-sm text-gray-500">{property.phone}</p>
        </div>
      </div>
    </div>
  </div>
);

const PropertyCard = ({ property, onView, onDelete }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
    <div className="relative h-48 overflow-hidden">
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span className="absolute top-3 left-3 bg-[#002C3D]/80 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full">
        {property.type}
      </span>
      <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
        {property.price}
      </span>
    </div>

    <div className="p-4">
      <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-1">{property.title}</h3>
      <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
        <MapPin className="w-3 h-3 flex-shrink-0" /> {property.location}
      </p>
      <div className="flex items-center gap-3 text-xs text-gray-400 font-medium mb-4">
        <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" />{property.beds} bedrooms</span>
        <span className="flex items-center gap-1"><Maximize className="w-3 h-3" />{property.sqft}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onView(property)}
          className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Eye className="w-4 h-4" /> View
        </button>
        <button
          onClick={() => onDelete(property.id)}
          className="w-10 h-9 flex items-center justify-center border border-red-100 rounded-lg text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

const AdminProperties = () => {
  const [search, setSearch]               = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties]       = useState(PROPERTIES);
  const [currentPage, setCurrentPage]     = useState(1);

  const filtered = properties.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setProperties(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Listed Properties</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} listed properties</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search property"
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#002C3D]/20 w-52"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Grid */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginated.map(p => (
            <PropertyCard
              key={p.id}
              property={p}
              onView={setSelectedProperty}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-sm">No properties found matching your search.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-500">
            Showing <span className="font-semibold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
            <span className="font-semibold">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of{' '}
            <span className="font-semibold">{filtered.length}</span> results
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  'w-8 h-8 flex items-center justify-center border rounded-lg text-sm font-medium transition-colors',
                  currentPage === page
                    ? 'bg-[#002C3D] text-white border-[#002C3D]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                )}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Property Details Modal */}
      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

export default AdminProperties;

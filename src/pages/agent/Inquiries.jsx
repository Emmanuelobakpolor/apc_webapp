import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowLeft, Phone, MessageCircle, MessageSquare, ChevronRight, Trash2, Send } from 'lucide-react';
import { cn } from '../../utils/cn';

const PROP_API = 'https://apc-backend-vj85.onrender.com/api/properties';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('access_token')}` });
const ACCENT = '#002C3D';

const PALETTES = [
  'bg-violet-100 text-violet-700',
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
];

const Avatar = ({ name, large }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const color = PALETTES[name.charCodeAt(0) % PALETTES.length];
  return (
    <div className={cn('rounded-full flex-shrink-0 flex items-center justify-center font-bold', large ? 'w-12 h-12 text-base' : 'w-10 h-10 text-sm', color)}>
      {initials}
    </div>
  );
};

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso);
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const ROLE_LABELS = { buyer: 'Buyer', tenant: 'Tenant', investor: 'Investor', other: 'Other' };

const Inquiries = () => {
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetch(`${PROP_API}/inquiries/`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(data => setInquiries(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [replies]);

  const openInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setReplies([]);
    setReplyText('');
    setLoadingReplies(true);
    fetch(`${PROP_API}/inquiries/${inquiry.id}/replies/`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(data => setReplies(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoadingReplies(false));
  };

  const sendReply = async () => {
    if (!replyText.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`${PROP_API}/inquiries/${selectedInquiry.id}/replies/`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyText.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setReplies(prev => [...prev, data]);
        setReplyText('');
        setInquiries(prev => prev.map(i => i.id === selectedInquiry.id ? { ...i, is_read: true } : i));
        setSelectedInquiry(prev => prev ? { ...prev, is_read: true } : null);
      }
    } catch (_) {}
    setSending(false);
  };

  const deleteReply = async (replyId) => {
    await fetch(`${PROP_API}/inquiries/${selectedInquiry.id}/replies/${replyId}/`, {
      method: 'DELETE', headers: authHeaders(),
    });
    setReplies(prev => prev.filter(r => r.id !== replyId));
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm('Delete this entire inquiry and all messages? This cannot be undone.')) return;
    await fetch(`${PROP_API}/inquiries/${id}/delete/`, { method: 'DELETE', headers: authHeaders() });
    setInquiries(prev => prev.filter(i => i.id !== id));
    setSelectedInquiry(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) sendReply();
  };

  const TABS = [
    { key: 'all',     label: 'All'     },
    { key: 'new',     label: 'New'     },
    { key: 'replied', label: 'Replied' },
  ];

  const searchFiltered = inquiries.filter(i =>
    !search ||
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.property_title || '').toLowerCase().includes(search.toLowerCase())
  );

  const filtered = activeTab === 'all'
    ? searchFiltered
    : searchFiltered.filter(i => (activeTab === 'new') === !i.is_read);

  const newCount = inquiries.filter(i => !i.is_read).length;

  return (
    <div className="max-w-[1400px] mx-auto space-y-7 animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#002C3D] tracking-tight">Inquiries</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {newCount > 0 ? `${newCount} new inquir${newCount === 1 ? 'y' : 'ies'} waiting for a response` : 'All inquiries up to date'}
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search inquiries…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-200 transition-all shadow-card w-52"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {TABS.map(({ key, label }) => {
          const count = key === 'all' ? inquiries.length : inquiries.filter(i => (key === 'new') === !i.is_read).length;
          return (
            <button key={key} onClick={() => setActiveTab(key)}
              className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                activeTab === key ? 'bg-[#002C3D] text-white' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50 shadow-card')}>
              {label}
              <span className={cn('text-[11px] font-bold px-1.5 py-0.5 rounded-md',
                activeTab === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500')}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Inquiry List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 border-[3px] border-gray-200 border-t-[#002C3D] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MessageSquare className="w-8 h-8 text-gray-200 mb-3" />
            <p className="text-sm font-semibold text-gray-400">No inquiries yet</p>
            <p className="text-xs text-gray-300 mt-1">Inquiries from prospective buyers or tenants will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((inquiry) => (
              <div key={inquiry.id} onClick={() => openInquiry(inquiry)}
                className="flex items-center gap-4 px-6 py-5 hover:bg-gray-50/50 transition-colors cursor-pointer group">
                <Avatar name={inquiry.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-0.5">
                    <span className="text-sm font-bold text-gray-800">{inquiry.name}</span>
                    {!inquiry.is_read && (
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">New</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5 truncate">{inquiry.property_title}</p>
                  <p className="text-xs text-gray-400 truncate">{inquiry.email}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-[11px] text-gray-400 font-medium">{timeAgo(inquiry.created_at)}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#002C3D] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Panel Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden"
            style={{ height: 'min(680px, 90vh)' }}>

            {/* Modal Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <button onClick={() => setSelectedInquiry(null)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all flex-shrink-0">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <Avatar name={selectedInquiry.name} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-800 truncate">{selectedInquiry.name}</p>
                  {!selectedInquiry.is_read && (
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-full flex-shrink-0">New</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate mt-0.5">{selectedInquiry.property_title}</p>
              </div>
              <button onClick={() => deleteInquiry(selectedInquiry.id)}
                className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Contact Strip */}
            <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100 flex-shrink-0 flex-wrap">
              <a href={`tel:${selectedInquiry.phone}`}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-all">
                <Phone className="w-3 h-3" /> {selectedInquiry.phone}
              </a>
              <a href={`https://wa.me/${selectedInquiry.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-all">
                <MessageCircle className="w-3 h-3" /> WhatsApp
              </a>
              <a href={`mailto:${selectedInquiry.email}`}
                className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-all">
                <MessageSquare className="w-3 h-3" /> {selectedInquiry.email}
              </a>
              {selectedInquiry.role && (
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
                  {ROLE_LABELS[selectedInquiry.role] || selectedInquiry.role}
                </span>
              )}
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {loadingReplies ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-6 h-6 border-[3px] border-gray-200 border-t-[#002C3D] rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {/* Original inquiry message — always shown first */}
                  {selectedInquiry.message ? (
                    <div className="flex justify-start">
                      <div className="max-w-[78%] bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-800">
                        <p className="leading-relaxed">{selectedInquiry.message}</p>
                        <div className="flex items-center justify-between gap-3 mt-1.5">
                          <span className="text-[10px] text-gray-400 font-medium">{selectedInquiry.name}</span>
                          <span className="text-[10px] text-gray-400">{timeAgo(selectedInquiry.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Replies */}
                  {replies.length === 0 && !selectedInquiry.message && (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <MessageSquare className="w-7 h-7 text-gray-200 mb-2" />
                      <p className="text-sm text-gray-400 font-medium">No messages yet</p>
                      <p className="text-xs text-gray-300 mt-1">Start the conversation below.</p>
                    </div>
                  )}

                  {replies.map((reply) => {
                    const isOwn = reply.sender_name !== selectedInquiry.name;
                    return (
                      <div key={reply.id} className={cn('flex group', isOwn ? 'justify-end' : 'justify-start')}>
                        <div className="relative max-w-[78%]">
                          <div className={cn('rounded-2xl px-4 py-2.5 text-sm', isOwn
                            ? 'rounded-tr-sm text-white'
                            : 'rounded-tl-sm bg-gray-100 text-gray-800'
                          )} style={isOwn ? { backgroundColor: ACCENT } : {}}>
                            <p className="leading-relaxed">{reply.message}</p>
                            <div className="flex items-center justify-between gap-3 mt-1.5">
                              <span className={cn('text-[10px] font-medium', isOwn ? 'text-white/60' : 'text-gray-400')}>{reply.sender_name}</span>
                              <span className={cn('text-[10px]', isOwn ? 'text-white/50' : 'text-gray-400')}>{timeAgo(reply.created_at)}</span>
                            </div>
                          </div>
                          {isOwn && (
                            <button onClick={() => deleteReply(reply.id)}
                              className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Reply Input */}
            <div className="border-t border-gray-100 px-5 py-4 flex-shrink-0 flex gap-3 items-end">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a reply… (Ctrl+Enter to send)"
                rows={2}
                className="flex-1 resize-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-all"
              />
              <button
                onClick={sendReply}
                disabled={!replyText.trim() || sending}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                style={{ backgroundColor: ACCENT }}>
                {sending ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Inquiries;

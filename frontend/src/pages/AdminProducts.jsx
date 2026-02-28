import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWatches } from '../redux/slices/watchSlice.js';
import { axiosInstance } from '../../lib/axios.js';
import {
  Plus, Search, Edit3, Trash2, X, Check,
  Package, AlertTriangle, ChevronLeft, ChevronRight
} from 'lucide-react';

// ── FORM INITIAL STATE ───────────────────────────────────
const EMPTY_FORM = {
  title:           '',
  brand:           '',
  referenceNumber: '',
  price:           '',
  image:           '',
  condition:       'New',
  description:     '',
  quantity:        1,
  featured:        false,
  specs: {
    movement:  'Automatic',
    caseSize:  '',
    dialColor: '',
  },
};

// ── FIELD COMPONENT ──────────────────────────────────────
const Field = ({ label, children }) => (
  <div>
    <label className="block font-['JetBrains_Mono'] text-[8px] uppercase
                      tracking-[0.35em] text-[#958E62]/60 mb-2">
      {label}
    </label>
    {children}
  </div>
);

const inputCls = `w-full px-4 py-3 rounded-xl bg-[#111110] border border-white/8 text-white
                  font-['Playfair_Display'] italic text-sm placeholder:text-white/15
                  focus:outline-none focus:border-[#958E62]/40 transition-all`;

const selectCls = `w-full px-4 py-3 rounded-xl bg-[#111110] border border-white/8 text-white
                   font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest
                   focus:outline-none focus:border-[#958E62]/40 transition-all appearance-none`;

// ── WATCH FORM MODAL ─────────────────────────────────────
const WatchFormModal = ({ watch, onClose, onSaved }) => {
  const [form,    setForm]    = useState(watch ? {
    ...watch,
    specs: { movement: watch.specs?.movement || 'Automatic',
             caseSize: watch.specs?.caseSize || '',
             dialColor: watch.specs?.dialColor || '' },
  } : EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const set    = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setSpec = (key, val) => setForm((f) => ({ ...f, specs: { ...f.specs, [key]: val } }));

  const handleSubmit = async () => {
    setError('');
    if (!form.title || !form.brand || !form.price || !form.image || !form.description) {
      setError('Title, brand, price, image and description are required');
      return;
    }
    setLoading(true);
    try {
      if (watch) {
        await axiosInstance.put(`/watches/${watch._id}`, form);
      } else {
        await axiosInstance.post('/watches', form);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4
                    bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto
                      bg-[#0d0d0c] border border-[#958E62]/25 rounded-3xl
                      shadow-[0_32px_80px_rgba(0,0,0,0.8)]">

        {/* header */}
        <div className="sticky top-0 z-10 flex items-center justify-between
                        px-7 py-5 bg-[#0d0d0c] border-b border-white/5">
          <div>
            <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.4em] text-[#958E62]/60">
              {watch ? 'Edit Timepiece' : 'Add Timepiece'}
            </p>
            <h2 className="font-['Baskervville'] italic text-2xl text-white mt-0.5">
              {watch ? watch.title : 'New Acquisition'}
            </h2>
          </div>
          <button onClick={onClose}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center
                             text-white/40 hover:text-white hover:border-white/30 transition-all cursor-pointer">
            <X size={15} />
          </button>
        </div>

        <div className="px-7 py-6 space-y-5">

          {/* row: title + brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Title *">
              <input className={inputCls} value={form.title}
                     onChange={(e) => set('title', e.target.value)} placeholder="Rolex Datejust 36" />
            </Field>
            <Field label="Brand *">
              <input className={inputCls} value={form.brand}
                     onChange={(e) => set('brand', e.target.value)} placeholder="Rolex" />
            </Field>
          </div>

          {/* row: ref + price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Reference Number">
              <input className={inputCls} value={form.referenceNumber}
                     onChange={(e) => set('referenceNumber', e.target.value)} placeholder="126234" />
            </Field>
            <Field label="Price (USD) *">
              <input className={inputCls} type="number" min="0" value={form.price}
                     onChange={(e) => set('price', e.target.value)} placeholder="12500" />
            </Field>
          </div>

          {/* image */}
          <Field label="Image URL *">
            <input className={inputCls} value={form.image}
                   onChange={(e) => set('image', e.target.value)} placeholder="https://..." />
            {form.image && (
              <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border border-white/10">
                <img src={form.image} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </Field>

          {/* row: condition + quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Condition">
              <select className={selectCls} value={form.condition}
                      onChange={(e) => set('condition', e.target.value)}>
                {['New', 'Unworn', 'Pre-owned', 'Vintage'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Quantity">
              <input className={inputCls} type="number" min="0" value={form.quantity}
                     onChange={(e) => set('quantity', Number(e.target.value))} />
            </Field>
          </div>

          {/* specs row */}
          <div className="grid grid-cols-3 gap-4">
            <Field label="Movement">
              <select className={selectCls} value={form.specs.movement}
                      onChange={(e) => setSpec('movement', e.target.value)}>
                {['Automatic', 'Manual', 'Quartz'].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </Field>
            <Field label="Case Size">
              <input className={inputCls} value={form.specs.caseSize}
                     onChange={(e) => setSpec('caseSize', e.target.value)} placeholder="40mm" />
            </Field>
            <Field label="Dial Color">
              <input className={inputCls} value={form.specs.dialColor}
                     onChange={(e) => setSpec('dialColor', e.target.value)} placeholder="Blue" />
            </Field>
          </div>

          {/* description */}
          <Field label="Description *">
            <textarea
              className={`${inputCls} resize-none h-24`}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Horological description..."
            />
          </Field>

          {/* featured toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => set('featured', !form.featured)}
              className={`w-10 h-6 rounded-full transition-colors duration-300 cursor-pointer
                ${form.featured ? 'bg-[#958E62]' : 'bg-white/10'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white mx-1 transition-transform duration-300
                ${form.featured ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
            <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-white/40">
              Featured
            </span>
          </div>

          {error && (
            <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-widest text-red-400/70">
              {error}
            </p>
          )}

          {/* actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full
                         font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest font-bold
                         bg-[#958E62] text-[#0a0a09] border border-[#958E62]
                         hover:bg-[#C2B994] hover:border-[#C2B994]
                         hover:-translate-y-0.5 transition-all duration-300
                         cursor-pointer disabled:opacity-40"
            >
              <Check size={13} />
              {loading ? 'Saving...' : watch ? 'Save Changes' : 'Create Watch'}
            </button>
            <button onClick={onClose}
                    className="px-6 py-3.5 rounded-full font-['JetBrains_Mono'] text-[9px]
                               uppercase tracking-widest border border-white/10 text-white/40
                               hover:border-white/25 hover:text-white/70 transition-all cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── DELETE CONFIRM MODAL ─────────────────────────────────
const DeleteModal = ({ watch, onClose, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/watches/${watch._id}`);
      onDeleted();
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4
                    bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0d0d0c] border border-red-400/20
                      rounded-3xl p-8 shadow-[0_32px_80px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl border border-red-400/20 bg-red-400/5
                          flex items-center justify-center">
            <AlertTriangle size={16} className="text-red-400/60" />
          </div>
          <div>
            <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-widest text-red-400/50">
              Confirm Deletion
            </p>
            <h3 className="font-['Baskervville'] italic text-xl text-white">Delete Timepiece</h3>
          </div>
        </div>
        <p className="font-['Playfair_Display'] italic text-sm text-white/40 mb-6 leading-relaxed">
          Are you sure you want to permanently remove <span className="text-white/70">{watch.title}</span> from the registry? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-3 rounded-full font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest
                       bg-red-400/10 border border-red-400/25 text-red-400/70
                       hover:bg-red-400/20 hover:border-red-400/40
                       transition-all cursor-pointer disabled:opacity-40"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
          <button onClick={onClose}
                  className="flex-1 py-3 rounded-full font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest
                             border border-white/10 text-white/40 hover:border-white/25 hover:text-white/70
                             transition-all cursor-pointer">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ── ADMIN PRODUCTS PAGE ──────────────────────────────────
const AdminProducts = () => {
  const dispatch = useDispatch();
  const { watches, loading, pagination } = useSelector((state) => state.watches);

  const [search,      setSearch]      = useState('');
  const [page,        setPage]        = useState(1);
  const [showForm,    setShowForm]    = useState(false);
  const [editWatch,   setEditWatch]   = useState(null);
  const [deleteWatch, setDeleteWatch] = useState(null);

  const load = (p = 1, s = search) => {
    dispatch(fetchWatches({ page: p, limit: 12, search: s || undefined }));
  };

  useEffect(() => { load(1); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load(1, search);
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditWatch(null);
    load(page);
  };

  const handleDeleted = () => {
    setDeleteWatch(null);
    load(page);
  };

  const fmt = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 0 });

  return (
    <div className="bg-[#0a0a09] min-h-screen text-[#E7E7D9]
                    pt-24 md:pt-28 pb-20 px-4 md:px-10
                    selection:bg-[#958E62] selection:text-black">
      <div className="max-w-7xl mx-auto">

        {/* ── HEADER ── */}
        <div className="flex flex-wrap items-end justify-between gap-5 mb-8">
          <div>
            <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.5em] text-[#958E62] mb-2">
              Admin · Products
            </p>
            <h1 className="font-['Baskervville'] italic text-4xl md:text-5xl text-white">
              Registry
            </h1>
            {pagination?.total !== undefined && (
              <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.3em] text-white/20 mt-1">
                {pagination.total} timepiece{pagination.total !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <button
            onClick={() => { setEditWatch(null); setShowForm(true); }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full
                       font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest font-bold
                       bg-[#958E62] text-[#0a0a09] border border-[#958E62]
                       hover:bg-[#C2B994] hover:border-[#C2B994]
                       hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <Plus size={14} />
            Add Timepiece
          </button>
        </div>

        {/* ── SEARCH ── */}
        <form onSubmit={handleSearch} className="relative mb-6 max-w-md">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, brand, reference..."
            className="w-full pl-10 pr-4 py-3 rounded-full
                       bg-[#0d0d0c] border border-white/8 text-white
                       font-['Playfair_Display'] italic text-sm placeholder:text-white/20
                       focus:outline-none focus:border-[#958E62]/40 transition-all"
          />
        </form>

        {/* ── LOADING ── */}
        {loading && watches.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-8 h-8 border border-[#958E62]/20 border-t-[#958E62] rounded-full animate-spin" />
            <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.4em] text-[#958E62]/50">
              Loading Registry
            </p>
          </div>
        )}

        {/* ── TABLE ── */}
        {watches.length > 0 && (
          <div className="rounded-2xl border border-white/5 overflow-hidden">

            {/* table header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3
                            bg-[#0d0d0c] border-b border-white/5">
              {['Timepiece', 'Brand', 'Price', 'Stock', 'Status', ''].map((h) => (
                <p key={h} className="font-['JetBrains_Mono'] text-[7px] uppercase
                                      tracking-[0.35em] text-white/25">
                  {h}
                </p>
              ))}
            </div>

            {/* rows */}
            {watches.map((w) => (
              <div
                key={w._id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center
                           px-5 py-4 border-b border-white/4 last:border-0
                           bg-[#0a0a09] hover:bg-[#0d0d0c] transition-colors group"
              >
                {/* title + image */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0
                                  border border-white/5 bg-[#111110]">
                    <img src={w.image} alt={w.title}
                         className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-['Baskervville'] italic text-sm text-white truncate">
                      {w.title}
                    </p>
                    {w.referenceNumber && (
                      <p className="font-['JetBrains_Mono'] text-[7px] text-white/25 tracking-widest truncate">
                        {w.referenceNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* brand */}
                <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-[#958E62]/70 truncate">
                  {w.brand}
                </p>

                {/* price */}
                <p className="font-['Playfair_Display'] italic text-sm text-white/70">
                  ${fmt(w.price)}
                </p>

                {/* stock */}
                <p className={`font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest
                  ${w.quantity <= 3 ? 'text-amber-400/70' : 'text-white/40'}`}>
                  {w.quantity} {w.quantity <= 3 && w.quantity > 0 ? '⚠' : ''}
                  {w.quantity === 0 ? '— out' : ''}
                </p>

                {/* status badges */}
                <div className="flex flex-wrap gap-1.5">
                  {w.featured && (
                    <span className="px-2 py-0.5 rounded-full text-[7px] font-['JetBrains_Mono']
                                     uppercase tracking-widest bg-[#958E62]/10 border border-[#958E62]/25
                                     text-[#958E62]/70">
                      Featured
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-[7px] font-['JetBrains_Mono']
                                    uppercase tracking-widest border
                                    ${w.inStock
                                      ? 'bg-[#4ade80]/5 border-[#4ade80]/20 text-[#4ade80]/60'
                                      : 'bg-red-400/5 border-red-400/15 text-red-400/50'}`}>
                    {w.inStock ? 'In Stock' : 'Out'}
                  </span>
                </div>

                {/* actions */}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditWatch(w); setShowForm(true); }}
                    className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center
                               text-white/35 hover:text-[#958E62] hover:border-[#958E62]/30
                               transition-all cursor-pointer"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteWatch(w)}
                    className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center
                               text-white/35 hover:text-red-400/70 hover:border-red-400/25
                               transition-all cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── EMPTY ── */}
        {!loading && watches.length === 0 && (
          <div className="py-28 border border-white/5 rounded-3xl bg-[#0d0d0c]
                          flex flex-col items-center justify-center gap-5">
            <div className="w-14 h-14 rounded-full border border-white/5
                            flex items-center justify-center">
              <Package size={22} className="text-white/15" strokeWidth={1} />
            </div>
            <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.4em] text-white/20">
              No timepieces found
            </p>
            <button
              onClick={() => { setEditWatch(null); setShowForm(true); }}
              className="px-8 py-3.5 rounded-full font-['JetBrains_Mono'] text-[9px]
                         uppercase tracking-widest font-bold bg-[#958E62] text-[#0a0a09]
                         hover:bg-[#C2B994] transition-all cursor-pointer"
            >
              Add First Timepiece
            </button>
          </div>
        )}

        {/* ── PAGINATION ── */}
        {pagination?.pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              disabled={page === 1}
              onClick={() => { setPage(page - 1); load(page - 1); }}
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center
                         text-white/40 hover:border-[#958E62]/40 hover:text-[#958E62]
                         disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => { setPage(p); load(p); }}
                className={`w-9 h-9 rounded-full border font-['JetBrains_Mono'] text-[9px] transition-all cursor-pointer
                  ${page === p
                    ? 'bg-[#958E62] text-[#0a0a09] border-[#958E62]'
                    : 'border-white/10 text-white/40 hover:border-[#958E62]/40 hover:text-[#958E62]'
                  }`}
              >
                {p}
              </button>
            ))}

            <button
              disabled={page === pagination.pages}
              onClick={() => { setPage(page + 1); load(page + 1); }}
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center
                         text-white/40 hover:border-[#958E62]/40 hover:text-[#958E62]
                         disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}

      </div>

      {/* ── MODALS ── */}
      {showForm && (
        <WatchFormModal
          watch={editWatch}
          onClose={() => { setShowForm(false); setEditWatch(null); }}
          onSaved={handleSaved}
        />
      )}
      {deleteWatch && (
        <DeleteModal
          watch={deleteWatch}
          onClose={() => setDeleteWatch(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
};

export default AdminProducts;
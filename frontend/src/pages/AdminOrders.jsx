import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../redux/slices/adminSlice.js';
import { ChevronLeft, ChevronRight, X, Check, Package, Search, Filter } from 'lucide-react';

const ORDER_STATUSES = ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

// --- UTILS & STYLES ---
const statusColor = (s) => {
  const map = {
    processing: 'text-amber-400/70  border-amber-400/20  bg-amber-400/5',
    confirmed:  'text-blue-400/70   border-blue-400/20   bg-blue-400/5',
    shipped:    'text-sky-400/70    border-sky-400/20    bg-sky-400/5',
    delivered:  'text-[#4ade80]/70  border-[#4ade80]/20  bg-[#4ade80]/5',
    cancelled:  'text-red-400/50    border-red-400/15    bg-red-400/5',
  };
  return map[s] || 'text-white/40 border-white/10 bg-white/5';
};

const paymentColor = (s) => ({
  pending:  'text-amber-400/60',
  paid:     'text-[#4ade80]/60',
  failed:   'text-red-400/50',
  refunded: 'text-blue-400/60',
}[s] || 'text-white/30');

const selectCls = `w-full px-4 py-3 rounded-xl bg-[#111110] border border-white/8 text-white
                   font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest
                   focus:outline-none focus:border-[#958E62]/40 transition-all appearance-none cursor-pointer`;

const inputCls = `w-full px-4 py-3 rounded-xl bg-[#111110] border border-white/8 text-white
                  font-['Playfair_Display'] italic text-sm placeholder:text-white/15
                  focus:outline-none focus:border-[#958E62]/40 transition-all`;

// --- SHARED COMPONENTS ---
const FilterBtn = ({ label, active, onClick }) => (
  <button onClick={onClick}
    className={`px-4 py-1.5 rounded-full font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] border transition-all duration-300 cursor-pointer
      ${active ? 'bg-[#958E62] text-[#0a0a09] border-[#958E62] shadow-[0_0_20px_rgba(149,142,98,0.2)]' : 'border-white/10 text-white/35 hover:border-[#958E62]/30 hover:text-[#958E62]/70'}`}>
    {label}
  </button>
);

const FieldLabel = ({ label, children }) => (
  <div>
    <label className="block font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.35em] text-[#958E62]/60 mb-2">
      {label}
    </label>
    {children}
  </div>
);

// --- MODAL COMPONENT ---
const UpdateOrderModal = ({ order, onClose, onUpdated }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.admin);
  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [estimatedDelivery, setEstimatedDelivery] = useState(
    order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString().split('T')[0] : ''
  );
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    const res = await dispatch(updateOrderStatus({
      orderId: order._id,
      orderStatus,
      paymentStatus,
      trackingNumber: trackingNumber || undefined,
      estimatedDelivery: estimatedDelivery || undefined,
    }));
    if (res.meta.requestStatus === 'fulfilled') onUpdated();
    else setError(res.payload || 'Failed to update order');
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#0d0d0c] border border-[#958E62]/20 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
          <div>
            <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.4em] text-[#958E62]/60">Management</p>
            <h2 className="font-['Baskervville'] italic text-3xl text-white mt-1 uppercase">
              № {order._id.slice(-8)}
            </h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-white hover:border-white/20 transition-all">
            <X size={16} />
          </button>
        </div>
        <div className="px-8 py-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <FieldLabel label="Acquisition Status">
              <select className={selectCls} value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FieldLabel>
            <FieldLabel label="Ledger Status">
              <select className={selectCls} value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FieldLabel>
          </div>
          <FieldLabel label="Tracking Identifier">
            <input className={inputCls} value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Tracking ID" />
          </FieldLabel>
          <FieldLabel label="Projected Delivery">
            <input className={inputCls} type="date" value={estimatedDelivery} onChange={(e) => setEstimatedDelivery(e.target.value)} />
          </FieldLabel>
          {error && <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-red-400/80">{error}</p>}
          <div className="flex gap-4 pt-4">
            <button onClick={handleSubmit} disabled={loading}
                    className="flex-1 flex items-center justify-center gap-3 py-4 rounded-full font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest font-bold bg-[#958E62] text-[#0a0a09] hover:bg-white transition-all duration-500 disabled:opacity-20">
              <Check size={14} /> {loading ? 'Saving...' : 'Confirm Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const AdminOrders = () => {
  const dispatch = useDispatch();
  const { allOrders: orders, loading, pagination } = useSelector((s) => s.admin);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editOrder, setEditOrder] = useState(null);

  const load = (p = 1, sf = statusFilter, pf = paymentFilter) => {
    dispatch(fetchAllOrders({ page: p, limit: 15, status: sf || undefined, paymentStatus: pf || undefined }));
  };

  useEffect(() => { load(1); }, []);

  const handleUpdated = () => { setEditOrder(null); load(page); };
  const fmt = (n) => Number(n).toLocaleString('en-US');

  return (
    <div className="bg-[#0a0a09] min-h-screen text-[#E7E7D9] pt-28 pb-32 px-6 md:px-12 selection:bg-[#958E62] selection:text-black">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12 flex justify-between items-end">
          <div>
            <p className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.6em] text-[#958E62] mb-3">Master Control</p>
            <h1 className="font-['Baskervville'] italic text-5xl md:text-6xl text-white">Order Registry</h1>
          </div>
          <div className="text-right pb-2">
            <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.4em] text-white/20">
              Total Assets: {pagination?.total || 0}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-6 mb-12 p-8 rounded-3xl bg-[#0d0d0c] border border-white/5">
          <div className="flex items-center gap-6">
            <Filter size={14} className="text-[#958E62]/40" />
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-white/20 mr-4">Status</span>
              <FilterBtn label="All" active={!statusFilter} onClick={() => { setStatusFilter(''); setPage(1); load(1, '', paymentFilter); }} />
              {ORDER_STATUSES.map((s) => (
                <FilterBtn key={s} label={s} active={statusFilter === s} onClick={() => { setStatusFilter(s); setPage(1); load(1, s, paymentFilter); }} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6 pl-9.5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-white/20 mr-4">Payment</span>
              <FilterBtn label="All" active={!paymentFilter} onClick={() => { setPaymentFilter(''); setPage(1); load(1, statusFilter, ''); }} />
              {PAYMENT_STATUSES.map((s) => (
                <FilterBtn key={s} label={s} active={paymentFilter === s} onClick={() => { setPaymentFilter(s); setPage(1); load(1, statusFilter, s); }} />
              ))}
            </div>
          </div>
        </div>

        {/* List */}
        {loading && orders.length === 0 ? (
          <div className="py-40 flex flex-col items-center justify-center gap-6">
            <div className="w-12 h-12 border-t-2 border-[#958E62] rounded-full animate-spin" />
            <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.5em] text-[#958E62]/60">Syncing Registry</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_1fr_auto] gap-6 px-8 py-5 bg-[#0d0d0c] border-b border-white/5">
              {['Reference', 'Client', 'Assets', 'Value', 'Status', 'Ledger', ''].map((h) => (
                <p key={h} className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.4em] text-white/20">{h}</p>
              ))}
            </div>
            {orders.map((order) => (
              <div key={order._id} className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_1fr_auto] gap-6 items-center px-8 py-6 border-b border-white/3 last:border-0 bg-[#0a0a09] hover:bg-white/2 transition-all duration-500 group">
                <div className="space-y-1">
                  <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest text-[#958E62]">№ {order._id.slice(-8).toUpperCase()}</p>
                  <p className="font-['Playfair_Display'] italic text-[11px] text-white/20">{new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                </div>
                <div>
                  <p className="font-['Baskervville'] italic text-base text-white/80">{order.user?.fullname || 'Unknown'}</p>
                  <p className="font-['JetBrains_Mono'] text-[9px] text-white/20 truncate">{order.user?.email}</p>
                </div>
                <div className="flex -space-x-3">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div key={i} className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-black group-hover:border-[#958E62]/40 transition-colors shadow-lg">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center font-['JetBrains_Mono'] text-[9px] text-white/40">+{order.items.length - 3}</div>
                  )}
                </div>
                <p className="font-['Playfair_Display'] italic text-lg text-[#DED5A4]">${fmt(order.totalAmount)}</p>
                <div>
                  <span className={`px-3 py-1.5 rounded-full border font-['JetBrains_Mono'] text-[8px] uppercase tracking-widest ${statusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <p className={`font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest ${paymentColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </p>
                <button onClick={() => setEditOrder(order)} className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-10 h-10 rounded-full border border-[#958E62]/20 text-[#958E62]/40 hover:bg-[#958E62] hover:text-black transition-all cursor-pointer">
                  <ExternalLink size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-40 border border-white/5 rounded-[3rem] bg-[#0d0d0c]/30 flex flex-col items-center justify-center gap-6">
            <Package size={40} className="text-white/10" strokeWidth={1} />
            <p className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.5em] text-white/20">The registry is currently empty</p>
          </div>
        )}

        {/* Pagination */}
        {pagination?.pages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-16">
            <button disabled={page === 1} onClick={() => { setPage(page - 1); load(page - 1); }}
                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-[#958E62] hover:text-[#958E62] disabled:opacity-10 transition-all cursor-pointer">
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => { setPage(p); load(p); }}
                        className={`w-12 h-12 rounded-full border font-['JetBrains_Mono'] text-[10px] transition-all cursor-pointer ${page === p ? 'bg-[#958E62] text-[#0a0a09] border-[#958E62]' : 'border-white/10 text-white/40 hover:border-[#958E62] hover:text-[#958E62]'}`}>
                  {p}
                </button>
              ))}
            </div>
            <button disabled={page === pagination.pages} onClick={() => { setPage(page + 1); load(page + 1); }}
                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-[#958E62] hover:text-[#958E62] disabled:opacity-10 transition-all cursor-pointer">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {editOrder && <UpdateOrderModal order={editOrder} onClose={() => setEditOrder(null)} onUpdated={handleUpdated} />}
    </div>
  );
};

// Help Lucide icons render properly
const ExternalLink = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export default AdminOrders;
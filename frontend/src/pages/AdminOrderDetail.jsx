import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminOrderById, clearError } from '../redux/slices/adminSlice.js';
import { ChevronLeft, MapPin, User, Package, Calendar, ExternalLink, Mail, Phone } from 'lucide-react';

const AdminOrderDetail = () => {
  const { id }     = useParams();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();

  // ✅ selectedOrder is set by fetchAdminOrderById.fulfilled in the slice
  const { selectedOrder: order, loading, error } = useSelector((s) => s.admin);

  useEffect(() => {
    if (id) dispatch(fetchAdminOrderById(id));
    return () => { dispatch(clearError()); };
  }, [id, dispatch]);

  // ✅ separate loading/error states so stale selectedOrder from previous visit doesn't flash
  if (loading) return (
    <div className="h-screen bg-[#0a0a09] flex items-center justify-center">
      <div className="w-12 h-12 border-t-2 border-[#958E62] rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="h-screen bg-[#0a0a09] flex flex-col items-center justify-center gap-6">
      <p className="font-['JetBrains_Mono'] text-xs text-red-400 uppercase tracking-widest">{error}</p>
      <Link to="/admin/orders"
            className="px-8 py-3 rounded-full border border-white/10 text-white/40 hover:text-[#958E62] transition-all font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest">
        Return to Registry
      </Link>
    </div>
  );

  // ✅ show not-found only when not loading and order is missing
  if (!order) return (
    <div className="h-screen bg-[#0a0a09] flex flex-col items-center justify-center gap-6">
      <p className="font-['JetBrains_Mono'] text-xs text-white/30 uppercase tracking-widest">Acquisition record not found</p>
      <Link to="/admin/orders"
            className="px-8 py-3 rounded-full border border-white/10 text-white/40 hover:text-[#958E62] transition-all font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest">
        Return to Registry
      </Link>
    </div>
  );

  const fmt = (n) => Number(n).toLocaleString('en-US');

  const statusStyle = {
    processing: 'border-amber-400/20  text-amber-400  bg-amber-400/5',
    confirmed:  'border-blue-400/20   text-blue-400   bg-blue-400/5',
    shipped:    'border-sky-400/20    text-sky-400    bg-sky-400/5',
    delivered:  'border-[#4ade80]/20  text-[#4ade80]  bg-[#4ade80]/5',
    cancelled:  'border-red-400/20    text-red-400    bg-red-400/5',
  };

  return (
    <div className="bg-[#0a0a09] min-h-screen text-[#E7E7D9] pt-28 pb-40 px-6 md:px-12 selection:bg-[#958E62] selection:text-black">
      <div className="max-w-6xl mx-auto">

        {/* NAV */}
        <button onClick={() => navigate(-1)}
                className="group flex items-center gap-3 text-white/20 hover:text-[#958E62] transition-colors font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.4em] mb-12">
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Registry
        </button>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 pb-12 border-b border-white/5">
          <div className="space-y-4">
            <p className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.6em] text-[#958E62]">Master Manifest</p>
            <h1 className="font-['Baskervville'] italic text-5xl md:text-6xl text-white">
              Entry № {order._id.slice(-8).toUpperCase()}
            </h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-white/30 font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest">
                <Calendar size={14} className="text-[#958E62]/40" />
                {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <p className="text-white/30 font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Digital Payment'}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <span className={`px-6 py-2 rounded-full border font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest shadow-xl
              ${statusStyle[order.orderStatus] || 'border-white/10 text-white/40 bg-white/5'}`}>
              {order.orderStatus}
            </span>
            <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-white/20">
              Payment: <span className="text-white/50">{order.paymentStatus}</span>
            </p>
            {order.trackingNumber && (
              <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-white/20">
                Tracking: <span className="text-[#958E62]/70">{order.trackingNumber}</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* LEFT */}
          <div className="lg:col-span-8 space-y-10">

            {/* ITEMS */}
            <section className="p-8 md:p-10 rounded-[2.5rem] bg-[#0d0d0c] border border-white/5">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                <Package size={20} className="text-[#958E62]/60" />
                <h2 className="font-['Baskervville'] italic text-2xl text-white">Registry Assets</h2>
                <span className="ml-auto font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-white/20">
                  {order.items.length} {order.items.length === 1 ? 'piece' : 'pieces'}
                </span>
              </div>
              <div className="space-y-8">
                {order.items.map((item, idx) => (
                  // ✅ use item.title/brand/image/price directly — these are snapshotted on order creation
                  // item.watch is the watch _id (not populated on this route), so we fall back to snapshot fields
                  <div key={idx} className="group flex gap-6 md:gap-8 items-center">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-3xl overflow-hidden border border-white/10 bg-black shrink-0 relative">
                      {item.image ? (
                        <img src={item.image} alt={item.title}
                             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={20} className="text-white/10" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 font-['JetBrains_Mono'] text-[9px] text-[#958E62]">
                        ×{item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.3em] text-[#958E62]/60">{item.brand}</p>
                      <h3 className="font-['Baskervville'] italic text-xl text-white truncate">{item.title}</h3>
                      {item.referenceNumber && (
                        <p className="font-['JetBrains_Mono'] text-[9px] text-white/20 uppercase tracking-widest">
                          Ref: {item.referenceNumber}
                        </p>
                      )}
                      <div className="flex items-baseline gap-4 pt-1">
                        <p className="font-['Playfair_Display'] italic text-lg text-[#DED5A4]">
                          ${Number(item.price || 0).toLocaleString()}
                        </p>
                        <p className="font-['JetBrains_Mono'] text-[9px] text-white/20 uppercase">
                          × {item.quantity} = ${Number((item.price || 0) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FINANCIALS */}
            <section className="p-8 md:p-10 rounded-[2.5rem] bg-[#0d0d0c] border border-white/5">
              <h2 className="font-['Baskervville'] italic text-2xl text-white mb-10">Financial Ledger</h2>
              <div className="space-y-5 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.4em]">
                <div className="flex justify-between text-white/25">
                  <span>Subtotal</span>
                  <span>${fmt(order.subtotal ?? order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-white/25">
                  <span>Shipping</span>
                  {/* ✅ read shippingCost from order schema */}
                  <span className={(order.shippingCost === 0) ? 'text-[#4ade80]/60 text-[9px]' : ''}>
                    {order.shippingCost === 0 ? 'Complimentary' : `$${fmt(order.shippingCost)}`}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-8 border-t border-white/5">
                  <span className="text-white/70">Total Value</span>
                  <span className="font-['Baskervville'] italic text-4xl text-[#DED5A4] normal-case tracking-normal">
                    ${fmt(order.totalAmount)}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4 space-y-8">

            {/* CLIENT */}
            <section className="p-8 rounded-[2.5rem] bg-[#0d0d0c] border border-white/5 space-y-6">
              <div className="flex items-center gap-3">
                <User size={18} strokeWidth={1.5} className="text-[#958E62]" />
                <h2 className="font-['Baskervville'] italic text-xl text-white">Client Dossier</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-['Baskervville'] italic text-lg text-[#958E62] shrink-0">
                  {/* ✅ guard fullname being undefined */}
                  {order.user?.fullname?.charAt(0) ?? '?'}
                </div>
                <div className="min-w-0">
                  <p className="font-['Playfair_Display'] italic text-base text-white truncate">
                    {order.user?.fullname || 'Unknown'}
                  </p>
                  <p className="font-['JetBrains_Mono'] text-[9px] text-white/25 uppercase tracking-widest">Client</p>
                </div>
              </div>
              <div className="space-y-4 pt-2 border-t border-white/5 font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest text-white/40">
                <div className="flex items-center gap-3">
                  <Mail size={14} className="text-[#958E62]/40 shrink-0" />
                  <span className="truncate lowercase">{order.user?.email || '—'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={14} className="text-[#958E62]/40 shrink-0" />
                  <span>{order.shippingAddress?.phone || 'Not provided'}</span>
                </div>
              </div>
            </section>

            {/* SHIPPING */}
            <section className="p-8 rounded-[2.5rem] bg-[#0d0d0c] border border-white/5 space-y-6">
              <div className="flex items-center gap-3">
                <MapPin size={18} strokeWidth={1.5} className="text-[#958E62]" />
                <h2 className="font-['Baskervville'] italic text-xl text-white">Destination</h2>
              </div>
              <div className="font-['Playfair_Display'] italic text-white/50 space-y-1 text-base leading-relaxed">
                <p className="text-white/80 not-italic font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest mb-3">Shipping Address</p>
                {/* ✅ guard each field individually */}
                {order.shippingAddress?.fullname    && <p>{order.shippingAddress.fullname}</p>}
                {order.shippingAddress?.addressLine1 && <p>{order.shippingAddress.addressLine1}</p>}
                {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>
                  {[order.shippingAddress?.city, order.shippingAddress?.state].filter(Boolean).join(', ')}
                </p>
                <p className="text-white/70">
                  {[order.shippingAddress?.postalCode, order.shippingAddress?.country].filter(Boolean).join(', ')}
                </p>
              </div>
            </section>

            {/* ESTIMATED DELIVERY */}
            {order.estimatedDelivery && (
              <section className="p-6 rounded-2xl bg-[#0d0d0c] border border-white/5">
                <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-white/25 mb-2">Est. Delivery</p>
                <p className="font-['Playfair_Display'] italic text-white/70">
                  {new Date(order.estimatedDelivery).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </section>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
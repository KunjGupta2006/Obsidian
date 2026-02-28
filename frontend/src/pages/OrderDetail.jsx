import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Package, MapPin, CreditCard, ChevronLeft, XCircle, Clock, CheckCircle, Truck, Star } from 'lucide-react';
import { fetchOrderById, cancelOrder } from '../redux/slices/orderSlice.js';
import { openCertificate } from "../utils/Certificate.js";

// ── STATUS TIMELINE CONFIG ───────────────────────────────
const STEPS = ['processing', 'confirmed', 'shipped', 'delivered'];

const STEP_META = {
  processing: { label: 'Processing',  icon: Clock,        desc: 'Order received & being prepared'   },
  confirmed:  { label: 'Confirmed',   icon: CheckCircle,  desc: 'Order confirmed by our team'       },
  shipped:    { label: 'Shipped',     icon: Truck,        desc: 'On its way to you'                 },
  delivered:  { label: 'Delivered',   icon: Star,         desc: 'Delivered to your address'         },
};

const StatusTimeline = ({ status }) => {
  const isCancelled   = status === 'cancelled';
  const currentIndex  = STEPS.indexOf(status);

  return (
    <div className="w-full">
      {isCancelled ? (
        <div className="flex items-center gap-3 px-5 py-4 rounded-xl
                        bg-red-400/5 border border-red-400/15">
          <XCircle size={16} className="text-red-400/60 
          shrink-0" />
          <div>
            <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.25em] text-red-400/60">
              Order Cancelled
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-0">
          {STEPS.map((step, i) => {
            const isDone    = i <= currentIndex;
            const isActive  = i === currentIndex;
            const Meta      = STEP_META[step];
            const Icon      = Meta.icon;
            const isLast    = i === STEPS.length - 1;

            return (
              <div key={step} className="flex-1 flex flex-col items-center">
                {/* connector + dot row */}
                <div className="flex items-center w-full">
                  {/* left line */}
                  <div className={`flex-1 h-px transition-colors duration-500
                    ${i === 0 ? 'opacity-0' : isDone ? 'bg-[#958E62]/60' : 'bg-white/8'}`} />

                  {/* dot */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center
                                   
                                   shrink-0 border transition-all duration-500
                                   ${isDone
                                     ? 'bg-[#958E62]/20 border-[#958E62]/50'
                                     : 'bg-transparent border-white/10'
                                   }
                                   ${isActive ? 'shadow-[0_0_12px_rgba(149,142,98,0.3)]' : ''}`}>
                    <Icon
                      size={14}
                      className={`transition-colors duration-500
                        ${isDone ? 'text-[#958E62]' : 'text-white/20'}`}
                    />
                  </div>

                  {/* right line */}
                  <div className={`flex-1 h-px transition-colors duration-500
                    ${isLast ? 'opacity-0' : isDone && currentIndex > i ? 'bg-[#958E62]/60' : 'bg-white/8'}`} />
                </div>

                {/* label */}
                <div className="mt-2 text-center px-1">
                  <p className={`font-['JetBrains_Mono'] text-[7px] uppercase tracking-[0.2em]
                    ${isActive ? 'text-[#958E62]' : isDone ? 'text-white/50' : 'text-white/20'}`}>
                    {Meta.label}
                  </p>
                  {isActive && (
                    <p className="font-['Playfair_Display'] italic text-[10px] text-white/30 mt-0.5 hidden md:block">
                      {Meta.desc}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── ORDER DETAIL PAGE ────────────────────────────────────
const OrderDetail = () => {
  const { id }     = useParams();
  const dispatch   = useDispatch();
//   const navigate   = useNavigate();

  const { selectedOrder: order, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [id]);

  const handleCancel = () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    dispatch(cancelOrder({ orderId: id, reason: 'Cancelled by customer' }));
  };

  const fmt     = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 });

  // ── LOADING ──
  if (loading) return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border border-[#958E62]/20 border-t-[#958E62] rounded-full animate-spin" />
      <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.4em] text-[#958E62]/50">
        Retrieving Order
      </p>
    </div>
  );

  // ── ERROR ──
  if (error) return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col items-center justify-center gap-4">
      <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest text-red-400/60">{error}</p>
      <Link to="/orders" className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest
                                    text-[#958E62] border-b border-[#958E62]/30 pb-0.5">
        Back to Orders
      </Link>
    </div>
  );

  if (!order) return null;

  const shortId          = order._id.slice(-8).toUpperCase();
  const canCancel        = !['shipped', 'delivered', 'cancelled'].includes(order.orderStatus);
  const isCancelled      = order.orderStatus === 'cancelled';

  return (
    <div className="bg-[#0a0a09] min-h-screen text-[#E7E7D9]
                    pt-24 md:pt-28 pb-36 md:pb-16 px-4 md:px-10
                    selection:bg-[#958E62] selection:text-black">
      <div className="max-w-4xl mx-auto">

        {/* ── BREADCRUMB ── */}
        <div className="flex items-center gap-3 mb-8
                        font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.25em]">
          <Link to="/orders" className="flex items-center gap-1.5 text-white/30 hover:text-[#958E62] transition-colors">
            <ChevronLeft size={12} />
            Orders
          </Link>
          <span className="text-white/15">—</span>
          <span className="text-[#958E62]/70">№ {shortId}</span>
        </div>

        {/* ── PAGE HEADER ── */}
        <div className="mb-8">
          <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.5em] text-[#958E62] mb-2">
            Order Detail
          </p>
          <h1 className="font-['Baskervville'] italic text-4xl md:text-5xl text-white">
            Acquisition №{shortId}
          </h1>
          <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.3em] text-white/25 mt-2">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>

        <div className="flex flex-col gap-5">

          {/* ── STATUS TIMELINE ── */}
          <div className="p-6 md:p-8 rounded-2xl bg-[#0d0d0c] border border-white/5">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/5">
              <Package size={15} className="text-[#958E62] 
              shrink-0" />
              <h2 className="font-['Baskervville'] italic text-xl text-white">Order Status</h2>
            </div>
            <StatusTimeline status={order.orderStatus} />

            {/* tracking number */}
            {order.trackingNumber && (
              <div className="mt-5 pt-5 border-t border-white/5 flex items-center gap-2">
                <span className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.25em] text-[#958E62]/50">
                  Tracking No.
                </span>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#958E62]/80 tracking-widest">
                  {order.trackingNumber}
                </span>
              </div>
            )}

            {/* estimated delivery */}
            {order.estimatedDelivery && (
              <div className="mt-3 flex items-center gap-2">
                <span className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.25em] text-white/25">
                  Est. Delivery
                </span>
                <span className="font-['Playfair_Display'] italic text-sm text-white/50">
                  {new Date(order.estimatedDelivery).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
            )}

            {/* cancellation reason */}
            {isCancelled && order.cancellationReason && (
              <div className="mt-4 px-4 py-3 rounded-xl bg-red-400/5 border border-red-400/10">
                <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.2em] text-red-400/50 mb-1">
                  Reason
                </p>
                <p className="font-['Playfair_Display'] italic text-sm text-red-400/50">
                  {order.cancellationReason}
                </p>
              </div>
            )}
          </div>

          {/* ── ITEMS ── */}
          <div className="p-6 md:p-8 rounded-2xl bg-[#0d0d0c] border border-white/5">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/5">
              <Star size={15} className="text-[#958E62] 
              shrink-0" />
              <h2 className="font-['Baskervville'] italic text-xl text-white">Acquired Timepieces</h2>
            </div>

            <div className="flex flex-col gap-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl
                                        bg-[#111110] border border-white/4
                                        group hover:border-[#958E62]/15 transition-colors">
                  <div className="w-14 h-14 rounded-xl overflow-hidden 
                  shrink-0
                                  border border-white/5 bg-[#0a0a09]">
                    <img src={item.image} alt={item.title}
                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-['JetBrains_Mono'] text-[7px] uppercase tracking-[0.3em] text-[#958E62]/55 mb-0.5">
                      {item.brand}
                    </p>
                    <p className="font-['Baskervville'] italic text-base text-white truncate">
                      {item.title}
                    </p>
                    <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-widest text-white/25 mt-0.5">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <div className="text-right 
                  shrink-0">
                    <p className="font-['Playfair_Display'] italic text-sm text-[#C2B994]">
                      ${fmt(item.price * item.quantity)}
                    </p>
                    <p className="font-['JetBrains_Mono'] text-[7px] text-white/20 mt-0.5">
                      ${fmt(item.price)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* order totals */}
            <div className="mt-5 pt-5 border-t border-white/5 space-y-2">
              {[
                { label: 'Subtotal',  value: `$${fmt(order.subtotal)}`    },
                { label: 'Shipping',  value: order.shippingCost === 0 ? 'Complimentary' : `$${fmt(order.shippingCost)}` },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.25em] text-white/25">
                    {row.label}
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[9px] text-white/50">
                    {row.value}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-baseline pt-3 border-t border-white/5">
                <span className="font-['Baskervville'] italic text-lg text-white/70">Total</span>
                <span className="font-['Baskervville'] italic text-2xl text-white">
                  ${fmt(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* ── BOTTOM ROW: shipping + payment ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* shipping address */}
            <div className="p-6 rounded-2xl bg-[#0d0d0c] border border-white/5">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5">
                <MapPin size={14} className="text-[#958E62] 
                shrink-0" />
                <h3 className="font-['Baskervville'] italic text-lg text-white">Delivery Address</h3>
              </div>
              <p className="font-['Playfair_Display'] italic text-sm text-white/50 leading-[1.9]">
                {order.shippingAddress?.fullname}<br />
                {order.shippingAddress?.addressLine1}
                {order.shippingAddress?.addressLine2 && `, ${order.shippingAddress.addressLine2}`}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
                {order.shippingAddress?.country}
              </p>
              {order.shippingAddress?.phone && (
                <p className="font-['JetBrains_Mono'] text-[8px] text-white/25 mt-3 tracking-widest">
                  {order.shippingAddress.phone}
                </p>
              )}
            </div>

            {/* payment info */}
            <div className="p-6 rounded-2xl bg-[#0d0d0c] border border-white/5">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5">
                <CreditCard size={14} className="text-[#958E62] 
                shrink-0" />
                <h3 className="font-['Baskervville'] italic text-lg text-white">Payment</h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    label: 'Method',
                    value: order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment',
                  },
                  {
                    label: 'Status',
                    value: order.paymentStatus,
                    badge: true,
                    color: order.paymentStatus === 'paid'
                      ? 'text-[#4ade80]/70'
                      : order.paymentStatus === 'pending'
                      ? 'text-amber-400/70'
                      : 'text-red-400/60',
                  },
                ].map((row, i) => (
                  <div key={i}>
                    <p className="font-['JetBrains_Mono'] text-[7px] uppercase tracking-[0.35em] text-white/25 mb-1">
                      {row.label}
                    </p>
                    <p className={`font-['Playfair_Display'] italic text-sm capitalize
                      ${row.color || 'text-white/55'}`}>
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── ACTIONS ── */}
          <div className="flex flex-wrap items-center gap-3 pt-2">

            {/* download certificate */}
            <button
              onClick={() => openCertificate(order)}
              className="flex items-center gap-2 px-6 py-3 rounded-full
                         font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.25em]
                         bg-[#958E62] text-[#0a0a09] font-bold border border-[#958E62]
                         hover:bg-[#C2B994] hover:border-[#C2B994]
                         hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              Download Certificate
            </button>

            {/* cancel order */}
            {canCancel && (
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-3 rounded-full
                           font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.25em]
                           border border-red-400/20 text-red-400/50
                           hover:border-red-400/40 hover:text-red-400/80
                           hover:bg-red-400/5 transition-all duration-300 cursor-pointer"
              >
                <XCircle size={13} />
                Cancel Order
              </button>
            )}

            <Link
              to="/orders"
              className="ml-auto font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.25em]
                         text-white/25 hover:text-[#958E62] transition-colors"
            >
              ← Back to Orders
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
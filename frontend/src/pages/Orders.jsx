import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Calendar, Inbox, ExternalLink, Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders, clearError } from '../redux/slices/orderSlice.js';
import { openCertificate } from "../utils/Certificate.js";

// ── STATUS CONFIG ────────────────────────────────────────
const STATUS = {
  processing: { color: 'text-amber-400/80  border-amber-400/20  bg-amber-400/5',  dot: 'bg-amber-400'       },
  confirmed:  { color: 'text-blue-400/80   border-blue-400/20   bg-blue-400/5',   dot: 'bg-blue-400'        },
  shipped:    { color: 'text-sky-400/80    border-sky-400/20    bg-sky-400/5',     dot: 'bg-sky-400 animate-pulse' },
  delivered:  { color: 'text-[#4ade80]/80  border-[#4ade80]/20  bg-[#4ade80]/5',  dot: 'bg-[#4ade80]'       },
  cancelled:  { color: 'text-red-400/50    border-red-400/15    bg-red-400/5',     dot: 'bg-red-400/50'      },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS[status] || STATUS.processing;
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border
                      font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.25em]
                      ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {status}
    </span>
  );
};

// ── ORDER CARD ───────────────────────────────────────────
const OrderCard = ({ order }) => {
  const fmt      = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const shortId  = order._id.slice(-8).toUpperCase();
  const date     = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  // items store snapshots — use item.image
  const firstItem  = order.items[0];
  const extraCount = order.items.length - 1;

  return (
    <div className="group relative overflow-hidden
                    bg-[#0d0d0c] border border-white/5 rounded-2xl
                    transition-all duration-500
                    hover:border-[#958E62]/25 hover:shadow-[0_16px_48px_rgba(0,0,0,0.6)]">

      {/* gold left accent on hover */}
      <div className="absolute left-0 top-0 w-0.5 h-full bg-[#958E62]
                      scale-y-0 group-hover:scale-y-100
                      transition-transform duration-500 origin-top" />

      <div className="px-6 md:px-8 py-6">

        {/* ── TOP ROW ── */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5 pb-5 border-b border-white/5">

          {/* left: status + meta */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge status={order.orderStatus} />
              <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.3em] text-white/25">
                № {shortId}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/35">
              <Calendar size={12} className="text-[#958E62]/50 shrink-0" />
              <span className="font-['Playfair_Display'] italic text-xs">{date}</span>
              {order.paymentMethod && (
                <>
                  <span className="text-white/15 mx-1">·</span>
                  <span className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-widest text-white/25">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* right: total */}
          <div className="text-right shrink-0">
            <p className="font-['JetBrains_Mono'] text-[7px] uppercase tracking-[0.35em] text-[#958E62]/50 mb-1">
              Total Value
            </p>
            <p className="font-['Baskervville'] italic text-2xl text-white">
              ${fmt(order.totalAmount)}
            </p>
          </div>
        </div>

        {/* ── ITEM PREVIEW + ACTIONS ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">

          {/* item preview */}
          <div className="flex items-center gap-4 min-w-0">

            {/* stacked thumbnails */}
            <div className="relative shrink-0 w-14 h-14">
              {order.items.slice(0, 2).map((item, i) => (
                <div
                  key={i}
                  style={{ zIndex: 2 - i, right: i * 8, top: i * 4 }}
                  className={`absolute w-14 h-14 rounded-xl overflow-hidden
                              border border-white/8 bg-[#111110]`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* title */}
            <div className="min-w-0 pl-2">
              {firstItem?.brand && (
                <p className="font-['JetBrains_Mono'] text-[7px] uppercase tracking-[0.35em] text-[#958E62]/60 mb-0.5">
                  {firstItem.brand}
                </p>
              )}
              <h3 className="font-['Baskervville'] italic text-lg text-white truncate max-w-55">
                {firstItem?.title}
              </h3>
              <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-widest text-white/20 mt-0.5">
                {extraCount > 0
                  ? `+ ${extraCount} more item${extraCount > 1 ? 's' : ''}`
                  : 'Individual Acquisition'}
              </p>
            </div>
          </div>

          {/* actions */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">

            {/* view certificate */}
              <button
                onClick={() => openCertificate(order)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full
                          font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.2em]
                          border border-white/8 text-white/40
                          hover:border-[#958E62]/35 hover:text-[#958E62]
                          transition-all duration-300 cursor-pointer"
              >
                <ExternalLink size={12} />
                Certificate
              </button>

            {/* order detail */}
            <Link
              to={`/orders/${order._id}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full
                         font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.2em]
                         bg-[#958E62] text-[#0a0a09] font-bold border border-[#958E62]
                         hover:bg-[#C2B994] hover:border-[#C2B994]
                         hover:-translate-y-0.5 transition-all duration-300"
            >
              Details
              <ChevronRight size={12} />
            </Link>
          </div>
        </div>

        {/* tracking number if available */}
        {order.trackingNumber && (
          <div className="mt-4 pt-4 border-t border-white/4 flex items-center gap-2">
            <Package size={12} className="text-[#958E62]/50 shrink-0" />
            <span className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.2em] text-white/30">
              Tracking:
            </span>
            <span className="font-['JetBrains_Mono'] text-[8px] tracking-widest text-[#958E62]/70">
              {order.trackingNumber}
            </span>
          </div>
        )}

        {/* cancellation reason if cancelled */}
        {order.orderStatus === 'cancelled' && order.cancellationReason && (
          <div className="mt-4 pt-4 border-t border-white/4 flex items-center gap-2">
            <Clock size={12} className="text-red-400/40 shrink-0" />
            <span className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.2em] text-red-400/40">
              Reason:
            </span>
            <span className="font-['Playfair_Display'] italic text-xs text-red-400/40">
              {order.cancellationReason}
            </span>
          </div>
        )}

      </div>

      {/* bottom shimmer */}
      <div className="absolute bottom-0 left-0 w-full h-px
                      bg-linear-to-r from-transparent via-[#958E62]/10 to-transparent" />
    </div>
  );
};

// ── ORDERS PAGE ──────────────────────────────────────────
const Orders = () => {
  const dispatch                     = useDispatch();
  const { orders, loading, pagination } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders({ page: 1, limit: 10 }));
    return () => dispatch(clearError());
  }, [dispatch]);

  // ── LOADING ──
  if (loading && orders.length === 0) return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border border-[#958E62]/20 border-t-[#958E62] rounded-full animate-spin" />
      <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.5em] text-[#958E62]/50">
        Opening Registry
      </p>
    </div>
  );

  return (
    <div className="bg-[#0a0a09] min-h-screen text-[#E7E7D9]
                    pt-24 md:pt-28 pb-36 md:pb-16 px-4 md:px-10
                    selection:bg-[#958E62] selection:text-black">
      <div className="max-w-4xl mx-auto">

        {/* ── HEADER ── */}
        <div className="mb-10 md:mb-12">
          <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.6em] text-[#958E62] mb-3">
            Order History
          </p>
          <h1 className="font-['Baskervville'] italic text-4xl md:text-5xl text-white">
            Your Acquisitions
          </h1>
          {orders.length > 0 && (
            <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.4em] text-white/20 mt-2">
              {pagination?.total || orders.length} {(pagination?.total || orders.length) === 1 ? 'order' : 'orders'} placed
            </p>
          )}
        </div>

        {/* ── EMPTY STATE ── */}
        {orders.length === 0 ? (
          <div className="py-28 border border-white/5 rounded-3xl bg-[#0d0d0c]
                          flex flex-col items-center justify-center gap-7">
            <div className="w-16 h-16 rounded-full border border-white/5
                            flex items-center justify-center">
              <Inbox size={24} className="text-white/15" strokeWidth={1} />
            </div>
            <div className="text-center space-y-2">
              <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.4em] text-white/20">
                The registry is empty
              </p>
              <p className="font-['Playfair_Display'] italic text-white/15 text-sm">
                Your future acquisitions will appear here.
              </p>
            </div>
            <Link
              to="/collections"
              className="px-8 py-3.5 rounded-full
                         font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest font-bold
                         bg-[#958E62] text-[#0a0a09] border border-[#958E62]
                         hover:bg-[#C2B994] hover:border-[#C2B994]
                         hover:-translate-y-0.5 transition-all duration-400"
            >
              Begin Acquisition
            </Link>
          </div>
        ) : (
          <>
            {/* ── ORDER LIST ── */}
            <div className="flex flex-col gap-3">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>

            {/* ── PAGINATION ── */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => dispatch(fetchMyOrders({ page: pagination.page - 1, limit: 10 }))}
                  className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest
                             text-[#958E62] disabled:opacity-20 hover:text-white
                             transition-colors px-4 py-2 border border-[#958E62]/20
                             rounded-full hover:border-[#958E62]/60 disabled:cursor-not-allowed"
                >
                  Prev
                </button>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => dispatch(fetchMyOrders({ page: p, limit: 10 }))}
                    className={`font-['JetBrains_Mono'] text-[9px] w-8 h-8 rounded-full border transition-all
                      ${pagination.page === p
                        ? 'bg-[#958E62] text-[#0a0a09] border-[#958E62]'
                        : 'text-[#958E62] border-[#958E62]/20 hover:border-[#958E62]/60 hover:text-white'
                      }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  disabled={pagination.page === pagination.pages}
                  onClick={() => dispatch(fetchMyOrders({ page: pagination.page + 1, limit: 10 }))}
                  className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest
                             text-[#958E62] disabled:opacity-20 hover:text-white
                             transition-colors px-4 py-2 border border-[#958E62]/20
                             rounded-full hover:border-[#958E62]/60 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* footer nav */}
        <div className="mt-20 text-center">
          <Link
            to="/collections"
            className="group inline-flex flex-col items-center gap-3 text-white/20 hover:text-[#958E62] transition-colors"
          >
            <div className="w-px h-10 bg-[#958E62]/20 group-hover:h-14 transition-all duration-700" />
            <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.5em]">
              Return to Gallery
            </span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Orders;
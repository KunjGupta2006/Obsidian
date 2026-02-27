import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, ExternalLink, Calendar, MapPin, Inbox } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders, clearError } from '../redux/slices/orderSlice.js';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders); // name in store is 'order'

  useEffect(() => {
    dispatch(fetchMyOrders({ page: 1, limit: 10 }));
    
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // ── LOADING STATE ──────────────────────────────────────
  if (loading && orders.length === 0) return (
    <div className="h-screen bg-[#0a0a09] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="w-12 h-12 border-t-2 border-[#958E62] rounded-full animate-spin mx-auto" />
        <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.5em] text-[#958E62] animate-pulse">
          Opening your Registry
        </p>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'delivered') return 'text-[#4ade80] border-[#4ade80]/20 bg-[#4ade80]/5';
    if (s === 'processing' || s === 'placed') return 'text-[#958E62] border-[#958E62]/20 bg-[#958E62]/5';
    if (s === 'cancelled') return 'text-red-400/50 border-red-400/10 bg-red-400/5';
    return 'text-white/40 border-white/10 bg-white/5';
  };

  return (
    <div className="bg-[#0a0a09] min-h-screen text-[#E7E7D9] pt-32 pb-40 px-6 md:px-16 selection:bg-[#958E62] selection:text-black">
      <div className="max-w-6xl mx-auto">
        
        {/* --- PAGE HEADER --- */}
        <div className="mb-16">
          <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.6em] text-[#958E62] mb-4">
            Order History
          </p>
          <h1 className="font-['Baskervville'] italic text-5xl md:text-7xl text-white">
            Your Acquisitions
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="py-32 border border-white/5 rounded-[3rem] bg-[#0d0d0c]/50 flex flex-col items-center justify-center space-y-8">
            <Inbox size={48} className="text-zinc-800" strokeWidth={1} />
            <div className="text-center">
               <p className="font-['JetBrains_Mono'] text-xs uppercase tracking-[0.3em] text-white/30">
                 The registry is currently empty.
               </p>
               <p className="font-['Playfair_Display'] italic text-white/10 text-sm mt-2">
                 Your future masterpieces will appear here.
               </p>
            </div>
            <Link to="/collections" className="px-10 py-4 bg-[#958E62] text-black font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest font-bold rounded-full hover:bg-white transition-all duration-500">
              Begin Acquisition
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order._id}
                className="group relative overflow-hidden bg-[#0d0d0c] border border-white/5 rounded-[2.5rem] p-6 md:p-10 transition-all duration-500 hover:border-[#958E62]/30"
              >
                {/* Order Meta Header */}
                <div className="flex flex-wrap items-start justify-between gap-6 mb-10 pb-8 border-b border-white/5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-1.5 rounded-full border font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest text-white/30">
                        № {order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-white/60">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#958E62]/60" />
                        <span className="font-['Playfair_Display'] italic text-sm">
                          {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[#958E62]/60" />
                        <span className="font-['Playfair_Display'] italic text-sm">Insured Delivery</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-[#958E62]/60 mb-1">Total Value</p>
                    <p className="font-['Baskervville'] italic text-3xl text-white">
                      ${Number(order.totalPrice).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="flex gap-6 items-center">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/5 bg-zinc-950 shrink-0">
                      <img 
                        src={order.items[0]?.watch?.image} 
                        alt={order.items[0]?.watch?.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-[#958E62] mb-1">
                        {order.items[0]?.watch?.brand}
                      </p>
                      <h3 className="font-['Baskervville'] italic text-xl md:text-2xl text-white truncate">
                        {order.items[0]?.watch?.title}
                      </h3>
                      <p className="font-['JetBrains_Mono'] text-[10px] text-white/20 mt-1 uppercase tracking-widest">
                        {order.items.length > 1 ? `+ ${order.items.length - 1} Additional items` : 'Individual Acquisition'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-start md:justify-end gap-4">
                    <Link 
                      to={`/order-confirmation/${order._id}`}
                      className="flex items-center gap-2 px-6 py-3 bg-white/[0.03] border border-white/10 rounded-full font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest hover:bg-[#958E62] hover:text-black transition-all duration-300"
                    >
                      <ExternalLink size={14} /> Certificate
                    </Link>
                    <Link 
                      to={`/orders/${order._id}`}
                      className="flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-[#958E62]/40 rounded-full font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest transition-all duration-300"
                    >
                      Archive Details <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
                
                {/* Decorative Side Accents */}
                <div className="absolute left-0 top-0 w-[2px] h-full bg-[#958E62] scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top" />
              </div>
            ))}
          </div>
        )}

        {/* --- FOOTER NAVIGATION --- */}
        <div className="mt-24 text-center">
          <Link to="/collections" className="group inline-flex flex-col items-center gap-4 text-white/20 hover:text-[#958E62] transition-colors">
            <div className="w-px h-12 bg-[#958E62]/20 group-hover:h-16 transition-all duration-700" />
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
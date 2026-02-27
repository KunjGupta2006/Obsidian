import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import {  fetchWatchById } from '../redux/slices/watchSlice.js';
import { addToCart } from '../redux/slices/cartSlice.js';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice.js';

const ProductDetail = () => {
  const { id }   = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedWatch: watch, loading, error } = useSelector((state) => state.watches);
  const { isAuthenticated }                      = useSelector((state) => state.auth);
  const { items: cartItems,     loading: cartLoading } = useSelector((state) => state.cart);
  const { items: wishlistItems }                 = useSelector((state) => state.wishlist);

  const isInCart     = cartItems.some((c) => c.watch?._id === id);
  const isWishlisted = wishlistItems.some((w) => w._id === id);

  const [cartAdded,   setCartAdded]   = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [activeTab,   setActiveTab]   = useState('description');

  useEffect(() => {
    dispatch(fetchWatchById({ id }));
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    dispatch(addToCart(id)).then(() => {
      setCartAdded(true);
      setTimeout(() => setCartAdded(false), 3000);
    });
  };

  const handleWishlist = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setWishLoading(true);
    const action = isWishlisted ? removeFromWishlist(id) : addToWishlist(id);
    dispatch(action).finally(() => setWishLoading(false));
  };

  // ── LOADING ──────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border border-[#958E62]/20 border-t-[#958E62] rounded-full animate-spin" />
      <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.4em] text-[#958E62]/50">
        Retrieving Timepiece
      </span>
    </div>
  );

  // ── ERROR ─────────────────────────────────────────
  if (error) return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col items-center justify-center gap-4">
      <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest text-red-400/60">{error}</p>
      <Link
        to="/collections"
        className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest
                   text-[#958E62] border-b border-[#958E62]/30 pb-0.5
                   hover:text-[#DED5A4] transition-colors"
      >
        Return to Collection
      </Link>
    </div>
  );

  if (!watch || !watch._id) return null;

  const specs = [
    { label: 'Movement',   value: watch.specs?.movement   || '—' },
    { label: 'Case Size',  value: watch.specs?.caseSize   || '—' },
    { label: 'Dial Color', value: watch.specs?.dialColor  || '—' },
    { label: 'Condition',  value: watch.condition         || '—' },
    { label: 'Reference',  value: watch.referenceNumber   || '—' },
    { label: 'Brand',      value: watch.brand             || '—' },
  ];

  return (
    <div className="bg-[#0a0a09] min-h-screen text-[#E7E7D9] pb-32 md:pb-16">

      {/* ── MAIN GRID ───────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 md:px-16
                      grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start lg:h-[100vh-10vh]">

        {/* ── LEFT IMAGE ── */}
        <div className="relative lg:sticky lg:top-28">
          <div className="relative aspect-square overflow-hidden rounded-4xl
                          border border-white/5 bg-[#0f0f0e] group">
            <img
              src={watch.image}
              alt={watch.title}
              className="w-full h-full object-cover scale-[1.0]
                         group-hover:scale-110 transition-transform duration-800 lg:h-[100vh-20vh]"
            />

            {/* stock badge */}
            <div className={`absolute top-4 left-4 flex items-center gap-2
                             px-3 py-1.5 rounded-full backdrop-blur-md border
                             font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em]
                             ${watch.inStock
                               ? 'bg-black/70 border-[#4ade80]/30 text-[#4ade80]'
                               : 'bg-black/70 border-red-400/25 text-red-400/70'}`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0
                ${watch.inStock
                  ? 'bg-[#4ade80] shadow-[0_0_6px_#4ade80] animate-pulse'
                  : 'bg-red-400/70'}`}
              />
              {watch.inStock ? 'Available' : 'Sold Out'}
            </div>

            {/* condition badge */}
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full backdrop-blur-md
                            font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em]
                            bg-black/70 border border-white/10 text-white/50">
              {watch.condition}
            </div>

            {/* wishlist button on image */}
            <button
              onClick={handleWishlist}
              disabled={wishLoading}
              title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              className={`absolute bottom-4 right-4 w-10 h-10 rounded-full
                          flex items-center justify-center backdrop-blur-md border
                          transition-all duration-300 cursor-pointer
                          ${isWishlisted
                            ? 'bg-[#958E62]/25 border-[#958E62]/50 text-[#958E62]'
                            : 'bg-black/60 border-white/10 text-white/40 hover:text-[#958E62] hover:border-[#958E62]/30'}`}
            >
              <Heart size={16} className={isWishlisted ? 'fill-[#958E62]' : ''} />
            </button>
          </div>

          {/* corner accents */}
          <div className="absolute -top-3 -left-3 w-8 h-8 border-t border-l border-[#958E62]/18 rounded-tl-xl pointer-events-none hidden md:block" />
          <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b border-r border-[#958E62]/18 rounded-br-xl pointer-events-none hidden md:block" />
        </div>

        {/* ── RIGHT INFO ── */}
        <div className="flex flex-col gap-4 pt-1">

          {/* brand eyebrow */}
          <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.5em] text-[#958E62]">
            {watch.brand}
          </p>

          {/* title — high contrast white */}
          <h1 className="font-['Baskervville'] italic text-4xl md:text-5xl text-white leading-[1.05] -mt-1">
            {watch.title}
          </h1>

          {/* reference */}
          {watch.referenceNumber && (
            <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em] text-white/55 -mt-1">
              Ref. {watch.referenceNumber}
            </p>
          )}


          {/* price */}
          <div className="flex flex-col gap-1">
            <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.4em] text-white/30">
              Acquisition Value
            </span>
            <span className="font-['Baskervville'] italic text-4xl text-[#DED5A4]">
              ${Number(watch.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="w-full h-px bg-white/10" />

          {/* tabs */}
          <div className="flex border-b border-white/5">
            {['description', 'specifications'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em]
                            pr-6 py-3 border-b -mb-px transition-colors duration-300 cursor-pointer
                            ${activeTab === tab
                              ? 'text-[#9a9575] border-[#958E62]'
                              : 'text-white/25 border-transparent hover:text-white/50'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* tab content */}
          <div className="min-h-24">
            {activeTab === 'description' && (
              <p className="font-['Playfair_Display'] italic text-white/55 leading-[1.95] text-[0.94rem]">
                {watch.description}
              </p>
            )}
            {activeTab === 'specifications' && (
              <div className="grid grid-cols-2 gap-0">
                {specs.map((spec, i) => (
                  <div
                    key={i}
                    className={`flex flex-col gap-1 py-3 border-b border-white/4
                                ${i % 2 === 0 ? 'pr-6 border-r border-white/4' : 'pl-6'}`}
                  >
                    <span className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.3em] text-white/35">
                      {spec.label}
                    </span>
                    <span className="font-['Playfair_Display'] italic text-[#C2B994] text-sm">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-full h-px bg-white/5" />

          {/* ── CTA ── */}
          <div className="flex flex-col gap-3">

            {/* main buttons row */}
            <div className="flex gap-3">

              {/* add to cart */}
              {watch.inStock ? (
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full
                              font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em]
                              transition-all duration-500 cursor-pointer
                              disabled:opacity-50 disabled:cursor-not-allowed
                              ${cartAdded || isInCart
                                ? 'bg-[#958E62]/12 text-[#958E62] border border-[#958E62]/25'
                                : 'bg-[#958E62] text-[#0a0a09] font-bold border border-[#958E62] hover:bg-[#C2B994] hover:border-[#C2B994] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(149,142,98,0.3)]'
                              }`}
                >
                  {cartAdded
                    ? <><Check size={14} /> Added to Vault</>
                    : isInCart
                    ? <><ShoppingBag size={14} /> In Your Vault</>
                    : <><ShoppingBag size={14} /> Add to Vault</>
                  }
                </button>
              ) : (
                <button disabled
                  className="flex-1 py-4 rounded-full font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em]
                             bg-transparent text-red-400/30 border border-red-400/10 cursor-not-allowed">
                  Sold Out
                </button>
              )}

              {/* wishlist button */}
              <button
                onClick={handleWishlist}
                disabled={wishLoading}
                title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center
                            border transition-all duration-300 cursor-pointer
                            ${isWishlisted
                              ? 'bg-[#958E62]/15 border-[#958E62]/35 text-[#958E62]'
                              : 'bg-transparent border-white/10 text-white/30 hover:text-[#958E62] hover:border-[#958E62]/25'}`}
              >
                <Heart size={18} className={isWishlisted ? 'fill-[#958E62]' : ''} />
              </button>
            </div>

            {/* cart added toast */}
            {cartAdded && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl
                              bg-[#958E62]/8 border border-[#958E62]/20
                              animate-pulse-once">
                <Check size={12} className="text-[#958E62] shrink-0" />
                <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#958E62]">
                  Added to your vault —{' '}
                  <Link to="/cart"
                    className="underline underline-offset-2 hover:text-[#DED5A4] transition-colors">
                    View Cart
                  </Link>
                </span>
              </div>
            )}

            {/* wishlist saved toast */}
            {isWishlisted && (
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl
                              bg-[#958E62]/5 border border-[#958E62]/12">
                <Heart size={11} className="text-[#958E62]/60 fill-[#958E62]/60 shrink-0" />
                <span className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.2em] text-[#958E62]/60">
                  Saved to wishlist —{' '}
                  <Link to="/wishlist"
                    className="underline underline-offset-2 hover:text-[#958E62] transition-colors">
                    View Wishlist
                  </Link>
                </span>
              </div>
            )}

            <Link
              to="/collections"
              className="text-center font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.3em]
                         text-white/30 hover:text-[#958E62] transition-colors py-1"
            >
              ← Continue Browsing
            </Link>
          </div>

          {/* authenticity note */}
          <div className="flex gap-3 items-start p-4 rounded-xl
                          border border-[#958E62]/10 bg-[#958E62]/2.5">
            <span className="text-[#999E69]/35 text-[10px] mt-0.5 shrink-0">✦</span>
            <p className="font-['Playfair_Display'] italic text-[0.78rem] text-white/30 leading-normal">
              Every timepiece is authenticated and inspected to the Obsidian Standard.
              Full provenance documentation included with every acquisition.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
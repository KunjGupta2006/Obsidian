import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { fetchWishlist, removeFromWishlist, moveToCart } from '../redux/slices/wishlistSlice';

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleMoveToCart = (e, id) => {
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    dispatch(moveToCart(id));
  };

  const handleRemove = (e, id) => {
    e.stopPropagation();
    dispatch(removeFromWishlist(id));
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col items-center justify-center gap-6">
      <div className="w-10 h-10 border-t-2 border-[#958E62] rounded-full animate-spin" />
      <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.5em] text-[#958E62]/60">
        Opening Vault
      </span>
    </div>
  );

  return (
    <div className="bg-[#0a0a09] min-h-screen w-full pt-28 md:pt-32 pb-40 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">

        {/* --- HEADER --- */}
        <div className="mb-16">
          <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.6em] text-[#958E62] mb-4">
            Private Selection
          </p>
          <h1 className="font-['Baskervville'] italic text-5xl md:text-7xl text-white leading-tight">
            Curated Desires
          </h1>
          <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.4em] text-white/20 mt-4 border-l border-[#958E62]/30 pl-4">
            {items.length} {items.length === 1 ? 'Masterpiece' : 'Masterpieces'} Reserved
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 rounded-[3rem] border border-white/5 bg-[#0d0d0c]/50 backdrop-blur-sm">
            <Heart size={48} className="text-zinc-800 mb-8" strokeWidth={1} />
            <div className="text-center space-y-3 mb-10">
              <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.4em] text-white/30">
                The collection is empty
              </p>
              <p className="font-['Playfair_Display'] italic text-white/20 text-sm max-w-xs mx-auto">
                Begin your journey by discovering timepieces that resonate with your legacy.
              </p>
            </div>
            <Link 
              to="/collections" 
              className="px-10 py-4 bg-[#958E62] text-black font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest rounded-full font-bold hover:bg-white transition-all duration-500 shadow-xl"
            >
              Discover Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {items.map((item) => (
              <div 
                key={item._id} 
                onClick={() => navigate(`/product/${item._id}`)} 
                className="group relative flex gap-6 p-6 rounded-[2.5rem] bg-[#0d0d0c] border border-white/5 items-center cursor-pointer transition-all duration-700 hover:border-[#958E62]/30 hover:bg-[#0f0f0e] hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
              >
                {/* Image Section */}
                <div className="w-28 h-28 md:w-36 md:h-36 shrink-0 overflow-hidden rounded-3xl border border-white/5 bg-[#141411]">
                  <img 
                    src={item.image} 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
                    alt={item.title} 
                  />
                </div>
                
                {/* Content Section */}
                <div className="flex-1 flex flex-col justify-between py-2 min-w-0">
                  <div className="space-y-2">
                    <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.4em] text-[#958E62]">
                      {item.brand || 'Obsidian'}
                    </p>
                    <h3 className="font-['Baskervville'] italic text-xl md:text-2xl text-white group-hover:text-[#DED5A4] transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-['Playfair_Display'] italic text-lg text-[#C2B994]">
                      ${Number(item.price).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions Area */}
                  <div className="flex items-center gap-4 mt-6">
                    <button 
                      onClick={(e) => handleMoveToCart(e, item._id)}
                      className="flex items-center gap-2.5 px-6 py-2.5 bg-[#958E62] text-black border border-[#958E62] rounded-full text-[9px] uppercase tracking-widest font-bold hover:bg-white hover:border-white transition-all active:scale-95"
                    >
                      <ShoppingBag size={13} strokeWidth={2} /> Acquire
                    </button>
                    
                    {/* HEART REMOVE BUTTON */}
                    <button 
                      onClick={(e) => handleRemove(e, item._id)} 
                      className="p-2.5 transition-all duration-300 text-[#958E62] hover:text-red-500/80 group/heart"
                      title="Remove from wishlist"
                    >
                      <Heart 
                        size={20} 
                        strokeWidth={1.5} 
                        className="fill-[#958E62] group-hover/heart:fill-transparent group-hover/heart:scale-110 transition-all duration-300" 
                      />
                    </button>
                  </div>
                </div>

                {/* Subtle Arrow Reveal */}
                <div className="absolute right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500 hidden md:block">
                  <ArrowRight size={20} className="text-[#958E62]/40" strokeWidth={1} />
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-24 text-center">
            <Link 
              to="/collections" 
              className="group inline-flex flex-col items-center gap-4 text-white/20 hover:text-[#958E62] transition-colors"
            >
              <div className="w-px h-12 bg-[#958E62]/20 group-hover:h-16 transition-all duration-700" />
              <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.5em]">
                Continue Curating
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
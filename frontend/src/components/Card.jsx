import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice.js';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice.js';

const Card = ({ index, title, price, image, inStock, _id }) => {
  const isReversed = index % 2 !== 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { items: cartItems } = useSelector((state) => state.cart);

  const isWishlisted = wishlistItems.some((w) => w._id === _id);
  const isInCart = cartItems.some((c) => c.watch?._id === _id);

  const [cartAdded, setCartAdded] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);

  const handleCardClick = () => navigate(`/product/${_id}`);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    dispatch(addToCart(_id)).then(() => {
      setCartAdded(true);
      setTimeout(() => setCartAdded(false), 2500);
    });
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    setWishLoading(true);
    const action = isWishlisted ? removeFromWishlist(_id) : addToWishlist(_id);
    dispatch(action).finally(() => setWishLoading(false));
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`mx-auto relative w-11/12 cursor-pointer flex flex-col md:flex-row overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0d0d0c] group transition-all duration-700 hover:border-[#958E62]/30 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)] mb-12 ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'}`}
    >
      {/* IMAGE SECTION */}
      <div className="relative w-full md:w-[55%] h-80 md:h-125 overflow-hidden shrink-0">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        <button 
          onClick={handleWishlist} 
          disabled={wishLoading}
          className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center z-10 backdrop-blur-xl border transition-all duration-500 ${isWishlisted ? 'bg-[#958E62] border-[#958E62] text-[#0a0a09]' : 'bg-black/40 border-white/10 text-white/70 hover:bg-[#958E62] hover:text-[#0a0a09]'}`}
        >
          <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
        </button>
        <div className={`absolute inset-0 pointer-events-none hidden md:block ${isReversed ? 'bg-linear-to-l from-[#0d0d0c] via-transparent to-transparent' : 'bg-linear-to-r from-[#0d0d0c] via-transparent to-transparent'}`} />
      </div>

      {/* CONTENT SECTION */}
      <div className={`flex-1 flex flex-col justify-center gap-6 px-8 md:px-16 py-12 md:py-0 ${isReversed ? 'md:items-start md:text-left' : 'md:items-end md:text-right'}`}>
        <div className="space-y-3">
          <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.6em] text-[#958E62]">Obsidian Series</p>
          <h3 className="font-['Baskervville'] italic text-4xl text-white leading-tight">{title}</h3>
        </div>
        <p className="font-['Playfair_Display'] italic text-3xl text-[#DED5A4]">${price}</p>
        
        <div className={`flex items-center gap-4 mt-4 ${isReversed ? 'justify-start' : 'md:justify-end'}`}>
          {inStock ? (
            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-3 px-10 py-4 rounded-full font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em] transition-all duration-500 border ${cartAdded || isInCart ? 'bg-transparent border-[#958E62] text-[#958E62]' : 'bg-[#958E62] text-[#0a0a09] border-[#958E62] hover:bg-white hover:border-white font-bold'}`}
            >
              <ShoppingBag size={14} />
              {cartAdded ? 'Reserved' : isInCart ? 'In Vault' : 'Acquire Item'}
            </button>
          ) : (
            <span className="text-[#4a483a] font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em] border border-white/10 px-8 py-4 rounded-full">Allocation Exhausted</span>
          )}
        </div>
      </div>
    </div>
  );
};
export default Card;
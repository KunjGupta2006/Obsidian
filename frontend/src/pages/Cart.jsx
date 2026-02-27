import React, { useEffect } from 'react';
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeFromCart, updateCartItem } from '../redux/slices/cartSlice.js';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.cart);

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  const subtotal = items.reduce((sum, item) => sum + (item.watch?.price || 0) * item.quantity, 0);

  // Navigation Handler
  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a09] flex items-center justify-center text-[#958E62] font-['JetBrains_Mono'] uppercase tracking-[0.4em] text-[10px]">
      Opening Vault...
    </div>
  );

  return (
    <div className="bg-[#0a0a09] min-h-screen w-full pt-10 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-['Baskervville'] italic text-5xl text-[#DED5A4] mb-12">Your Vault</h1>

        {items.length === 0 ? (
          <div className="py-20 text-center space-y-8">
            <ShoppingBag size={40} className="mx-auto text-zinc-800" strokeWidth={1} />
            <p className="font-['JetBrains_Mono'] text-xs uppercase tracking-[0.4em] text-zinc-500">The Vault is empty</p>
            <Link to="/collections" className="inline-block text-[#958E62] border-b border-[#958E62]/30 pb-1 uppercase font-['JetBrains_Mono'] text-[10px] tracking-widest">Discover Masterpieces</Link>
          </div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-6">
              {items.map((item) => (
                <div 
                  key={item.watch._id} 
                  onClick={() => handleCardClick(item.watch._id)} 
                  className="flex gap-6 p-6 rounded-3xl bg-zinc-900/30 border border-white/5 items-center cursor-pointer transition-all hover:bg-zinc-900/50 hover:border-[#958E62]/20 group"
                >
                  <img src={item.watch.image} className="w-24 h-24 object-cover rounded-2xl border border-white/5" alt={item.watch.title} />
                  
                  <div className="flex-1 space-y-1">
                    <h3 className="font-['Baskervville'] italic text-xl text-white group-hover:text-[#f3efc8] transition-colors">
                      {item.watch.title}
                    </h3>
                    <p className="text-[#958E62] font-['JetBrains_Mono'] text-[10px] tracking-widest">
                      ${item.watch.price.toLocaleString()}
                    </p>
                    
                    <div className="flex items-center gap-4 pt-3">
                      {/* STOP PROPAGATION IS KEY HERE */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(updateCartItem({ watchId: item.watch._id, quantity: Math.max(1, item.quantity - 1) }));
                        }} 
                        className="p-1 text-zinc-500 hover:text-[#f3efc8] cursor-pointer"
                      >
                        <Minus size={14}/>
                      </button>
                      
                      <span className="text-sm font-['JetBrains_Mono'] text-[#f3efc8]">{item.quantity}</span>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(updateCartItem({ watchId: item.watch._id, quantity: item.quantity + 1 }));
                        }} 
                        className="p-1 text-zinc-500 hover:text-[#f3efc8] cursor-pointer"
                      >
                        <Plus size={14}/></button>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(removeFromCart(item.watch._id));
                    }} 
                    className="text-[#f3efc8]/30 hover:text-red-500 transition-colors cursor-pointer p-2"
                  >
                    <Trash2 size={20}/>
                  </button>
                </div>
              ))}
            </div>

            {/* Sticky Summary Aside */}
            <aside className="lg:col-span-4 bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] h-fit sticky top-32">
              <h2 className="font-['Baskervville'] italic text-2xl text-[#DED5A4] mb-8">Summary</h2>
              <div className="space-y-4 border-b border-white/5 pb-8 mb-8">
                <div className="flex justify-between text-[10px] uppercase font-['JetBrains_Mono'] tracking-widest text-zinc-500">
                  <span>Subtotal</span><span className="text-white">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase font-['JetBrains_Mono'] tracking-widest text-zinc-500">
                  <span>Shipping</span><span className="text-[#63d98e]">FREE</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline mb-8">
                <span className="font-['Baskervville'] italic text-xl text-white">Total</span>
                <span className="font-['Baskervville'] italic text-3xl text-white">${subtotal.toLocaleString()}</span>
              </div>
              <button 
                onClick={() => navigate('/checkout')} 
                className="w-full bg-[#958E62] text-black py-5 rounded-full font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)] cursor-pointer"
              >
                Proceed to Checkout
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
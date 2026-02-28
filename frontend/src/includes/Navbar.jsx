import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ShoppingBag, Search, User, Heart, X, 
  LayoutDashboard, LogOut, Home, Compass, HeartIcon 
} from 'lucide-react';
import { logoutuser } from '../redux/slices/authSlice.js';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections?search=${searchQuery}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    dispatch(logoutuser());
    navigate('/');
  };

  return (
    <>
      {/* ── DESKTOP NAV ── */}
      <nav className={`fixed top-0 left-0 w-full z-[100] hidden md:block transition-all duration-700 ${
        isScrolled 
          ? 'py-4 bg-[#0a0a09]/95 backdrop-blur-xl border-b border-white/5' 
          : 'py-8 bg-[#0a0a09]' // Changed from transparent to solid to prevent "ugly" overlap during mount
      }`}>
        <div className="max-w-[1440px] mx-auto px-12 flex items-center justify-between">
          
          {/* LEFT: LINKS */}
          <div className="flex-1 flex items-center gap-10">
            {[
              { name: 'Collections', path: '/collections' },
              { name: 'The Vault', path: '/wishlist' },
            ].map((item) => ( 
              <Link 
                key={item.name} 
                to={item.path}
                className={`font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.4em] transition-all duration-500 ${
                  location.pathname === item.path ? 'text-[#958E62]' : 'text-white/30 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CENTER: LOGO */}
          <div className="flex-1 flex justify-center">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="w-9 h-9 border border-[#958E62]/20 rounded-full flex items-center justify-center relative overflow-hidden group-hover:border-[#958E62]/60 transition-all duration-1000">
                 <div className="w-1 h-1 bg-[#958E62] rounded-full shadow-[0_0_10px_#958E62]" />
                 <div className="absolute inset-0 border border-white/5 rounded-full" />
              </div>
              <div className="flex flex-col">
                <h1 className="font-['Baskervville'] italic text-2xl text-white tracking-[-0.02em] leading-none transition-all duration-700 group-hover:tracking-[0.05em]">
                  Obsidian<span className="text-[#958E62]">.</span>
                </h1>
                <span className="font-['JetBrains_Mono'] text-[6px] uppercase tracking-[0.9em] text-[#958E62]/40 mt-1 pl-1">
                  Registry
                </span>
              </div>
            </Link>
          </div>

          {/* RIGHT: ACTIONS */}
          <div className="flex-1 flex items-center justify-end gap-8">
            <div className="relative flex items-center h-10">
              <form onSubmit={handleSearchSubmit} 
                    className={`flex items-center overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                      isSearchOpen ? 'w-56 opacity-100' : 'w-0 opacity-0 pointer-events-none'
                    }`}>
                <input 
                  type="text"
                  autoFocus={isSearchOpen}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Reference Search..."
                  className="w-full bg-transparent border-b border-[#958E62]/20 py-1 font-['Playfair_Display'] italic text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#958E62] transition-colors"
                />
              </form>
              <button onClick={() => setIsSearchOpen(!isSearchOpen)}
                      className={`p-2 transition-all duration-500 ${isSearchOpen ? 'text-[#a39c70]' : 'text-white/50 hover:text-[#a7a079]'}`}>
                {isSearchOpen ? <X size={16} strokeWidth={1.2} /> : <Search size={18} strokeWidth={1.2} />}
              </button>
            </div>

            <Link to="/cart" className={`relative transition-all hover:scale-110 ${location.pathname === '/cart' ? 'text-[#958E62]' : 'text-white/30 hover:text-[#958E62]'}`}>
              <ShoppingBag size={18} strokeWidth={1.2} />
              {cartItems?.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#958E62] text-black text-[7px] font-bold rounded-full flex items-center justify-center">{cartItems.length}</span>
              )}
            </Link>

            {!isAuthenticated ? (
              <Link to="/login" className="bg-[#958E62] text-black px-6 py-2 rounded-full font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest font-bold hover:bg-white transition-all duration-500">Identity</Link>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/profile" className="group flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center overflow-hidden transition-all duration-700 group-hover:border-[#958E62]/40">
                    {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0" /> : <User size={15} className="text-white/20 group-hover:text-[#958E62]" />}
                  </div>
                  {user?.role === 'admin' && <LayoutDashboard size={16} className="text-[#958E62]/40 hover:text-[#958E62]" />}
                </Link>
                <button onClick={handleLogout} className="text-white/10 hover:text-red-400 transition-colors cursor-pointer"><LogOut size={16} strokeWidth={1.2} /></button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── MOBILE UI ── */}
      <div className="md:hidden fixed top-0 left-0 w-full py-6 flex justify-center z-50 bg-[#0a0a09]">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-6 h-6 border border-[#958E62]/30 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-[#958E62] rounded-full" />
          </div>
          <h1 className="font-['Baskervville'] italic text-xl text-white">Obsidian<span className="text-[#958E62]">.</span></h1>
        </Link>
      </div>

      <div className="md:hidden fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-[85%] max-w-sm">
        <div className="bg-[#0d0d0c]/80 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-full px-8 py-4 flex items-center justify-between">
          <Link to="/" className={`${location.pathname === '/' ? 'text-[#958E62]' : 'text-white/30'}`}><Home size={20} strokeWidth={1.2} /></Link>
          <Link to="/collections" className={`${location.pathname === '/collections' ? 'text-[#958E62]' : 'text-white/30'}`}><Compass size={20} strokeWidth={1.2} /></Link>
          <Link to="/wishlist" className={`${location.pathname === '/wishlist' ? 'text-[#958E62]' : 'text-white/30'}`}><HeartIcon size={20} strokeWidth={1.2} /></Link>
          <Link to="/cart" className="relative">
            <ShoppingBag size={20} strokeWidth={1.2} className={`${location.pathname === '/cart' ? 'text-[#958E62]' : 'text-white/30'}`} />
            {cartItems?.length > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#958E62] text-black text-[9px] font-bold flex items-center justify-center rounded-full">{cartItems.length}</span>}
          </Link>
          <Link to={isAuthenticated ? "/profile" : "/login"} className={`${location.pathname === '/profile' || location.pathname === '/login' ? 'text-[#958E62]' : 'text-white/30'}`}><User size={20} strokeWidth={1.2} /></Link>
        </div>
      </div>

      <div className="hidden md:block h-25 w-full" /> 
      <div className="md:hidden h-20 w-full" />
    </>
  );
};

export default Navbar;
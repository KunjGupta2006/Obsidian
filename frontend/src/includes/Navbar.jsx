import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, Search, User, LogOut, ShoppingBag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutuser, fetchCurrentUser } from "../redux/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const cartCount = items.length;

  useEffect(() => { 
    dispatch(fetchCurrentUser()); 
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutuser());
  };

  return (
    <>
      <header className="hidden md:block sticky top-0 z-50 w-full">
        <nav className="backdrop-blur-2xl bg-zinc-950/40 border-b border-zinc-800/50 h-24 w-full text-[#C2B994] flex items-center justify-between px-12 transition-all duration-500 hover:bg-zinc-950">
          
          <Link className="w-16 transition-transform hover:scale-110" to="/">
            <img src="/src/assets/logo.png" className='h-full w-auto rounded-lg' alt="logo" />
          </Link>

          <div className='flex items-center gap-12 font-light tracking-[0.2em] uppercase text-xs'>
            <Link to="/" className='hover:text-white transition-colors'>Home</Link>
            <Link to="/collections" className='hover:text-white transition-colors'>Collections</Link>
            <Link to="/search" className='hover:text-white transition-colors'>Search</Link>
          </div>

          <div className='flex gap-8 items-center font-light tracking-widest uppercase text-xs'>
            <Link to="/cart" className="relative group p-2">
              <ShoppingBag size={20} strokeWidth={1.5} className="group-hover:text-white transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#C2B994] text-black text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {!isAuthenticated ? (
              <div className="flex items-center gap-6">
                <Link to="/signup" className='hover:text-white transition-colors'>Signup</Link>
                <Link to="/login" className='bg-[#C2B994] text-black px-6 py-2 rounded-full hover:bg-white transition-all font-medium'>Login</Link>
              </div>
            ) : (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-400 hover:text-red-500 transition-colors cursor-pointer group"
              >
                <LogOut size={16} strokeWidth={1.5} />
                <span className="tracking-widest">Logout</span>
              </button>
            )}
          </div>
        </nav>
      </header>

      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-100">
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-4xl px-6 py-4 flex items-center justify-between">
          
          <Link to="/" className="text-[#C2B994] hover:text-white transition-colors">
            <Home size={24} strokeWidth={1.5} />
          </Link>
          
          <Link to="/collections" className="text-[#C2B994] hover:text-white transition-colors">
            <Compass size={24} strokeWidth={1.5} />
          </Link>

          <Link to="/cart" className="relative text-[#C2B994] hover:text-white transition-colors">
            <ShoppingBag size={24} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C2B994] text-black text-[10px] font-bold flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          <Link to="/search" className="text-[#C2B994] hover:text-white transition-colors">
            <Search size={24} strokeWidth={1.5} />
          </Link>

          {!isAuthenticated ? (
            <Link to="/login" className="text-[#C2B994] hover:text-white transition-colors">
              <User size={24} strokeWidth={1.5} />
            </Link>
          ) : (
            <button 
              onClick={handleLogout}
              className="text-red-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              <LogOut size={24} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
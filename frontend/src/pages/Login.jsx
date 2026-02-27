import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import './Login.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loginuser } from '../redux/slices/authSlice.js';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
    
  useEffect(() => {
      if (isAuthenticated) navigate('/');
    }, [isAuthenticated]);

    
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginuser({ email, password }));
  };


  return (
    <div className="bg-[#0a0a09] w-full min-h-screen md:min-h-[calc(100vh-6rem)] flex items-center justify-center p-6 pb-32 md:pb-6 overflow-x-hidden">
      
      <div className="clay-card max-w-md w-full p-8 md:p-10 space-y-6 flex flex-col justify-center
                      transition-transform duration-500 
                      hover:shadow-[0_0_50px_rgba(149,142,98,0.1)]
                      2xl:scale-110 3xl:scale-125">
        
        {/* Minimal Header */}
        <div className="text-center">
          <div className="mb-2 inline-block p-2 clay-input rounded-xl">
            <img src="/src/assets/logo.png" alt="Obsidian" className="h-8 w-auto" />
          </div>
          <h1 className="font-['Baskervville'] italic text-3xl md:text-2xl text-[#E7E7D9]">
            Obsidian
          </h1>
          <p className="font-['JetBrains_Mono'] text-[#958E62] text-[8px] md:text-[7px] uppercase tracking-[0.4em] mt-2 leading-none">
            Luxury Timepieces
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3 md:space-y-2">
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e)=>{setEmail(e.target.value)}}
              required
              placeholder="Email"
              className="clay-input w-full px-6 py-3 md:py-2 text-[#FFF7C4] font-['JetBrains_Mono'] placeholder:text-[#3d3b30] text-sm focus:outline-none focus:border-[#958E62]/50 transition-all"
            />
            
            <div className="relative">
              <input
                name="password"
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                className="clay-input w-full px-6 py-3 md:py-2 text-[#FFF7C4] font-['JetBrains_Mono'] placeholder:text-[#3d3b30] text-sm pr-12 focus:outline-none focus:border-[#958E62]/50 transition-all"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a483a] hover:text-[#DED5A4] transition-colors p-2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && (
            <p className="font-['JetBrains_Mono'] text-red-400 text-[9px] uppercase tracking-widest text-center">
              {error}
            </p>
          )}
          <button type="submit" disabled={loading} 
            className="clay-button w-full py-4 font-bold uppercase tracking-[0.2em] text-[10px] active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed">
                          { loading ? 'Signing in..' : 'Login' }
          </button>
        </form>

        {/* OAuth Section */}
        <div className="space-y-5 md:space-y-4">
          <div className="relative flex items-center justify-center">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#2b2a22]"></div></div>
             <span className="relative bg-[#393904] px-4 text-[#b0ab7e] text-[8px] font-['JetBrains_Mono'] uppercase tracking-widest">OR</span>
          </div>

          <a 
            href={`${BACKEND_URL}/user/auth/google`}
            className="clay-google w-full py-4 md:py-3 flex items-center justify-center gap-4 group no-underline rounded-full border border-white/5 hover:bg-white/5 transition-all"
          >
            <div className="p-1 bg-white/5 rounded-full group-hover:bg-white/20 transition-colors">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-4 h-4  opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#958E62] group-hover:text-[#eae0a8] uppercase tracking-[0.2em]">
              Google Access
            </span>
          </a>
        </div>

        {/* Signup Footer */}
        <div className="flex justify-center pt-4 border-t border-white/5">
          <Link to="/signup" className="text-[#958E62] hover:text-[#DED5A4] text-[10px] uppercase tracking-widest transition-colors">
            New Client? <span className="font-bold underline underline-offset-4 ml-1">Register</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
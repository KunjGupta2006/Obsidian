import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User } from 'lucide-react';
import './Login.css';
import { signupuser } from '../redux/slices/authSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const BACKEND_URL=import.meta.env.VITE_BACKEND_URL;

  const [fullname,setFullname]=useState('');
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
    dispatch(signupuser({ email, password }));
  };

  return (
    <div className="bg-[#0a0a09] w-full h-[calc(100vh-8rem)] flex items-center justify-center p-6 overflow-hidden">
      
      {/* The Card - Optimized for all screens up to 4K */}
      <div className="clay-card max-w-md w-full p-8 md:p-10 space-y-6 flex flex-col justify-center
                      transition-transform duration-500 
                      2xl:scale-110 3xl:scale-125">
        
        {/* Minimal Header */}
        <div className="text-center">
          <div className="mb-1 inline-block p-2 clay-input">
            <img src="/src/assets/logo.png" alt="Obsidian" className="h-8 w-auto" />
          </div>
          <h1 className="font-['Baskervville'] italic text-2xl text-[#E7E7D9]">
            Obsidian
          </h1>
          <p className="font-['JetBrains_Mono'] text-[#958E62] text-[7px] uppercase tracking-[0.4em] mt-1 leading-none">
            Luxury Timepieces
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {/* Full Name Field */}
            <input
              name="fullname"
              type="text"
              value={fullname}
              onChange={(e)=>{setFullname(e.target.value)}}
              required
              placeholder="Full Name"
              className="clay-input w-full px-6 py-2 text-[#FFF7C4] font-['JetBrains_Mono'] placeholder:text-[#3d3b30] text-sm"
            />

            {/* Email Field */}
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e)=>{setEmail(e.target.value)}}
              required
              placeholder="Email Address"
              className="clay-input w-full px-6 py-2 text-[#FFF7C4] font-['JetBrains_Mono'] placeholder:text-[#3d3b30] text-sm"
            />
            
            {/* Password Field with Toggle */}
            <div className="relative">
              <input
                name="password"
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}
                type={showPassword ? "text" : "password"}
                required
                placeholder="Create Password"
                className="clay-input w-full px-6 py-2 text-[#FFF7C4] font-['JetBrains_Mono'] placeholder:text-[#3d3b30] text-sm pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a483a] hover:text-[#DED5A4] transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {error && (
            <p className="font-['JetBrains_Mono'] text-red-400 text-[9px] uppercase tracking-widest text-center">
              {error}
            </p>
          )}
          <button type="submit" disabled={loading}  
          className="clay-button w-full py-4 font-bold uppercase tracking-[0.2em] text-[10px] cursor-pointer">
            { loading ? 'Signing up..' : 'Create Account' }
          </button>
        </form>

        {/* OAuth Section */}
        <div className="space-y-4">
          <div className="relative flex items-center justify-center">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#2b2a22]"></div></div>
             <span className="relative bg-[#1e1d17] px-4 text-[#4a483a] text-[8px] font-['JetBrains_Mono'] uppercase">OR</span>
          </div>

          <a 
            href={`${BACKEND_URL}/user/auth/google`}
            className="clay-google w-full py-3 flex items-center justify-center gap-4 group no-underline"
          >
            <div className="p-1 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-4 h-3 grayscale opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#958E62] group-hover:text-[#DED5A4] uppercase tracking-[0.2em]">
              Join with Google
            </span>
          </a>
        </div>

        {/* Login Redirect */}
        <div className="flex justify-center pt-2">
          <Link to="/login" className="clay-link text-[10px] uppercase tracking-widest">
            Existing Client? <span className="text-[#DED5A4] font-bold">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
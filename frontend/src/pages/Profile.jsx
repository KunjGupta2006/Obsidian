import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  User, ShoppingBag, Heart, Package, LogOut,
  ChevronRight, Edit3, Check, X, Lock, Eye, EyeOff
} from 'lucide-react';
import { logoutuser, updateProfile, changePassword } from '../redux/slices/authSlice.js';

// ── STAT CARD ────────────────────────────────────────────
const StatCard = ({ label, value, to, icon: Icon , color }) => (
  <Link
    to={to}
    className="group relative flex flex-col gap-3 p-5 rounded-2xl
               bg-[#0d0d0c] border border-white/5
               hover:border-[#958E62]/25 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)]
               transition-all duration-400 overflow-hidden"
  >
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                     ${color} border transition-colors duration-300`}>
  {React.createElement(Icon, { size: 16 })}
    </div>
    <div>
      <p className="font-['Baskervville'] italic text-2xl text-white">{value}</p>
      <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.3em] text-white/30 mt-0.5">
        {label}
      </p>
    </div>
    <ChevronRight
      size={14}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/15
                 group-hover:text-[#958E62]/50 group-hover:translate-x-1
                 transition-all duration-300"
    />
    <div className="absolute bottom-0 left-0 w-full h-px
                    bg-linear-to-r from-transparent via-[#958E62]/10 to-transparent" />
  </Link>
);

// ── NAV LINK ─────────────────────────────────────────────
const NavLink = ({ to, icon: Icon, label, sub, danger }) => (
  <Link
    to={to}
    className={`group flex items-center gap-4 px-5 py-4 rounded-2xl
                border transition-all duration-300
                ${danger
                  ? 'border-transparent text-red-400/40 hover:bg-red-400/5 hover:border-red-400/15 hover:text-red-400/70'
                  : 'border-white/5 bg-[#0d0d0c] hover:border-[#958E62]/20 hover:bg-[#0f0f0e]'
                }`}
  >
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center 
    shrink-0
                     border transition-colors duration-300
                     ${danger
                       ? 'border-red-400/15 text-red-400/40 group-hover:border-red-400/30 group-hover:text-red-400/70'
                       : 'border-white/8 text-[#958E62]/60 group-hover:border-[#958E62]/30 group-hover:text-[#958E62]'
                     }`}>
  {React.createElement(Icon, { size: 15 })}
    </div>
    <div className="flex-1 min-w-0">
      <p className={`font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em]
                     ${danger ? '' : 'text-white/70 group-hover:text-white'} transition-colors`}>
        {label}
      </p>
      {sub && (
        <p className="font-['Playfair_Display'] italic text-xs text-white/25 mt-0.5 truncate">
          {sub}
        </p>
      )}
    </div>
    {!danger && (
      <ChevronRight size={13} className="text-white/15 group-hover:text-[#958E62]/40
                                         group-hover:translate-x-0.5 transition-all duration-300 
                                         shrink-0" />
    )}
  </Link>
);


// ── PROFILE PAGE ─────────────────────────────────────────
const Profile = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const { user, loading }          = useSelector((state) => state.auth);
  const { items: cartItems }       = useSelector((state) => state.cart);
  const { items: wishlistItems }   = useSelector((state) => state.wishlist);

  // edit profile state
  const [editMode,  setEditMode]  = useState(false);
  const [fullname,  setFullname]  = useState(user?.fullname || '');
  const [saveMsg,   setSaveMsg]   = useState('');

  // change password state
  const [pwOpen,      setPwOpen]      = useState(false);
  const [currentPw,   setCurrentPw]   = useState('');
  const [newPw,       setNewPw]       = useState('');
  const [confirmPw,   setConfirmPw]   = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [pwMsg,       setPwMsg]       = useState('');
  const [pwErr,       setPwErr]       = useState('');

  if (!user) return null;

  const initials = user.fullname
    ? user.fullname.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.[0].toUpperCase();

  // ── SAVE PROFILE ──
  const handleSaveProfile = () => {
    if (!fullname.trim()) return;
    dispatch(updateProfile({ fullname })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setSaveMsg('Saved');
        setEditMode(false);
        setTimeout(() => setSaveMsg(''), 2500);
      }
    });
  };

  // ── CHANGE PASSWORD ──
  const handleChangePassword = () => {
    setPwErr('');
    if (!currentPw || !newPw || !confirmPw) { setPwErr('All fields required'); return; }
    if (newPw !== confirmPw)                { setPwErr('Passwords do not match'); return; }
    if (newPw.length < 6)                  { setPwErr('Min 6 characters'); return; }
    dispatch(changePassword({ currentPassword: currentPw, newPassword: newPw })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setPwMsg('Password updated');
        setPwOpen(false);
        setCurrentPw(''); setNewPw(''); setConfirmPw('');
        setTimeout(() => setPwMsg(''), 3000);
      } else {
        setPwErr(res.payload || 'Failed to update password');
      }
    });
  };

  // ── LOGOUT ──
  const handleLogout = () => {
    dispatch(logoutuser()).then(() => navigate('/'));
  };

  return (
    <div className="bg-[#0a0a09] min-h-screen text-[#E7E7D9]
                    pt-24 md:pt-28 pb-36 md:pb-16 px-4 md:px-10
                    selection:bg-[#958E62] selection:text-black">
      <div className="max-w-5xl mx-auto">

        {/* ── HERO SECTION ── */}
        <div className="relative mb-10 p-7 md:p-10 rounded-3xl
                        bg-[#0d0d0c] border border-white/5 overflow-hidden">

          {/* bg texture */}
          <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
               style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #958E62 0%, transparent 60%), radial-gradient(circle at 80% 50%, #958E62 0%, transparent 60%)' }} />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">

            {/* avatar */}
            <div className="relative 
            shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full
                              bg-[#958E62]/15 border-2 border-[#958E62]/30
                              flex items-center justify-center
                              shadow-[0_0_32px_rgba(149,142,98,0.15)]">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.fullname}
                       className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="font-['Baskervville'] italic text-3xl text-[#958E62]">
                    {initials}
                  </span>
                )}
              </div>
              {/* role badge */}
              <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full
                              font-['JetBrains_Mono'] text-[7px] uppercase tracking-widest
                              bg-[#0a0a09] border border-[#958E62]/25 text-[#958E62]/70">
                {user.role}
              </div>
            </div>

            {/* name + email */}
            <div className="flex-1 min-w-0">
              {editMode ? (
                <div className="flex items-center gap-2">
                  <input
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="bg-transparent border-b border-[#958E62]/40 text-white
                               font-['Baskervville'] italic text-2xl md:text-3xl
                               focus:outline-none focus:border-[#958E62]/70 w-full max-w-xs"
                    autoFocus
                  />
                  <button onClick={handleSaveProfile} disabled={loading}
                          className="w-8 h-8 rounded-full bg-[#958E62]/15 border border-[#958E62]/30
                                     flex items-center justify-center text-[#958E62]
                                     hover:bg-[#958E62]/25 transition-all cursor-pointer">
                    <Check size={13} />
                  </button>
                  <button onClick={() => { setEditMode(false); setFullname(user.fullname || ''); }}
                          className="w-8 h-8 rounded-full bg-white/5 border border-white/10
                                     flex items-center justify-center text-white/40
                                     hover:text-white/70 transition-all cursor-pointer">
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h1 className="font-['Baskervville'] italic text-2xl md:text-4xl text-white truncate">
                    {user.fullname || 'Anonymous'}
                  </h1>
                  <button onClick={() => setEditMode(true)}
                          className="text-white/20 hover:text-[#958E62] transition-colors cursor-pointer 
                          shrink-0">
                    <Edit3 size={14} />
                  </button>
                </div>
              )}
              <p className="font-['JetBrains_Mono'] text-[9px] tracking-widest text-white/30 mt-1">
                {user.email}
              </p>
              {saveMsg && (
                <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-widest text-[#4ade80]/70 mt-1">
                  ✦ {saveMsg}
                </p>
              )}
              {pwMsg && (
                <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-widest text-[#4ade80]/70 mt-1">
                  ✦ {pwMsg}
                </p>
              )}
            </div>

            {/* member since */}
            <div className="text-right 
            shrink-0 hidden md:block">
              <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.4em] text-white/20 mb-1">
                Member Since
              </p>
              <p className="font-['Playfair_Display'] italic text-sm text-white/45">
                {new Date(user.createdAt).toLocaleDateString('en-GB', {
                  month: 'long', year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-px
                          bg-linear-to-r from-transparent via-[#958E62]/15 to-transparent" />
        </div>

        {/* ── STATS GRID ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard
            label="Orders"
            value={user.purchaseHistory?.length || 0}
            to="/orders"
            icon={Package}
            color="bg-[#958E62]/10 border-[#958E62]/25 text-[#958E62]"
          />
          <StatCard
            label="In Cart"
            value={cartItems.length}
            to="/cart"
            icon={ShoppingBag}
            color="bg-blue-400/8 border-blue-400/20 text-blue-400/70"
          />
          <StatCard
            label="Wishlist"
            value={wishlistItems.length}
            to="/wishlist"
            icon={Heart}
            color="bg-rose-400/8 border-rose-400/20 text-rose-400/70"
          />
          <StatCard
            label="Account type"
            value={user.role === 'admin' ? 'Admin' : 'Client'}
            to="/profile"
            icon={User}
            color="bg-white/5 border-white/10 text-white/40"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-3">

            {/* section label */}
            <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.4em] text-white/20 px-1">
              My Account
            </p>

            <NavLink
              to="/orders"
              icon={Package}
              label="My Orders"
              sub={`${user.purchaseHistory?.length || 0} acquisitions`}
            />
            <NavLink
              to="/cart"
              icon={ShoppingBag}
              label="My Cart"
              sub={cartItems.length > 0 ? `${cartItems.length} item${cartItems.length > 1 ? 's' : ''} waiting` : 'Empty'}
            />
            <NavLink
              to="/wishlist"
              icon={Heart}
              label="Wishlist"
              sub={wishlistItems.length > 0 ? `${wishlistItems.length} saved piece${wishlistItems.length > 1 ? 's' : ''}` : 'Nothing saved yet'}
            />
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-3">

            <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.4em] text-white/20 px-1">
              Security
            </p>

            {/* change password toggle */}
            <div className="rounded-2xl bg-[#0d0d0c] border border-white/5 overflow-hidden">
              <button
                onClick={() => { setPwOpen(!pwOpen); setPwErr(''); }}
                className="w-full flex items-center gap-4 px-5 py-4
                           hover:bg-[#0f0f0e] transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center
                                border border-white/8 text-[#958E62]/60
                                group-hover:border-[#958E62]/30 group-hover:text-[#958E62]
                                transition-colors 
                                shrink-0">
                  <Lock size={15} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em]
                                text-white/70 group-hover:text-white transition-colors">
                    Change Password
                  </p>
                  <p className="font-['Playfair_Display'] italic text-xs text-white/25 mt-0.5">
                    Update your security credentials
                  </p>
                </div>
                <ChevronRight
                  size={13}
                  className={`text-white/15 transition-all duration-300 
                    shrink-0
                    ${pwOpen ? 'rotate-90 text-[#958E62]/40' : 'group-hover:text-[#958E62]/40 group-hover:translate-x-0.5'}`}
                />
              </button>

              {/* password form */}
              {pwOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-white/5 space-y-4">

                  {/* current password */}
                  <div>
                    <label className="block font-['JetBrains_Mono'] text-[8px] uppercase
                                      tracking-[0.35em] text-[#958E62]/60 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        value={currentPw}
                        onChange={(e) => setCurrentPw(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 pr-10 rounded-xl
                                   bg-[#111110] border border-white/8 text-white
                                   font-['Playfair_Display'] italic text-sm placeholder:text-white/15
                                   focus:outline-none focus:border-[#958E62]/40 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25
                                   hover:text-white/50 transition-colors cursor-pointer"
                      >
                        {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* new password */}
                  <div>
                    <label className="block font-['JetBrains_Mono'] text-[8px] uppercase
                                      tracking-[0.35em] text-[#958E62]/60 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNew ? 'text' : 'password'}
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full px-4 py-3 pr-10 rounded-xl
                                   bg-[#111110] border border-white/8 text-white
                                   font-['Playfair_Display'] italic text-sm placeholder:text-white/15
                                   focus:outline-none focus:border-[#958E62]/40 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25
                                   hover:text-white/50 transition-colors cursor-pointer"
                      >
                        {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* confirm password */}
                  <div>
                    <label className="block font-['JetBrains_Mono'] text-[8px] uppercase
                                      tracking-[0.35em] text-[#958E62]/60 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full px-4 py-3 rounded-xl
                                 bg-[#111110] border border-white/8 text-white
                                 font-['Playfair_Display'] italic text-sm placeholder:text-white/15
                                 focus:outline-none focus:border-[#958E62]/40 transition-all"
                    />
                  </div>

                  {pwErr && (
                    <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-widest text-red-400/60">
                      {pwErr}
                    </p>
                  )}

                  <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="w-full py-3 rounded-full
                               font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.3em] font-bold
                               bg-[#958E62] text-[#0a0a09] border border-[#958E62]
                               hover:bg-[#C2B994] hover:border-[#C2B994]
                               hover:-translate-y-0.5 transition-all duration-300
                               cursor-pointer disabled:opacity-40"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              )}
            </div>

            {/* logout */}
            <button
              onClick={handleLogout}
              className="group flex items-center gap-4 px-5 py-4 rounded-2xl
                         border border-transparent text-red-400/40
                         hover:bg-red-400/5 hover:border-red-400/15 hover:text-red-400/70
                         transition-all duration-300 cursor-pointer w-full text-left"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center 
              shrink-0
                              border border-red-400/15 text-red-400/40
                              group-hover:border-red-400/30 group-hover:text-red-400/70
                              transition-colors">
                <LogOut size={15} />
              </div>
              <div>
                <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em]">
                  Sign Out
                </p>
                <p className="font-['Playfair_Display'] italic text-xs text-red-400/30 mt-0.5">
                  End your current session
                </p>
              </div>
            </button>

          </div>
        </div>

        {/* admin shortcut */}
        {user.role === 'admin' && (
          <div className="mt-5">
            <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.4em] text-white/20 px-1 mb-3">
              Administration
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Dashboard',  to: '/admin/dashboard' },
                { label: 'Products',   to: '/admin/products'  },
                { label: 'Orders',     to: '/admin/orders'    },
                { label: 'Users',      to: '/admin/users'     },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center justify-between px-4 py-3 rounded-xl
                             bg-[#0d0d0c] border border-white/5
                             hover:border-[#958E62]/20 hover:bg-[#0f0f0e]
                             transition-all duration-300 group"
                >
                  <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.25em] text-white/40
                                   group-hover:text-white/70 transition-colors">
                    {item.label}
                  </span>
                  <ChevronRight size={12} className="text-white/15 group-hover:text-[#958E62]/40
                                                      group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
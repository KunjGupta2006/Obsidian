import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, updateUserRole, deleteUser } from '../redux/slices/adminSlice.js';
import { Search, ChevronLeft, ChevronRight, X, AlertTriangle, Users } from 'lucide-react';

const RoleModal = ({ user, onClose, onUpdated }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.admin);
  const [role,  setRole]  = useState(user.role);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    const res = await dispatch(updateUserRole({ userId: user._id, role }));
    if (res.meta.requestStatus === 'fulfilled') onUpdated();
    else setError(res.payload || 'Failed to update role');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#0d0d0c] border border-[#958E62]/25 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5 border-b border-white/5">
          <div>
            <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.4em] text-[#958E62]/60">Change Role</p>
            <h2 className="font-['Baskervville'] italic text-xl text-white mt-0.5">{user.fullname}</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all cursor-pointer">
            <X size={15} />
          </button>
        </div>
        <div className="px-7 py-6 space-y-4">
          <div className="flex gap-3">
            {['client', 'admin'].map((r) => (
              <button key={r} onClick={() => setRole(r)}
                      className={`flex-1 py-3 rounded-full font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest border transition-all cursor-pointer
                        ${role === r ? 'bg-[#958E62] text-[#0a0a09] border-[#958E62]' : 'border-white/10 text-white/40 hover:border-[#958E62]/30'}`}>
                {r}
              </button>
            ))}
          </div>
          {error && <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-widest text-red-400/70">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button onClick={handleSubmit} disabled={loading || role === user.role}
                    className="flex-1 py-3.5 rounded-full font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest font-bold bg-[#958E62] text-[#0a0a09] border border-[#958E62] hover:bg-[#C2B994] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer disabled:opacity-40">
              {loading ? 'Saving...' : 'Save Role'}
            </button>
            <button onClick={onClose} className="px-6 py-3.5 rounded-full font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest border border-white/10 text-white/40 hover:border-white/25 hover:text-white/70 transition-all cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteUserModal = ({ user, onClose, onDeleted }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.admin);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setError('');
    const res = await dispatch(deleteUser(user._id));
    if (res.meta.requestStatus === 'fulfilled') onDeleted();
    else setError(res.payload || 'Failed to delete user');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0d0d0c] border border-red-400/20 rounded-3xl p-8 shadow-[0_32px_80px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl border border-red-400/20 bg-red-400/5 flex items-center justify-center">
            <AlertTriangle size={16} className="text-red-400/60" />
          </div>
          <div>
            <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-widest text-red-400/50">Confirm Deletion</p>
            <h3 className="font-['Baskervville'] italic text-xl text-white">Delete User</h3>
          </div>
        </div>
        <p className="font-['Playfair_Display'] italic text-sm text-white/40 mb-6 leading-relaxed">
          Are you sure you want to permanently delete <span className="text-white/70">{user.fullname}</span> ({user.email})? This cannot be undone.
        </p>
        {error && <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-widest text-red-400/70 mb-4">{error}</p>}
        <div className="flex gap-3">
          <button onClick={handleDelete} disabled={loading}
                  className="flex-1 py-3 rounded-full font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest bg-red-400/10 border border-red-400/25 text-red-400/70 hover:bg-red-400/20 hover:border-red-400/40 transition-all cursor-pointer disabled:opacity-40">
            {loading ? 'Deleting...' : 'Delete'}
          </button>
          <button onClick={onClose} className="flex-1 py-3 rounded-full font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest border border-white/10 text-white/40 hover:border-white/25 hover:text-white/70 transition-all cursor-pointer">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { allUsers: users, loading, pagination } = useSelector((s) => s.admin);
  const { user: currentUser } = useSelector((s) => s.auth);
  const [search,     setSearch]     = useState('');
  const [page,       setPage]       = useState(1);
  const [roleUser,   setRoleUser]   = useState(null);
  const [deleteUsr,  setDeleteUsr]  = useState(null);

  const load = (p = 1, s = search) => {
    dispatch(fetchAllUsers({ page: p, limit: 20, search: s || undefined }));
  };

  useEffect(() => { load(1); }, []);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); load(1, search); };
  const handleRoleUpdated = () => { setRoleUser(null); load(page); };
  const handleDeleted     = () => { setDeleteUsr(null); load(page); };

  const initials = (u) => u.fullname
    ? u.fullname.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : u.email?.[0].toUpperCase();

  return (
    <div className="bg-[#0a0a09] min-h-screen text-[#E7E7D9] pt-24 md:pt-28 pb-20 px-4 md:px-10 selection:bg-[#958E62] selection:text-black">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.5em] text-[#958E62] mb-2">Admin · Users</p>
          <h1 className="font-['Baskervville'] italic text-4xl md:text-5xl text-white">Members</h1>
          {pagination?.total !== undefined && (
            <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.3em] text-white/20 mt-1">{pagination.total} registered members</p>
          )}
        </div>

        <form onSubmit={handleSearch} className="relative mb-6 max-w-md">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..."
                 className="w-full pl-10 pr-4 py-3 rounded-full bg-[#0d0d0c] border border-white/8 text-white font-['Playfair_Display'] italic text-sm placeholder:text-white/20 focus:outline-none focus:border-[#958E62]/40 transition-all" />
        </form>

        {loading && users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-8 h-8 border border-[#958E62]/20 border-t-[#958E62] rounded-full animate-spin" />
            <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.4em] text-[#958E62]/50">Loading Members</p>
          </div>
        )}

        {users.length > 0 && (
          <div className="rounded-2xl border border-white/5 overflow-hidden">
            <div className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-[#0d0d0c] border-b border-white/5">
              {['Member', 'Email', 'Role', 'Joined', ''].map((h) => (
                <p key={h} className="font-['JetBrains_Mono'] text-[7px] uppercase tracking-[0.35em] text-white/25">{h}</p>
              ))}
            </div>
            {users.map((u) => {
              const isSelf = u._id === currentUser?._id;
              return (
                <div key={u._id}
                     className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 items-center px-5 py-4 border-b border-white/4 last:border-0 bg-[#0a0a09] hover:bg-[#0d0d0c] transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#958E62]/10 border border-[#958E62]/20 flex items-center justify-center shrink-0">
                      {u.avatar
                        ? <img src={u.avatar} alt={u.fullname} className="w-full h-full rounded-full object-cover" />
                        : <span className="font-['Baskervville'] italic text-sm text-[#958E62]">{initials(u)}</span>
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="font-['Playfair_Display'] italic text-sm text-white/80 truncate">{u.fullname}</p>
                      {isSelf && (
                        <span className="font-['JetBrains_Mono'] text-[7px] uppercase tracking-widest text-[#958E62]/50">You</span>
                      )}
                    </div>
                  </div>
                  <p className="font-['JetBrains_Mono'] text-[9px] text-white/30 tracking-wide truncate">{u.email}</p>
                  <span className={`inline-flex px-2.5 py-1 rounded-full border font-['JetBrains_Mono'] text-[7px] uppercase tracking-widest w-fit
                    ${u.role === 'admin'
                      ? 'bg-[#958E62]/10 border-[#958E62]/25 text-[#958E62]/80'
                      : 'bg-white/5 border-white/10 text-white/35'}`}>
                    {u.role}
                  </span>
                  <p className="font-['Playfair_Display'] italic text-xs text-white/30">
                    {new Date(u.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                  </p>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isSelf && (
                      <>
                        <button onClick={() => setRoleUser(u)}
                                className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-[#958E62]/25 text-[#958E62]/60 hover:bg-[#958E62]/10 hover:text-[#958E62] transition-all cursor-pointer">
                          Role
                        </button>
                        <button onClick={() => setDeleteUsr(u)}
                                className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-red-400/15 text-red-400/40 hover:bg-red-400/5 hover:border-red-400/30 hover:text-red-400/70 transition-all cursor-pointer">
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="py-28 border border-white/5 rounded-3xl bg-[#0d0d0c] flex flex-col items-center justify-center gap-4">
            <Users size={28} className="text-white/10" strokeWidth={1} />
            <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.4em] text-white/20">No members found</p>
          </div>
        )}

        {pagination?.pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button disabled={page === 1} onClick={() => { setPage(page - 1); load(page - 1); }}
                    className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-[#958E62]/40 hover:text-[#958E62] disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer">
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => { setPage(p); load(p); }}
                      className={`w-9 h-9 rounded-full border font-['JetBrains_Mono'] text-[9px] transition-all cursor-pointer ${page === p ? 'bg-[#958E62] text-[#0a0a09] border-[#958E62]' : 'border-white/10 text-white/40 hover:border-[#958E62]/40 hover:text-[#958E62]'}`}>
                {p}
              </button>
            ))}
            <button disabled={page === pagination.pages} onClick={() => { setPage(page + 1); load(page + 1); }}
                    className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-[#958E62]/40 hover:text-[#958E62] disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer">
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {roleUser  && <RoleModal       user={roleUser}  onClose={() => setRoleUser(null)}  onUpdated={handleRoleUpdated} />}
      {deleteUsr && <DeleteUserModal user={deleteUsr} onClose={() => setDeleteUsr(null)} onDeleted={handleDeleted}     />}
    </div>
  );
};

export default AdminUsers;
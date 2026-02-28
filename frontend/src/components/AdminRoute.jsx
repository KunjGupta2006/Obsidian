import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border border-[#958E62]/20 border-t-[#958E62] rounded-full animate-spin" />
      <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.5em] text-[#958E62]/50">
        Authenticating
      </p>
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;

  return <Outlet />;
};

export default AdminRoute;
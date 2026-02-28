import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // wait for fetchCurrentUser to resolve before deciding
  if (loading) return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border border-[#958E62]/20 border-t-[#958E62] rounded-full animate-spin" />
      <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.5em] text-[#958E62]/50">
        Authenticating
      </p>
    </div>
  );

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;



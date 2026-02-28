import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  fetchDashboardStats, 
  fetchMonthlyRevenue 
} from '../redux/slices/adminSlice.js';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, Users, Package, ShoppingBag, 
  AlertTriangle, ArrowUpRight, ChevronRight, Activity 
} from 'lucide-react';


const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, monthlyRevenue, loading } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchMonthlyRevenue(new Date().getFullYear()));
  }, [dispatch]);
  const navigate = useNavigate();

  // --- LOADING STATE ---
  if (loading && !stats) return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col items-center justify-center gap-6">
      <div className="w-12 h-12 border-t-2 border-[#958E62] rounded-full animate-spin" />
      <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.5em] text-[#958E62]/60">
        Syncing Command Center
      </span>
    </div>
  );

  const topStats = [
    { label: 'Total Revenue', val: `$${Number(stats?.stats?.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-[#958E62]' },
    { label: 'Client Base', val: stats?.stats?.totalUsers || 0, icon: Users, color: 'text-blue-400' },
    { label: 'Acquisitions', val: stats?.stats?.totalOrders || 0, icon: ShoppingBag, color: 'text-[#4ade80]' },
    { label: 'Registry Size', val: stats?.stats?.totalWatches || 0, icon: Package, color: 'text-purple-400' },
  ];

  // Map monthly data for the chart
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueChartData = monthlyRevenue?.map(item => ({
    name: monthNames[item.month - 1],
    revenue: item.revenue,
    orders: item.orders
  }));

  const fmt = (n) => Number(n).toLocaleString('en-US');

  return (
    <div className="bg-[#0a0a09] min-h-screen text-[#E7E7D9] pt-28 pb-32 px-6 md:px-12 selection:bg-[#958E62] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ── HEADER ── */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.6em] text-[#958E62] mb-3">Master Control</p>
            <h1 className="font-['Baskervville'] italic text-5xl md:text-6xl text-white">Dashboard</h1>
          </div>
          <div className="bg-[#0d0d0c] border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
            <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest text-white/40">
              Systems Operational · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* ── TOP METRICS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topStats.map((s, i) => (
            <div key={i} className="group p-8 rounded-[2.5rem] bg-[#0d0d0c] border border-white/5 hover:border-[#958E62]/30 transition-all duration-700 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#958E62]/10 to-transparent" />
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-center ${s.color}`}>
                  <s.icon size={22} strokeWidth={1.5} />
                </div>
                <ArrowUpRight size={14} className="text-white/10 group-hover:text-[#958E62] transition-colors" />
              </div>
              <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.4em] text-white/30 mb-2">{s.label}</p>
              <h3 className="font-['Baskervville'] italic text-3xl text-white group-hover:text-[#DED5A4] transition-colors">{s.val}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ── REVENUE TRAJECTORY CHART ── */}
          <div className="lg:col-span-8 p-8 md:p-10 rounded-[3rem] bg-[#0d0d0c] border border-white/5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="font-['Baskervville'] italic text-2xl text-white">Revenue Trajectory</h2>
                <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-white/20 mt-1">Annual Performance Ledger</p>
              </div>
              <Activity size={18} className="text-[#958E62]/40" />
            </div>

            <div className="h-87.5 w-full">
              <ResponsiveContainer minHeight={0} minWidth={0} width="100%" height="100%">
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#958E62" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#958E62" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" vertical={false} opacity={0.03} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#ffffff33', fontSize: 10, fontFamily: 'JetBrains Mono'}} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#ffffff33', fontSize: 10, fontFamily: 'JetBrains Mono'}}
                  />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#0d0d0c', border: '1px solid #ffffff1a', borderRadius: '20px', padding: '15px'}}
                    itemStyle={{fontFamily: 'JetBrains Mono', fontSize: '11px', textTransform: 'uppercase'}}
                    cursor={{ stroke: '#958E62', strokeWidth: 1, strokeDasharray: '5 5' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#958E62" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── STOCK ALERTS ── */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 rounded-[3rem] bg-[#0d0d0c] border border-white/5 h-full">
              <div className="flex items-center gap-3 mb-8">
                <AlertTriangle size={18} className="text-amber-400/60" />
                <h2 className="font-['Baskervville'] italic text-2xl text-white">Stock Alerts</h2>
              </div>

              <div className="space-y-4">
                {stats?.lowStockWatches?.length > 0 ? (
                  stats.lowStockWatches.map((w) => (
                    <div key={w._id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-all group">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/5 shrink-0 bg-black">
                        <img src={w.image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-['Baskervville'] italic text-sm text-white/80 truncate">{w.title}</p>
                        <p className="font-['JetBrains_Mono'] text-[9px] uppercase text-[#958E62] mt-0.5">{w.quantity} units remaining</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="font-['JetBrains_Mono'] text-[10px] text-white/20 uppercase text-center py-10">Inventory healthy</p>
                )}
              </div>

              <Link to="/admin/products" className="flex items-center justify-between w-full mt-8 p-4 rounded-2xl border border-white/5 font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-white/30 hover:text-[#958E62] hover:border-[#958E62]/20 transition-all group">
                Manage Registry <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── RECENT ACQUISITIONS ── */}
        <div className="p-8 md:p-10 rounded-[3rem] bg-[#0d0d0c] border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between mb-10">
             <h2 className="font-['Baskervville'] italic text-3xl text-white">Recent Acquisitions</h2>
             <Link to="/admin/orders" className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-[#958E62] hover:text-white transition-colors">
               View Full Registry
             </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  {['Reference', 'Client', 'Investment', 'Status', 'Date'].map((h) => (
                    <th key={h} className="pb-6 font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.4em] text-white/20 font-light">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/3">
                {stats?.recentOrders?.map((order) => (

                <tr 
                    key={order._id} 
                    onClick={() => navigate(`/admin/orders/${order._id}`)} // Or specific order detail if you have it
                    className="group hover:bg-white/2 transition-all duration-500 cursor-pointer relative"
                    >
                    <td className="py-6 font-['JetBrains_Mono'] text-[11px] text-[#958E62] uppercase">№ {order._id.slice(-8)}</td>
                    <td className="py-6">
                       <p className="font-['Playfair_Display'] italic text-sm text-white/80">{order.user?.fullname}</p>
                       <p className="font-['JetBrains_Mono'] text-[8px] text-white/20 uppercase tracking-tighter">{order.user?.email}</p>
                    </td>
                    <td className="py-6 font-['Playfair_Display'] italic text-base text-[#DED5A4]">${fmt(order.totalAmount)}</td>
                    <td className="py-6">
                      <span className="px-3 py-1 rounded-full border border-white/10 font-['JetBrains_Mono'] text-[8px] uppercase text-white/40 tracking-widest">{order.orderStatus}</span>
                    </td>
                    <td className="py-6 font-['JetBrains_Mono'] text-[10px] text-white/20">
                      {new Date(order.createdAt).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
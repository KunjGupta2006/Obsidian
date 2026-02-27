import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './includes/Navbar.jsx';
import Collections from './pages/Collections.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Home from './pages/Home.jsx';
import NotFound from './components/NotFound.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchCurrentUser } from './redux/slices/authSlice.js';
import Cart from "./pages/Cart.jsx";
import ProductDetail from './pages/ProductDetail.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Checkout from './pages/Checkout.jsx';


function App() {
  const dispatch=useDispatch();

  const { sessionChecked }=useSelector((state)=>state.auth);
useEffect(() => {
  dispatch(fetchCurrentUser());
}, []);
    if(!sessionChecked) return null;

  return(
    <Router>
      <div className="min-h-screen bg-[#1a1a14]">
        <Navbar />
        <Routes>

          {/* ─── Public ───────────────────────────────── */}
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          {/* <Route path="/collections/:category" element={<Collections />} />
          <Route path="/search" element={<Search />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />

          {/* ─── Protected (logged in users only) ────── */}
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          {/* <Route element={<ProtectedRoute />}>
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Route> */}

          {/* ─── Admin (admin role only) ──────────────── */}
          {/* <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route> */}

          {/* ─── Fallback ─────────────────────────────── */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
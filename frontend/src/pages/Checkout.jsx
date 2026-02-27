import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, Package, ChevronRight, Lock, AlertCircle } from 'lucide-react';
import { placeOrder } from '../redux/slices/orderSlice';

// ── FIELD COMPONENT ───────────────────────────
const Field = ({ label, name, value, onChange, type = 'text', placeholder, required, half }) => (
  <div className={half ? 'col-span-1' : 'col-span-2'}>
    <label className="block font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.4em] text-[#958E62] mb-3 opacity-80">
      {label} {required && <span className="text-[#958E62] ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-5 py-4 rounded-xl
                 bg-[#0d0d0c] border border-white/10 text-[#E7E7D9]
                 font-['Playfair_Display'] italic text-base placeholder:text-white/10
                 focus:outline-none focus:border-[#958E62]/60 focus:bg-[#111110]
                 hover:border-white/20 transition-all duration-500"
    />
  </div>
);

// ── ORDER ITEM ROW ────────────────────────────
const OrderItem = ({ image, title, price, quantity }) => (
  <div className="flex items-center gap-4 py-4 border-b border-white/5 last:border-0 group">
    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#0d0d0c] border border-white/10">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-['Baskervville'] italic text-base text-white/90 truncate">{title}</p>
      <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest text-[#958E62]/60 mt-1">
        Quantity {quantity}
      </p>
    </div>
    <p className="font-['Playfair_Display'] italic text-base text-[#DED5A4] shrink-0 ml-2">
      ${(Number(price) * quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
    </p>
  </div>
);

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items } = useSelector((state) => state.cart);
  const { loading, error } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [form, setForm] = useState({
    fullname: '', phone: '', addressLine1: '', addressLine2: '',
    city: '', state: '', postalCode: '', country: 'India',
  });

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (items.length === 0) { navigate('/cart'); return; }
  }, [isAuthenticated, items, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(placeOrder({ shippingAddress: form, paymentMethod })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') navigate('/order-confirmation');
    });
  };

  const subtotal = items.reduce((s, i) => s + (i.watch?.price || 0) * i.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 20;
  const insurance = subtotal * 0.01;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + insurance + tax;
  const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2 });

  return (
    <div className="bg-[#0a0a09] min-h-screen text-[#E7E7D9] pt-28 md:pt-32 pb-40 px-6 md:px-12 selection:bg-[#958E62] selection:text-black">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <p className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.6em] text-[#958E62] mb-4">
            Final acquisition
          </p>
          <h1 className="font-['Baskervville'] italic text-5xl md:text-7xl text-white tracking-tight">
            Secure Checkout
          </h1>
        </div>

        {/* Steps Breadcrumb */}
        <div className="flex items-center gap-3 mb-16 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em]">
          <Link to="/cart" className="text-white/30 hover:text-[#958E62] transition-colors">Cart</Link>
          <ChevronRight size={12} className="text-white/10" />
          <span className="text-[#958E62] border-b border-[#958E62]/30 pb-1">Checkout</span>
          <ChevronRight size={12} className="text-white/10" />
          <span className="text-white/10">Confirmation</span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* LEFT: Shipping & Payment */}
          <div className="w-full lg:flex-1 space-y-12">
            
            {/* Address Section */}
            <section>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 rounded-full bg-[#958E62]/10 border border-[#958E62]/20 flex items-center justify-center">
                  <Package size={18} className="text-[#958E62]" />
                </div>
                <h2 className="font-['Baskervville'] italic text-3xl text-white">Delivery Details</h2>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                <Field label="Full Name" name="fullname"  value={form.fullname} onChange={handleChange} placeholder="John Doe" required half />
                <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+91" required half type="telephone" />
                <Field label="Address Line 1" name="addressLine1" value={form.addressLine1} onChange={handleChange} placeholder="Street Address" required />
                <Field label="Address Line 2" name="addressLine2" value={form.addressLine2} onChange={handleChange} placeholder="Suite or Apartment" />
                <Field label="City" name="city" value={form.city} onChange={handleChange} placeholder="City" required half />
                <Field label="State" name="state" value={form.state} onChange={handleChange} placeholder="State" required half />
                <Field label="Postal Code" name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Zip Code" required half />
                <Field label="Country" name="country" value={form.country} onChange={handleChange} placeholder="India" required half />
              </div>
            </section>

            {/* Payment Section */}
            <section className="pt-12 border-t border-white/5">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 rounded-full bg-[#958E62]/10 border border-[#958E62]/20 flex items-center justify-center">
                  <CreditCard size={18} className="text-[#958E62]" />
                </div>
                <h2 className="font-['Baskervville'] italic text-3xl text-white">Payment Method</h2>
              </div>

              <div className="space-y-4">
                {['cod', 'online'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`w-full flex items-center gap-6 p-6 rounded-2xl border transition-all duration-500 text-left
                      ${paymentMethod === method ? 'border-[#958E62]/60 bg-[#958E62]/5 shadow-[0_0_30px_rgba(149,142,98,0.05)]' : 'border-white/5 bg-[#0d0d0c] hover:border-white/20'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${paymentMethod === method ? 'border-[#958E62]' : 'border-white/20'}`}>
                      {paymentMethod === method && <div className="w-2.5 h-2.5 rounded-full bg-[#958E62]" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-['JetBrains_Mono'] text-xs uppercase tracking-[0.3em] text-white">
                        {method === 'cod' ? 'Cash on Delivery' : 'Digital Payment'}
                      </p>
                      <p className="font-['Playfair_Display'] italic text-sm text-white/40 mt-1">
                        {method === 'cod' ? 'Payment upon white-glove arrival' : 'Credit, Debit, and UPI (Coming Soon)'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {error && (
              <div className="flex items-center gap-3 p-5 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400">
                <AlertCircle size={18} />
                <p className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest">{error}</p>
              </div>
            )}
          </div>

          {/* RIGHT: SUMMARY CARD */}
          <aside className="w-full lg:w-100 shrink-0 lg:sticky lg:top-32">
            <div className="p-8 md:p-10 rounded-[2.5rem] bg-[#0d0d0c] border border-white/10 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#958E62]/20" />
              
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <h2 className="font-['Baskervville'] italic text-2xl text-white">Manifest</h2>
                <ShieldCheck size={20} className="text-[#958E62]/50" />
              </div>

              <div className="max-h-75 overflow-y-auto no-scrollbar">
                {items.map((item) => (
                  <OrderItem key={item.watch._id} image={item.watch.image} title={item.watch.title} price={item.watch.price} quantity={item.quantity} />
                ))}
              </div>

              <div className="space-y-4 pt-4">
                {[
                  { label: 'Subtotal', val: `$${fmt(subtotal)}` },
                  { label: 'Shipping', val: shipping === 0 ? 'Complimentary' : `$${fmt(shipping)}` },
                  { label: 'Insurance', val: `$${fmt(insurance)}` },
                  { label: 'Estimated Tax', val: `$${fmt(tax)}` },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest">
                    <span className="text-white/30">{row.label}</span>
                    <span className="text-white/70">{row.val}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/10">
                <div className="flex justify-between items-baseline mb-10">
                  <span className="font-['Baskervville'] italic text-2xl text-white/60">Total</span>
                  <span className="font-['Baskervville'] italic text-4xl text-[#DED5A4]">${fmt(total)}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading || paymentMethod === 'online'}
                  className="w-full py-5 rounded-full flex items-center justify-center gap-4
                             font-['JetBrains_Mono'] text-xs uppercase tracking-[0.4em]
                             bg-[#958E62] text-[#0a0a09] font-bold border border-[#958E62]
                             hover:bg-white hover:border-white hover:shadow-[0_20px_50px_rgba(149,142,98,0.2)]
                             transition-all duration-700 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed group"
                >
                  {loading ? 'Processing...' : <><Lock size={16} className="group-hover:scale-110 transition-transform" /> Place Order</>}
                </button>

                <p className="text-center font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.5em] text-white/20 mt-8">
                  Secured & Encrypted Transaction
                </p>
              </div>
            </div>
          </aside>

        </form>
      </div>
    </div>
  );
};

export default Checkout;
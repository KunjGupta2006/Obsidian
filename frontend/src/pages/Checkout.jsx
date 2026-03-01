import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck, CreditCard, Package, ChevronRight,
  Lock, AlertCircle, Smartphone, Building2, Truck,
  Check, Eye, EyeOff, Wifi
} from 'lucide-react';
import { placeOrder } from '../redux/slices/orderSlice';

const Field = ({ label, name, value, onChange, type = 'text', placeholder, required, half }) => (
  <div className={half ? 'col-span-1' : 'col-span-2'}>
    <label className="block font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.4em] text-[#958E62] mb-3 opacity-80">
      {label} {required && <span className="text-[#958E62] ml-1">*</span>}
    </label>
    <input
      type={type} name={name} value={value} onChange={onChange}
      placeholder={placeholder} required={required}
      className="w-full px-5 py-4 rounded-xl bg-[#0d0d0c] border border-white/10 text-[#E7E7D9]
                 font-['Playfair_Display'] italic text-base placeholder:text-white/10
                 focus:outline-none focus:border-[#958E62]/60 focus:bg-[#111110]
                 hover:border-white/20 transition-all duration-500"
    />
  </div>
);

const OrderItem = ({ image, title, price, quantity }) => (
  <div className="flex items-center gap-4 py-4 border-b border-white/5 last:border-0 group">
    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#0d0d0c] border border-white/10">
      {image && <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-['Baskervville'] italic text-base text-white/90 truncate">{title}</p>
      <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest text-[#958E62]/60 mt-1">Quantity {quantity}</p>
    </div>
    <p className="font-['Playfair_Display'] italic text-base text-[#DED5A4] shrink-0 ml-2">
      ${(Number(price || 0) * quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
    </p>
  </div>
);

const formatCard   = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
const formatExpiry = (v) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 3 ? `${d.slice(0,2)}/${d.slice(2)}` : d; };

const CardPanel = ({ card, setCard }) => {
  const [showCvv, setShowCvv] = useState(false);
  const isVisa   = card.number.startsWith('4');
  const isMaster = card.number.startsWith('5') || card.number.startsWith('2');
  const isAmex   = card.number.startsWith('3');

  return (
    <div className="space-y-5 pt-5">
      <div className="relative h-44 rounded-2xl overflow-hidden border border-white/10
                      bg-linear-to-br from-[#1a1a17] via-[#111110] to-[#0d0d0c]
                      shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-6 flex flex-col justify-between">
        <div className="absolute inset-0 opacity-[0.03]"
             style={{ backgroundImage: 'repeating-linear-gradient(45deg,#958E62 0px,#958E62 1px,transparent 1px,transparent 8px)' }} />
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#958E62]/30 to-transparent" />
        <div className="flex items-start justify-between relative z-10">
          <div className="w-10 h-8 rounded-md bg-linear-to-br from-[#C2B994]/30 to-[#958E62]/10 border border-[#958E62]/20 grid grid-cols-2 gap-px p-1">
            {[...Array(4)].map((_,i) => <div key={i} className="rounded-sm bg-[#958E62]/20" />)}
          </div>
          <div className="font-['Baskervville'] italic">
            {isVisa   && <span className="text-white/60 text-xl tracking-wider">VISA</span>}
            {isMaster && <div className="flex items-center"><div className="w-6 h-6 rounded-full bg-red-500/60"/><div className="w-6 h-6 rounded-full bg-amber-400/60 -ml-3"/></div>}
            {isAmex   && <span className="text-blue-400/60 text-sm tracking-widest">AMEX</span>}
            {!isVisa && !isMaster && !isAmex && <Wifi size={18} className="text-white/15" />}
          </div>
        </div>
        <div className="relative z-10 space-y-3">
          <p className="font-['JetBrains_Mono'] text-lg tracking-[0.3em] text-white/70">{card.number || '•••• •••• •••• ••••'}</p>
          <div className="flex items-end justify-between">
            <div>
              <p className="font-['JetBrains_Mono'] text-[7px] uppercase tracking-widest text-white/25 mb-1">Card Holder</p>
              <p className="font-['Playfair_Display'] italic text-sm text-white/60">{card.name || 'Your Name'}</p>
            </div>
            <div className="text-right">
              <p className="font-['JetBrains_Mono'] text-[7px] uppercase tracking-widest text-white/25 mb-1">Expires</p>
              <p className="font-['JetBrains_Mono'] text-sm text-white/60">{card.expiry || 'MM/YY'}</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <label className="block font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.35em] text-[#958E62]/60 mb-2">Card Number</label>
        <input value={card.number} onChange={(e) => setCard((c) => ({ ...c, number: formatCard(e.target.value) }))}
               placeholder="4242 4242 4242 4242"
               className="w-full px-4 py-3 rounded-xl bg-[#111110] border border-white/8 text-white font-['JetBrains_Mono'] text-sm tracking-[0.2em] placeholder:text-white/10 focus:outline-none focus:border-[#958E62]/40 transition-all" />
      </div>
      <div>
        <label className="block font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.35em] text-[#958E62]/60 mb-2">Name on Card</label>
        <input value={card.name} onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))} placeholder="John Doe"
               className="w-full px-4 py-3 rounded-xl bg-[#111110] border border-white/8 text-white font-['Playfair_Display'] italic text-sm placeholder:text-white/10 focus:outline-none focus:border-[#958E62]/40 transition-all" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.35em] text-[#958E62]/60 mb-2">Expiry</label>
          <input value={card.expiry} onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))} placeholder="MM/YY"
                 className="w-full px-4 py-3 rounded-xl bg-[#111110] border border-white/8 text-white font-['JetBrains_Mono'] text-sm tracking-widest placeholder:text-white/10 focus:outline-none focus:border-[#958E62]/40 transition-all" />
        </div>
        <div>
          <label className="block font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.35em] text-[#958E62]/60 mb-2">CVV</label>
          <div className="relative">
            <input type={showCvv ? 'text' : 'password'} value={card.cvv}
                   onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g,'').slice(0,4) }))} placeholder="•••"
                   className="w-full px-4 py-3 pr-10 rounded-xl bg-[#111110] border border-white/8 text-white font-['JetBrains_Mono'] text-sm tracking-widest placeholder:text-white/10 focus:outline-none focus:border-[#958E62]/40 transition-all" />
            <button type="button" onClick={() => setShowCvv(!showCvv)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors cursor-pointer">
              {showCvv ? <EyeOff size={13}/> : <Eye size={13}/>}
            </button>
          </div>
        </div>
      </div>
      <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.3em] text-white/20">Test card: 4242 4242 4242 4242 · 12/26 · 123</p>
    </div>
  );
};

const UpiPanel = ({ upi, setUpi }) => (
  <div className="pt-5 space-y-4">
    <div>
      <label className="block font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.35em] text-[#958E62]/60 mb-2">UPI ID</label>
      <input value={upi} onChange={(e) => setUpi(e.target.value)} placeholder="yourname@upi"
             className="w-full px-4 py-3 rounded-xl bg-[#111110] border border-white/8 text-white font-['Playfair_Display'] italic text-sm placeholder:text-white/10 focus:outline-none focus:border-[#958E62]/40 transition-all" />
    </div>
    <div>
      <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.35em] text-white/25 mb-3">Or pay with</p>
      <div className="grid grid-cols-4 gap-3">
        {[
          { name:'GPay',    color:'from-blue-500/20 to-blue-600/10'    },
          { name:'PhonePe', color:'from-purple-500/20 to-purple-600/10' },
          { name:'Paytm',   color:'from-sky-400/20 to-sky-500/10'      },
          { name:'BHIM',    color:'from-orange-500/20 to-orange-600/10' },
        ].map((app) => (
          <button key={app.name} type="button" onClick={() => setUpi(`success@${app.name.toLowerCase()}`)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border border-white/8 bg-linear-to-b ${app.color} hover:border-[#958E62]/30 transition-all cursor-pointer group`}>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-['Baskervville'] italic text-sm text-white/50 group-hover:text-[#958E62]">
              {app.name[0]}
            </div>
            <p className="font-['JetBrains_Mono'] text-[7px] uppercase tracking-widest text-white/30">{app.name}</p>
          </button>
        ))}
      </div>
    </div>
    <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.3em] text-white/20">Test UPI: success@razorpay</p>
  </div>
);

const NetbankingPanel = ({ bank, setBank }) => (
  <div className="pt-5 space-y-4">
    <label className="block font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.35em] text-[#958E62]/60 mb-2">Select Bank</label>
    <div className="grid grid-cols-2 gap-2">
      {['State Bank of India','HDFC Bank','ICICI Bank','Axis Bank','Kotak Mahindra','Yes Bank','Punjab National Bank','Bank of Baroda'].map((b) => (
        <button key={b} type="button" onClick={() => setBank(b)}
                className={`px-4 py-3 rounded-xl border text-left transition-all cursor-pointer font-['JetBrains_Mono'] text-[8px] uppercase tracking-widest
                  ${bank === b
                    ? 'border-[#958E62]/40 bg-[#958E62]/5 text-[#958E62]'
                    : 'border-white/8 bg-[#111110] text-white/40 hover:border-white/20 hover:text-white/60'}`}>
          {b}
        </button>
      ))}
    </div>
  </div>
);

const ProcessingOverlay = ({ stage }) => (
  <div className="fixed inset-0 z-200 flex items-center justify-center bg-[#0a0a09]/95 backdrop-blur-xl mb-10">
    <div className="w-full max-w-sm px-8 text-center space-y-8">
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 rounded-full border border-[#958E62]/10" />
        <div className="absolute inset-0 rounded-full border-t border-[#958E62] animate-spin" />
        <div className="absolute inset-3 rounded-full border border-[#958E62]/5" />
        <Lock size={18} className="absolute inset-0 m-auto text-[#958E62]/60" />
      </div>
      <div>
        <p className="font-['Baskervville'] italic text-2xl text-white mb-2">Processing Payment</p>
        <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.4em] text-white/25">Please do not close this window</p>
      </div>
      <div className="space-y-3 text-left">
        {['Encrypting transaction','Verifying payment','Confirming with bank','Securing your order'].map((label, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-500
              ${stage > i ? 'border-[#4ade80]/50 bg-[#4ade80]/10' : 'border-white/10'}`}>
              {stage > i && <Check size={10} className="text-[#4ade80]" />}
            </div>
            <p className={`font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest transition-colors duration-500 ${stage > i ? 'text-white/60' : 'text-white/20'}`}>
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const METHODS = [
  { id: 'card',       IconComp: CreditCard, label: 'Card',       sub: 'Visa, Mastercard, Amex'          },
  { id: 'upi',        IconComp: Smartphone, label: 'UPI',        sub: 'GPay, PhonePe, Paytm, BHIM'      },
  { id: 'netbanking', IconComp: Building2,  label: 'Netbanking', sub: 'All major Indian banks'           },
  { id: 'cod',        IconComp: Truck,      label: 'COD',        sub: 'Payment upon white-glove arrival' },
];

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items }           = useSelector((s) => s.cart);
  const { loading, error }  = useSelector((s) => s.orders);
  const { isAuthenticated } = useSelector((s) => s.auth);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing,    setProcessing]    = useState(false);
  const [procStage,     setProcStage]     = useState(0);
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [upi,  setUpi]  = useState('');
  const [bank, setBank] = useState('');
  const [form, setForm] = useState({
    fullname:'', phone:'', addressLine1:'', addressLine2:'',
    city:'', state:'', postalCode:'', country:'India',
  });

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (items.length === 0) { navigate('/cart'); return; }
  }, [isAuthenticated, items, navigate]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const simulatePayment = () => new Promise((resolve) => {
    let s = 0;
    const iv = setInterval(() => {
      s++;
      setProcStage(s);
      if (s >= 4) { clearInterval(iv); setTimeout(resolve, 600); }
    }, 700);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'card'       && (!card.number || !card.name || !card.expiry || !card.cvv)) return;
    if (paymentMethod === 'upi'        && !upi)  return;
    if (paymentMethod === 'netbanking' && !bank) return;

    setProcessing(true);
    setProcStage(0);
    if (paymentMethod !== 'cod') await simulatePayment();

    const backendMethod = paymentMethod === 'cod' ? 'cod' : 'online';
    dispatch(placeOrder({ shippingAddress: form, paymentMethod: backendMethod })).then((result) => {
      setProcessing(false);
      if (result.meta.requestStatus === 'fulfilled') navigate('/order-confirmation');
    });
  };

  // ✅ use snapshot fields with watch as fallback
  const subtotal  = items.reduce((s, i) => s + (i.price || i.watch?.price || 0) * i.quantity, 0);
  const shipping  = subtotal > 500 ? 0 : 20;
  const insurance = subtotal * 0.01;
  const tax       = subtotal * 0.08;
  const total     = subtotal + shipping + insurance + tax;
  const fmt       = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2 });

  return (
    <>
      {processing && paymentMethod !== 'cod' && <ProcessingOverlay stage={procStage} />}
      <div className="bg-[#0a0a09] min-h-screen text-[#E7E7D9] pt-28 md:pt-32 pb-40 px-6 md:px-12 selection:bg-[#958E62] selection:text-black sm:mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.6em] text-[#958E62] mb-4">Final Acquisition</p>
            <h1 className="font-['Baskervville'] italic text-5xl md:text-7xl text-white tracking-tight">Secure Checkout</h1>
          </div>
          <div className="flex items-center gap-3 mb-16 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em]">
            <Link to="/cart" className="text-white/30 hover:text-[#958E62] transition-colors">Cart</Link>
            <ChevronRight size={12} className="text-white/10" />
            <span className="text-[#958E62] border-b border-[#958E62]/30 pb-1">Checkout</span>
            <ChevronRight size={12} className="text-white/10" />
            <span className="text-white/10">Confirmation</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="w-full lg:flex-1 space-y-12">

              {/* SHIPPING */}
              <section>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-10 rounded-full bg-[#958E62]/10 border border-[#958E62]/20 flex items-center justify-center">
                    <Package size={18} className="text-[#958E62]" />
                  </div>
                  <h2 className="font-['Baskervville'] italic text-3xl text-white">Delivery Details</h2>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                  <Field label="Full Name"      name="fullname"     value={form.fullname}     onChange={handleChange} placeholder="John Doe"           required half />
                  <Field label="Phone"          name="phone"        value={form.phone}        onChange={handleChange} placeholder="+91"                required half type="tel" />
                  <Field label="Address Line 1" name="addressLine1" value={form.addressLine1} onChange={handleChange} placeholder="Street Address"     required />
                  <Field label="Address Line 2" name="addressLine2" value={form.addressLine2} onChange={handleChange} placeholder="Suite or Apartment" />
                  <Field label="City"           name="city"         value={form.city}         onChange={handleChange} placeholder="City"               required half />
                  <Field label="State"          name="state"        value={form.state}        onChange={handleChange} placeholder="State"              required half />
                  <Field label="Postal Code"    name="postalCode"   value={form.postalCode}   onChange={handleChange} placeholder="Zip Code"           required half />
                  <Field label="Country"        name="country"      value={form.country}      onChange={handleChange} placeholder="India"              required half />
                </div>
              </section>

              {/* PAYMENT */}
              <section className="pt-12 border-t border-white/5">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-10 rounded-full bg-[#958E62]/10 border border-[#958E62]/20 flex items-center justify-center">
                    <CreditCard size={18} className="text-[#958E62]" />
                  </div>
                  <h2 className="font-['Baskervville'] italic text-3xl text-white">Payment Method</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-1">
                  {METHODS.map(({ id, IconComp, label }) => (
                    <button key={id} type="button" onClick={() => setPaymentMethod(id)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 cursor-pointer
                              ${paymentMethod === id
                                ? 'border-[#958E62]/50 bg-[#958E62]/5 shadow-[0_0_20px_rgba(149,142,98,0.08)]'
                                : 'border-white/5 bg-[#0d0d0c] hover:border-white/15'}`}>
                      <IconComp size={18} strokeWidth={1.5} className={paymentMethod === id ? 'text-[#958E62]' : 'text-white/25'} />
                      <p className={`font-['JetBrains_Mono'] text-[8px] uppercase tracking-widest ${paymentMethod === id ? 'text-[#958E62]' : 'text-white/30'}`}>
                        {label}
                      </p>
                    </button>
                  ))}
                </div>
                <p className="font-['Playfair_Display'] italic text-sm text-white/30 mb-2 px-1">
                  {METHODS.find((m) => m.id === paymentMethod)?.sub}
                </p>

                <div className="rounded-2xl border border-white/5 bg-[#0d0d0c] px-5 pb-5">
                  {paymentMethod === 'card'       && <CardPanel       card={card} setCard={setCard} />}
                  {paymentMethod === 'upi'        && <UpiPanel        upi={upi}   setUpi={setUpi}   />}
                  {paymentMethod === 'netbanking' && <NetbankingPanel bank={bank}  setBank={setBank} />}
                  {paymentMethod === 'cod'        && (
                    <div className="pt-6 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full border border-[#958E62]/20 bg-[#958E62]/5 flex items-center justify-center shrink-0">
                        <Truck size={18} className="text-[#958E62]/60" />
                      </div>
                      <div>
                        <p className="font-['Baskervville'] italic text-lg text-white/70">White-Glove Delivery</p>
                        <p className="font-['Playfair_Display'] italic text-sm text-white/30 mt-0.5">
                          Our concierge will collect payment upon delivery in a secure handover.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {error && (
                <div className="flex items-center gap-3 p-5 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400">
                  <AlertCircle size={18} />
                  <p className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest">{error}</p>
                </div>
              )}
            </div>

            {/* ORDER SUMMARY */}
            <aside className="w-full lg:w-96 shrink-0 lg:sticky lg:top-32">
              <div className="p-8 md:p-10 rounded-[2.5rem] bg-[#0d0d0c] border border-white/10 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#958E62]/30 to-transparent" />
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <h2 className="font-['Baskervville'] italic text-2xl text-white">Manifest</h2>
                  <ShieldCheck size={20} className="text-[#958E62]/50" />
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {/* ✅ snapshot fields first, watch as fallback */}
                  {items.map((item, i) => (
                    <OrderItem
                      key={item.watch?._id || item._id || i}
                      image={item.image    || item.watch?.image}
                      title={item.title    || item.watch?.title}
                      price={item.price    || item.watch?.price}
                      quantity={item.quantity}
                    />
                  ))}
                </div>
                <div className="space-y-4 pt-4">
                  {[
                    { label: 'Subtotal',  val: `$${fmt(subtotal)}`                                    },
                    { label: 'Shipping',  val: shipping === 0 ? 'Complimentary' : `$${fmt(shipping)}` },
                    { label: 'Insurance', val: `$${fmt(insurance)}`                                   },
                    { label: 'Est. Tax',  val: `$${fmt(tax)}`                                         },
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
                  <button type="submit" disabled={loading || processing}
                          className="w-full py-5 rounded-full flex items-center justify-center gap-4
                                     font-['JetBrains_Mono'] text-xs uppercase tracking-[0.4em]
                                     bg-[#958E62] text-[#0a0a09] font-bold border border-[#958E62]
                                     hover:bg-white hover:border-white hover:shadow-[0_20px_50px_rgba(149,142,98,0.2)]
                                     transition-all duration-700 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed group">
                    {loading || processing
                      ? 'Processing...'
                      : <><Lock size={16} className="group-hover:scale-110 transition-transform" /> Place Order</>
                    }
                  </button>
                  <div className="flex items-center justify-center gap-4 mt-6">
                    {['SSL', '256-bit', 'PCI DSS'].map((b) => (
                      <span key={b} className="font-['JetBrains_Mono'] text-[7px] uppercase tracking-widest text-white/15 border border-white/5 px-2 py-1 rounded">{b}</span>
                    ))}
                  </div>
                  <p className="text-center font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.5em] text-white/20 mt-4">
                    Secured & Encrypted Transaction
                  </p>
                </div>
              </div>
            </aside>
          </form>
        </div>
      </div>
    </>
  );
};

export default Checkout;
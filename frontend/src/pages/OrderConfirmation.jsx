import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle, Shield, Award, Download, ArrowRight, Printer } from 'lucide-react';
import { clearSelectedOrder } from '../redux/slices/orderSlice';

// ── CERTIFICATE HTML GENERATOR ───────────────────────────
const generateCertificateHTML = (order) => {
  const fmt       = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const shortId   = order._id?.slice(-8).toUpperCase();
  const issueDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  const itemsHTML = order.items.map((item) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #e8e0c8;font-family:Georgia,serif;font-style:italic;color:#1a1a0e;font-size:14px;">
        ${item.title}<br/>
        <span style="font-family:'Courier New',monospace;font-size:9px;color:#958E62;letter-spacing:0.2em;text-transform:uppercase;">
          ${item.brand}
        </span>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #e8e0c8;text-align:center;font-family:'Courier New',monospace;font-size:11px;color:#6b6340;">
        ${item.quantity}
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #e8e0c8;text-align:right;font-family:Georgia,serif;font-style:italic;color:#1a1a0e;font-size:14px;">
        $${fmt(item.price * item.quantity)}
      </td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Certificate of Acquisition — ${shortId}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{
      background:#fff;color:#1a1a0e;font-family:Georgia,serif;
      padding:1cm 1.2cm;
      -webkit-print-color-adjust:exact;print-color-adjust:exact;
    }
    .outer{border:2px double #958E62;padding:0.6cm 0.8cm;}
    .inner{border:1px solid #e8e0c8;padding:0.6cm 0.8cm;}
    .watermark{
      position:fixed;top:50%;left:50%;
      transform:translate(-50%,-50%) rotate(-25deg);
      font-size:80px;font-family:Georgia,serif;font-style:italic;
      color:rgba(149,142,98,0.04);white-space:nowrap;z-index:0;pointer-events:none;
    }
    .content{position:relative;z-index:1;}
    .header{text-align:center;margin-bottom:0.4cm;}
    .divider-row{display:flex;align-items:center;justify-content:center;gap:10px;margin:5px 0;}
    .dline{height:1px;width:50px;background:#958E62;}
    .eyebrow{font-family:'Courier New',monospace;font-size:7px;text-transform:uppercase;letter-spacing:0.5em;color:#958E62;margin:5px 0 3px;}
    h1{font-size:22px;font-style:italic;color:#1a1a0e;margin-bottom:3px;}
    .subtitle{font-style:italic;color:#6b6340;font-size:10px;max-width:380px;margin:0 auto;line-height:1.5;}
    .sep{height:1px;background:#e8e0c8;margin:0.35cm 0;}
    .meta{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:0.35cm;}
    .label{font-family:'Courier New',monospace;font-size:7px;text-transform:uppercase;letter-spacing:0.3em;color:#958E62;margin-bottom:2px;}
    .val{font-style:italic;font-size:12px;color:#1a1a0e;}
    .val.green{color:#2d7a3a;}
    table{width:100%;border-collapse:collapse;}
    th{font-family:'Courier New',monospace;font-size:7px;text-transform:uppercase;letter-spacing:0.3em;color:#958E62;padding-bottom:5px;border-bottom:1px solid #e8e0c8;text-align:left;}
    th:nth-child(2){text-align:center;}th:last-child{text-align:right;}
    td{padding:6px 0;border-bottom:1px solid #f0ebe0;font-size:11px;}
    td:nth-child(2){text-align:center;font-family:'Courier New',monospace;font-size:10px;color:#6b6340;}
    td:last-child{text-align:right;font-style:italic;}
    .totals{margin-top:0.3cm;text-align:right;}
    .trow{display:flex;justify-content:flex-end;gap:32px;margin-top:3px;}
    .tlabel{font-family:'Courier New',monospace;font-size:7px;text-transform:uppercase;letter-spacing:0.3em;color:#958E62;}
    .tval{font-style:italic;font-size:11px;color:#1a1a0e;min-width:80px;text-align:right;}
    .trow.grand .tlabel,.trow.grand .tval{font-size:13px;border-top:1px solid #958E62;padding-top:4px;margin-top:3px;font-weight:bold;}
    .bottom{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:0.35cm;padding-top:0.35cm;border-top:1px solid #e8e0c8;}
    .addr{font-style:italic;color:#3a3520;line-height:1.6;font-size:10px;margin-top:3px;}
    .sig{text-align:center;margin-top:0.35cm;padding-top:0.35cm;border-top:1px solid #e8e0c8;}
    .sig-line{width:120px;height:1px;background:#c8bfa0;margin:0 auto 5px;}
    .sig-name{font-style:italic;color:#6b6340;font-size:10px;}
    .sig-sub{font-family:'Courier New',monospace;font-size:7px;text-transform:uppercase;letter-spacing:0.3em;color:#b0a87a;margin-top:2px;}
    @page{margin:0.5cm;size:A4;}
  </style>
</head>
<body>
  <div class="watermark">OBSIDIAN</div>
  <div class="outer"><div class="inner"><div class="content">

    <div class="header">
      <div class="divider-row"><div class="dline"></div><span style="color:#958E62;font-size:9px;">✦</span><div class="dline"></div></div>
      <p class="eyebrow">Obsidian Private Collection</p>
      <h1>Certificate of Acquisition</h1>
      <p class="subtitle">Authenticated transfer of ownership of the following horological masterpiece.</p>
      <div class="divider-row" style="margin-top:6px;"><div class="dline"></div><span style="color:#958E62;font-size:9px;">✦</span><div class="dline"></div></div>
    </div>

    <div class="meta">
      <div><p class="label">Registry No.</p><p class="val">${shortId}</p></div>
      <div><p class="label">Issuance Date</p><p class="val">${issueDate}</p></div>
      <div><p class="label">Custodian</p><p class="val">${order.shippingAddress?.fullname || '—'}</p></div>
      <div><p class="label">Status</p><p class="val green">Verified</p></div>
    </div>

    <div class="sep"></div>
    <p class="label" style="margin-bottom:6px;">Acquired Timepieces</p>
    <table>
      <thead><tr><th>Timepiece</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Value</th></tr></thead>
      <tbody>${itemsHTML}</tbody>
    </table>

    <div class="totals">
      <div class="trow"><span class="tlabel">Subtotal</span><span class="tval">$${fmt(order.subtotal)}</span></div>
      <div class="trow"><span class="tlabel">Shipping</span><span class="tval">${order.shippingCost === 0 ? 'Complimentary' : '$' + fmt(order.shippingCost)}</span></div>
      <div class="trow grand"><span class="tlabel">Total Paid</span><span class="tval">$${fmt(order.totalAmount)}</span></div>
    </div>

    <div class="bottom">
      <div>
        <p class="label">Delivery Address</p>
        <p class="addr">
          ${order.shippingAddress?.fullname}<br/>
          ${order.shippingAddress?.addressLine1}${order.shippingAddress?.addressLine2 ? ', ' + order.shippingAddress.addressLine2 : ''}<br/>
          ${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.postalCode}, ${order.shippingAddress?.country}
        </p>
      </div>
      <div>
        <p class="label">Payment</p>
        <p class="addr">${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'} — <span style="text-transform:capitalize;">${order.paymentStatus}</span></p>
        <p class="label" style="margin-top:8px;">Order Status</p>
        <p class="addr" style="text-transform:capitalize;">${order.orderStatus}</p>
      </div>
    </div>

    <div class="sig">
      <div class="sig-line"></div>
      <p class="sig-name">Director of Horology, Obsidian</p>
      <p class="sig-sub">Authenticated · ${new Date().getFullYear()}</p>
    </div>

  </div></div></div>
</body>
</html>`;
};

// ── OPEN CERTIFICATE IN NEW WINDOW ───────────────────────
const openCertificate = (order) => {
  const html        = generateCertificateHTML(order);
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download your certificate.');
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 600);
};

// ── PAGE COMPONENT ───────────────────────────────────────
const OrderConfirmation = () => {
  const dispatch                 = useDispatch();
  const { selectedOrder: order } = useSelector((state) => state.orders);
  const { user }                 = useSelector((state) => state.auth);
  const downloadTriggered        = useRef(false);

  // auto-download certificate once when order is available
  useEffect(() => {
    if (order && !downloadTriggered.current) {
      downloadTriggered.current = true;
      setTimeout(() => openCertificate(order), 800);
    }
  }, [order]);

  // clear selectedOrder when leaving page
  useEffect(() => {
    return () => dispatch(clearSelectedOrder());
  }, []);

  // ── NO ORDER ──
  if (!order) return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col items-center justify-center gap-5">
      <div className="w-12 h-12 rounded-full border border-[#958E62]/15 flex items-center justify-center">
        <Shield size={20} className="text-[#958E62]/30" strokeWidth={1} />
      </div>
      <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest text-white/25">
        No order found
      </p>
      <Link to="/orders"
        className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest
                   text-[#958E62] border-b border-[#958E62]/30 pb-0.5
                   hover:text-[#DED5A4] transition-colors">
        View My Orders
      </Link>
    </div>
  );

  const fmt     = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const shortId = order._id?.slice(-8).toUpperCase();
  const issueDate = new Date(order.createdAt || Date.now).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <div className="bg-[#0a0a09] min-h-screen text-[#E7E7D9]
                    pt-24 md:pt-28 pb-36 px-4 md:px-10
                    selection:bg-[#958E62] selection:text-black">
      <div className="max-w-4xl mx-auto">

        {/* ── HEADER ── */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full
                          bg-[#958E62]/10 border border-[#958E62]/25 mb-2">
            <CheckCircle size={22} className="text-[#958E62]" strokeWidth={1.5} />
          </div>
          <h1 className="font-['Baskervville'] italic text-4xl md:text-5xl text-white">
            Acquisition Confirmed
          </h1>
          <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.5em] text-white/30">
            Registry № {shortId}
          </p>
          <p className="font-['Playfair_Display'] italic text-sm text-[#958E62]/50">
            Your certificate of acquisition has been prepared for download.
          </p>
        </div>

        {/* ── CERTIFICATE PREVIEW ── */}
        <div id="certificate"
          className="relative overflow-hidden bg-[#0d0d0c] border border-[#958E62]/25
                     rounded-3xl p-8 md:p-14 shadow-[0_32px_80px_rgba(0,0,0,0.7)]">

          <div className="absolute inset-0 flex items-center justify-center
                          opacity-[0.015] pointer-events-none select-none">
            <Shield size={460} strokeWidth={0.3} />
          </div>
          <div className="absolute top-5 left-5 right-5 bottom-5
                          border border-[#958E62]/8 rounded-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-8">

            {/* header */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-px bg-[#958E62]/30" />
                <Award size={20} className="text-[#958E62]" strokeWidth={1} />
                <div className="w-14 h-px bg-[#958E62]/30" />
              </div>
              <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.6em] text-[#958E62]/50">
                Obsidian Private Collection
              </p>
              <h2 className="font-['Baskervville'] italic text-3xl md:text-4xl text-[#DED5A4]">
                Certificate of Acquisition
              </h2>
              <p className="font-['Playfair_Display'] italic text-sm text-white/25 max-w-sm mx-auto leading-relaxed">
                Authenticated transfer of ownership to its rightful custodian.
              </p>
            </div>

            <div className="w-full h-px bg-[#958E62]/10" />

            {/* meta */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 w-full">
              {[
                { label: 'Registry No.',  value: shortId },
                { label: 'Issuance Date', value: issueDate },
                { label: 'Custodian',     value: user?.fullname || order.shippingAddress?.fullname || '—' },
                { label: 'Status',        value: 'Verified', green: true },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <span className="font-['JetBrains_Mono'] text-[7px] uppercase tracking-[0.4em] text-[#958E62]/50">
                    {item.label}
                  </span>
                  <span className={`font-['Playfair_Display'] italic text-sm
                    ${item.green ? 'text-[#4ade80]/70' : 'text-white/75'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-[#958E62]/10" />

            {/* items */}
            <div className="w-full space-y-2">
              <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.4em] text-[#958E62]/50 text-left mb-3">
                Acquired Timepieces
              </p>
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl
                                        bg-[#111110] border border-white/4 text-left">
                  <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-white/5">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-['Baskervville'] italic text-sm text-white truncate">{item.title}</p>
                    <p className="font-['JetBrains_Mono'] text-[7px] uppercase tracking-widest text-[#958E62]/45 mt-0.5">
                      {item.brand} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="font-['Playfair_Display'] italic text-sm text-[#C2B994] shrink-0">
                    ${fmt(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-[#958E62]/10" />

            {/* totals */}
            <div className="w-full max-w-xs ml-auto space-y-2">
              {[
                { label: 'Subtotal', value: `$${fmt(order.subtotal)}` },
                { label: 'Shipping', value: order.shippingCost === 0 ? 'Complimentary' : `$${fmt(order.shippingCost)}` },
                { label: 'Total Paid', value: `$${fmt(order.totalAmount)}`, bold: true },
              ].map((row, i) => (
                <div key={i} className={`flex justify-between items-baseline
                  ${row.bold ? 'pt-2 border-t border-[#958E62]/15' : ''}`}>
                  <span className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-widest text-white/25">
                    {row.label}
                  </span>
                  <span className={`font-['Playfair_Display'] italic
                    ${row.bold ? 'text-lg text-[#DED5A4]' : 'text-sm text-white/55'}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-[#958E62]/10" />

            {/* address */}
            <div className="w-full text-left">
              <p className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.4em] text-[#958E62]/50 mb-3">
                Delivery Address
              </p>
              <p className="font-['Playfair_Display'] italic text-sm text-white/45 leading-relaxed">
                {order.shippingAddress?.fullname}<br />
                {order.shippingAddress?.addressLine1}
                {order.shippingAddress?.addressLine2 && `, ${order.shippingAddress.addressLine2}`}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
                {order.shippingAddress?.country}
              </p>
            </div>

            {/* signature */}
            <div className="flex flex-col items-center gap-2 pt-2">
              <div className="w-36 h-px bg-white/8" />
              <p className="font-['Baskervville'] italic text-white/20 text-sm">
                Director of Horology, Obsidian
              </p>
              <p className="font-['JetBrains_Mono'] text-[7px] uppercase tracking-[0.4em] text-white/12">
                Authenticated · {new Date().getFullYear()}
              </p>
            </div>

          </div>

          {/* download button */}
          <div className="mt-10 pt-8 border-t border-white/5
                          flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => openCertificate(order)}
              className="flex items-center gap-3 px-8 py-3.5 rounded-full
                         font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest font-bold
                         bg-[#958E62] text-[#0a0a09] border border-[#958E62]
                         hover:bg-[#C2B994] hover:border-[#C2B994]
                         hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(149,142,98,0.25)]
                         transition-all duration-400 cursor-pointer"
            >
              <Download size={14} />
              Download Certificate
            </button>
            <div className="flex items-center gap-2 opacity-20">
              <Printer size={13} />
              <span className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-widest">
                Ref: {shortId}
              </span>
            </div>
          </div>
        </div>

        {/* navigation */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/orders"
            className="flex items-center gap-3 px-8 py-4 rounded-full
                       font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest
                       bg-white/5 border border-white/10
                       hover:bg-[#958E62] hover:text-[#0a0a09] hover:border-[#958E62]
                       transition-all duration-400">
            Track My Order <ArrowRight size={13} />
          </Link>
          <Link to="/collections"
            className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.4em]
                       text-white/25 hover:text-[#958E62] transition-colors">
            Continue Browsing
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;
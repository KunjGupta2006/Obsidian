// ── SHARED STYLES ────────────────────────────────────────────────────────────
const base = {
  bg:       '#0a0a09',
  card:     '#0d0d0c',
  gold:     '#958E62',
  goldLight:'#C2B994',
  text:     '#E7E7D9',
  muted:    '#6b6b5a',
  border:   '#1a1a16',
};

const itemsHtml = (items) => items.map((item) => `
  <tr>
    <td style="padding:12px 0; border-bottom:1px solid ${base.border}; vertical-align:middle;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td width="60" style="vertical-align:middle;">
            <img src="${item.image}" width="56" height="56"
                 style="border-radius:10px; object-fit:cover; display:block; border:1px solid ${base.border};" />
          </td>
          <td style="padding-left:14px; vertical-align:middle;">
            <p style="margin:0; font-family:Georgia,serif; font-style:italic; font-size:14px; color:${base.text};">
              ${item.title}
            </p>
            <p style="margin:4px 0 0; font-family:monospace; font-size:10px; text-transform:uppercase;
                      letter-spacing:0.15em; color:${base.muted};">
              ${item.brand} &nbsp;·&nbsp; Qty ${item.quantity}
            </p>
          </td>
          <td align="right" style="vertical-align:middle; white-space:nowrap;">
            <p style="margin:0; font-family:Georgia,serif; font-style:italic; font-size:15px; color:${base.goldLight};">
              $${(Number(item.price) * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`).join('');

const wrapper = (content) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${base.bg};">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${base.bg};min-height:100vh;">
    <tr><td align="center" style="padding:40px 16px;">

      <!-- CARD -->
      <table cellpadding="0" cellspacing="0" border="0" width="600"
             style="background:${base.card};border-radius:24px;border:1px solid ${base.border};
                    box-shadow:0 20px 60px rgba(0,0,0,0.6);overflow:hidden;">

        <!-- GOLD TOP BAR -->
        <tr>
          <td height="2" style="background:linear-gradient(90deg,transparent,${base.gold},transparent);font-size:0;">&nbsp;</td>
        </tr>

        <!-- HEADER -->
        <tr>
          <td align="center" style="padding:40px 48px 32px;">
            <p style="margin:0 0 6px; font-family:monospace; font-size:9px; text-transform:uppercase;
                      letter-spacing:0.6em; color:${base.gold};">
              Est. 2026
            </p>
            <h1 style="margin:0; font-family:Georgia,serif; font-style:italic; font-size:36px;
                       font-weight:normal; color:#ffffff; letter-spacing:-0.01em;">
              Obsidian<span style="color:${base.gold};">.</span>
            </h1>
            <p style="margin:8px 0 0; font-family:monospace; font-size:8px; text-transform:uppercase;
                      letter-spacing:0.8em; color:${base.gold}; opacity:0.4;">
              Registry
            </p>
          </td>
        </tr>

        <!-- DIVIDER -->
        <tr><td style="padding:0 48px;"><div style="height:1px;background:${base.border};"></div></td></tr>

        <!-- CONTENT -->
        ${content}

        <!-- FOOTER -->
        <tr><td style="padding:0 48px;"><div style="height:1px;background:${base.border};"></div></td></tr>
        <tr>
          <td align="center" style="padding:28px 48px 36px;">
            <p style="margin:0; font-family:monospace; font-size:8px; text-transform:uppercase;
                      letter-spacing:0.4em; color:${base.muted}; opacity:0.6;">
              Obsidian Private Limited &nbsp;·&nbsp; Secure &amp; Verified &nbsp;·&nbsp; © 2026
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ── CUSTOMER CONFIRMATION ─────────────────────────────────────────────────────
export const customerConfirmationEmail = (order, user) => {
  const fmt = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const addr = order.shippingAddress;

  const content = `
    <!-- GREETING -->
    <tr>
      <td style="padding:36px 48px 0;">
        <p style="margin:0 0 4px; font-family:monospace; font-size:9px; text-transform:uppercase;
                  letter-spacing:0.5em; color:${base.gold};">
          Acquisition Confirmed
        </p>
        <h2 style="margin:0 0 16px; font-family:Georgia,serif; font-style:italic; font-size:28px;
                   font-weight:normal; color:#ffffff;">
          Thank you, ${user.fullname?.split(' ')[0] || 'Valued Client'}.
        </h2>
        <p style="margin:0; font-family:Georgia,serif; font-style:italic; font-size:15px;
                  line-height:1.7; color:${base.muted};">
          Your acquisition has been received and is being processed with the utmost care.
          You will receive a tracking update once your timepiece is dispatched.
        </p>
      </td>
    </tr>

    <!-- ORDER META -->
    <tr>
      <td style="padding:28px 48px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%"
               style="background:${base.bg};border-radius:16px;border:1px solid ${base.border};">
          <tr>
            <td style="padding:20px 24px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="margin:0 0 4px; font-family:monospace; font-size:8px; text-transform:uppercase;
                              letter-spacing:0.4em; color:${base.muted};">Order Reference</p>
                    <p style="margin:0; font-family:monospace; font-size:13px; color:${base.gold};
                              text-transform:uppercase;">
                      № ${order._id.toString().slice(-8).toUpperCase()}
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin:0 0 4px; font-family:monospace; font-size:8px; text-transform:uppercase;
                              letter-spacing:0.4em; color:${base.muted};">Payment</p>
                    <p style="margin:0; font-family:monospace; font-size:11px; color:#ffffff;
                              text-transform:uppercase; letter-spacing:0.1em;">
                      ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Digital Payment'}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ITEMS -->
    <tr>
      <td style="padding:28px 48px 0;">
        <p style="margin:0 0 16px; font-family:monospace; font-size:9px; text-transform:uppercase;
                  letter-spacing:0.4em; color:${base.muted};">Your Timepieces</p>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          ${itemsHtml(order.items)}
        </table>
      </td>
    </tr>

    <!-- TOTALS -->
    <tr>
      <td style="padding:20px 48px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%"
               style="border-top:1px solid ${base.border};">
          <tr>
            <td style="padding:14px 0 6px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td><p style="margin:0;font-family:monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.3em;color:${base.muted};">Subtotal</p></td>
                  <td align="right"><p style="margin:0;font-family:monospace;font-size:11px;color:${base.text};">$${fmt(order.subtotal ?? order.totalAmount)}</p></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:6px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td><p style="margin:0;font-family:monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.3em;color:${base.muted};">Shipping</p></td>
                  <td align="right"><p style="margin:0;font-family:monospace;font-size:11px;color:${order.shippingCost === 0 ? '#4ade80' : base.text};">${order.shippingCost === 0 ? 'Complimentary' : '$' + fmt(order.shippingCost)}</p></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 0;border-top:1px solid ${base.border};">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td><p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:18px;color:#ffffff;">Total</p></td>
                  <td align="right"><p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:26px;color:${base.goldLight};">$${fmt(order.totalAmount)}</p></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- SHIPPING ADDRESS -->
    <tr>
      <td style="padding:24px 48px 36px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%"
               style="background:${base.bg};border-radius:16px;border:1px solid ${base.border};">
          <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0 0 10px; font-family:monospace; font-size:8px; text-transform:uppercase;
                        letter-spacing:0.4em; color:${base.muted};">Delivery Destination</p>
              <p style="margin:0; font-family:Georgia,serif; font-style:italic; font-size:14px;
                        line-height:1.8; color:${base.text}; opacity:0.7;">
                ${addr.fullname}<br>
                ${addr.addressLine1}${addr.addressLine2 ? '<br>' + addr.addressLine2 : ''}<br>
                ${addr.city}, ${addr.state} ${addr.postalCode}<br>
                ${addr.country}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  return {
    subject: `Obsidian · Acquisition Confirmed — № ${order._id.toString().slice(-8).toUpperCase()}`,
    html: wrapper(content),
  };
};

// ── ADMIN NOTIFICATION ────────────────────────────────────────────────────────
export const adminNotificationEmail = (order, user) => {
  const fmt  = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const addr = order.shippingAddress;

  const content = `
    <!-- ALERT HEADER -->
    <tr>
      <td style="padding:36px 48px 0;">
        <p style="margin:0 0 4px; font-family:monospace; font-size:9px; text-transform:uppercase;
                  letter-spacing:0.5em; color:${base.gold};">
          New Acquisition Alert
        </p>
        <h2 style="margin:0 0 8px; font-family:Georgia,serif; font-style:italic; font-size:26px;
                   font-weight:normal; color:#ffffff;">
          Order № ${order._id.toString().slice(-8).toUpperCase()}
        </h2>
        <p style="margin:0; font-family:monospace; font-size:10px; color:${base.muted};
                  text-transform:uppercase; letter-spacing:0.2em;">
          ${new Date(order.createdAt).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}
        </p>
      </td>
    </tr>

    <!-- CLIENT INFO -->
    <tr>
      <td style="padding:24px 48px 0;">
        <p style="margin:0 0 12px; font-family:monospace; font-size:8px; text-transform:uppercase;
                  letter-spacing:0.4em; color:${base.muted};">Client Dossier</p>
        <table cellpadding="0" cellspacing="0" border="0" width="100%"
               style="background:${base.bg};border-radius:16px;border:1px solid ${base.border};">
          <tr>
            <td style="padding:20px 24px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom:8px;">
                    <p style="margin:0;font-family:monospace;font-size:8px;text-transform:uppercase;letter-spacing:0.3em;color:${base.muted};">Name</p>
                    <p style="margin:2px 0 0;font-family:Georgia,serif;font-style:italic;font-size:15px;color:${base.text};">${user.fullname || '—'}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:8px;">
                    <p style="margin:0;font-family:monospace;font-size:8px;text-transform:uppercase;letter-spacing:0.3em;color:${base.muted};">Email</p>
                    <p style="margin:2px 0 0;font-family:monospace;font-size:12px;color:${base.text};">${user.email}</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin:0;font-family:monospace;font-size:8px;text-transform:uppercase;letter-spacing:0.3em;color:${base.muted};">Phone</p>
                    <p style="margin:2px 0 0;font-family:monospace;font-size:12px;color:${base.text};">${addr.phone || 'Not provided'}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ITEMS -->
    <tr>
      <td style="padding:24px 48px 0;">
        <p style="margin:0 0 12px; font-family:monospace; font-size:8px; text-transform:uppercase;
                  letter-spacing:0.4em; color:${base.muted};">Items Ordered</p>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          ${itemsHtml(order.items)}
        </table>
      </td>
    </tr>

    <!-- TOTAL + PAYMENT -->
    <tr>
      <td style="padding:20px 48px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%"
               style="border-top:1px solid ${base.border};padding-top:16px;">
          <tr>
            <td style="padding-top:14px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td><p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:18px;color:#ffffff;">Total Value</p></td>
                  <td align="right"><p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:26px;color:${base.goldLight};">$${fmt(order.totalAmount)}</p></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-top:8px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td><p style="margin:0;font-family:monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.3em;color:${base.muted};">Payment Method</p></td>
                  <td align="right"><p style="margin:0;font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:${base.text};">${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Digital Payment'}</p></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- SHIPPING ADDRESS -->
    <tr>
      <td style="padding:24px 48px 36px;">
        <p style="margin:0 0 12px; font-family:monospace; font-size:8px; text-transform:uppercase;
                  letter-spacing:0.4em; color:${base.muted};">Ship To</p>
        <table cellpadding="0" cellspacing="0" border="0" width="100%"
               style="background:${base.bg};border-radius:16px;border:1px solid ${base.border};">
          <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0; font-family:Georgia,serif; font-style:italic; font-size:14px;
                        line-height:1.8; color:${base.text}; opacity:0.7;">
                ${addr.fullname}<br>
                ${addr.addressLine1}${addr.addressLine2 ? '<br>' + addr.addressLine2 : ''}<br>
                ${addr.city}, ${addr.state} ${addr.postalCode}<br>
                ${addr.country}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  return {
    subject: `[Obsidian] New Order — № ${order._id.toString().slice(-8).toUpperCase()} · $${fmt(order.totalAmount)}`,
    html: wrapper(content),
  };
};
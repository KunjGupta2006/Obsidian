import nodemailer from 'nodemailer';
import { customerConfirmationEmail, adminNotificationEmail } from './EmailTemplates.js';

// ── TRANSPORTER ───────────────────────────────────────────────────────────────
const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── SEND ORDER EMAILS ─────────────────────────────────────────────────────────
// Call this after a successful order creation in orderController.js
export const sendOrderEmails = async (order, user) => {
  // don't crash the order flow if email fails — just log it
  try {
    const transporter = createTransporter();

    const customerEmail = customerConfirmationEmail(order, user);
    const adminEmail    = adminNotificationEmail(order, user);

    // send both in parallel
    await Promise.all([
      transporter.sendMail({
        from:    `"Obsidian Registry" <${process.env.EMAIL_USER}>`,
        to:      user.email,
        subject: customerEmail.subject,
        html:    customerEmail.html,
      }),
      transporter.sendMail({
        from:    `"Obsidian Registry" <${process.env.EMAIL_USER}>`,
        to:      process.env.ADMIN_EMAIL,
        subject: adminEmail.subject,
        html:    adminEmail.html,
      }),
    ]);

    console.log(`✉ Emails sent — customer: ${user.email}, admin: ${process.env.ADMIN_EMAIL}`);
  } catch (err) {
    // log but don't throw — order was already created successfully
    console.error('Email send failed:', err.message);
  }
};
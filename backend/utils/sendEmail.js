import nodemailer from 'nodemailer';
import {
  customerConfirmationEmail,
  adminNotificationEmail,
} from './EmailTemplates.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderEmails = async (order, user) => {
  try {
    if (!user?.email) {
      console.error('Customer email missing');
      return;
    }

    const customerEmail = customerConfirmationEmail(order, user);
    const adminEmail = adminNotificationEmail(order, user);

    const results = await Promise.allSettled([
      transporter.sendMail({
        from: `"Obsidian Registry" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: customerEmail.subject,
        html: customerEmail.html,
      }),

      transporter.sendMail({
        from: `"Obsidian Registry" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: adminEmail.subject,
        html: adminEmail.html,
      }),
    ]);

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Email ${index} failed:`, result.reason);
      }
    });

    console.log('Order email process completed');
  } catch (err) {
    console.error('Unexpected email error:', err);
  }
};
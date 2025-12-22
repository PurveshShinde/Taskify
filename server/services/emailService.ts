import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// In a real environment, configure these via .env
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your SMTP provider
  auth: {
    user: process.env.EMAIL_USER || 'demo@taskify.com',
    pass: process.env.EMAIL_PASS || 'demo_password',
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  if (!process.env.EMAIL_USER) {
    console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Body: ${text}`);
    return;
  }
  
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email send failed:', error);
  }
};
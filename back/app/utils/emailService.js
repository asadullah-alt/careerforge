const nodemailer = require('nodemailer');
// please please please dont add this in the codebase again
// this should be in environment variables

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  // finally in a bloody environment variable
  // thank god
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Generate a random 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
const sendVerificationEmail = async (to, verificationCode) => {
  try {
    const mailOptions = {
      // use environment variable for the from address
      from: `"Bhai Kaam Do" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: "Email Verification - Bhai Kaam Do",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Bhai Kaam Do!</h2>
          <p>Thank you for signing up. To complete your registration, please use the following verification code:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; letter-spacing: 5px;">${verificationCode}</h1>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <p>Best regards,<br>The Bhai Kaam Do Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending verification email: ', error);
    return false;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (to, resetToken) => {
  try {
    const resetUrl = `https://bhaikaamdo.com/reset-password/${resetToken}`;
    const mailOptions = {
      from: `"Bhai Kaam Do" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: "Password Reset Request - Bhai Kaam Do",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested to reset your password for your Bhai Kaam Do account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="background-color: #f5f5f5; padding: 10px; word-break: break-all;">${resetUrl}</p>
          <p style="color: #d9534f; font-weight: bold;">This link will expire in 10 minutes.</p>
          <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
          <p>Best regards,<br>The Bhai Kaam Do Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email: ', error);
    return false;
  }
};

module.exports = {
  generateVerificationCode,
  sendVerificationEmail,
  sendPasswordResetEmail
};
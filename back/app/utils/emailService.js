const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "support@datapsx.com",
    pass: process.env.EMAIL_PASSWORD // Should be set in environment variables
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
      from: '"CareerForge" <support@datapsx.com>',
      to: to,
      subject: "Email Verification - CareerForge",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to CareerForge!</h2>
          <p>Thank you for signing up. To complete your registration, please use the following verification code:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; letter-spacing: 5px;">${verificationCode}</h1>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <p>Best regards,<br>The CareerForge Team</p>
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

module.exports = {
  generateVerificationCode,
  sendVerificationEmail
};
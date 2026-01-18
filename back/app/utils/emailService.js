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
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">Welcome to Bhai Kaam Do!</h2>
  <p>Thank you for your interest. We wanted to let you know that <strong>you have been successfully added to our waiting list.</strong></p>
  
  <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0;">
    <h3 style="color: #007bff; margin: 0;">You're on the list!</h3>
    <p style="color: #555; margin-top: 10px;">We’ll notify you as soon as a spot becomes available.</p>
  </div>

  <p>We are working hard to bring everyone onboard, and we appreciate your patience.</p>
  <p>If you didn't sign up for this list, please ignore this email.</p>
  <p>Best regards,<br>The Bhai Kaam Do Team</p>
</div>`
      // html: `
      //   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      //     <h2 style="color: #333;">Welcome to Bhai Kaam Do!</h2>
      //     <p>Thank you for signing up. To complete your registration, please use the following verification code:</p>
      //     <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0;">
      //       <h1 style="color: #007bff; letter-spacing: 5px;">${verificationCode}</h1>
      //     </div>
      //     <p>This code will expire in 15 minutes.</p>
      //     <p>If you didn't request this verification, please ignore this email.</p>
      //     <p>Best regards,<br>The Bhai Kaam Do Team</p>
      //   </div>
      // `
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
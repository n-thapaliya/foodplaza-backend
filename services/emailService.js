require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendOTPEmail(email, otp, purpose = 'verification') {
  const subject = purpose === 'reset' ? 'Password Reset OTP' : 'Email Verification OTP';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; }
        .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #FF6B00; }
        .header h1 { color: #FF6B00; margin: 0; }
        .content { padding: 30px 0; text-align: center; }
        .otp-box { background: #f9f9f9; border: 2px dashed #FF6B00; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .otp { font-size: 32px; font-weight: bold; color: #FF6B00; letter-spacing: 8px; }
        .footer { text-align: center; color: #999; font-size: 12px; padding-top: 20px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍕 ${process.env.APP_NAME || 'FoodPlaza'}</h1>
        </div>
        <div class="content">
          <h2>Your OTP Code</h2>
          <p>Use this OTP to ${purpose === 'reset' ? 'reset your password' : 'verify your email address'}:</p>
          <div class="otp-box">
            <div class="otp">${otp}</div>
          </div>
          <p><strong>This OTP will expire in ${process.env.OTP_EXPIRY_MINUTES || 5} minutes.</strong></p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME || 'FoodPlaza'}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error.message);
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n==================================================\n🔑 [DEV MODE] EMAIL OTP FOR ${email}: [ ${otp} ]\n==================================================\n`);
      return { success: true, devMode: true };
    }
    return { success: false, error: error.message };
  }
}

async function sendWelcomeEmail(email, fullName) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; }
        .header { text-align: center; padding-bottom: 20px; }
        .header h1 { color: #FF6B00; margin: 0; }
        .content { padding: 20px 0; }
        .cta { text-align: center; margin: 30px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #FF6B00; color: #fff; text-decoration: none; border-radius: 6px; }
        .footer { text-align: center; color: #999; font-size: 12px; padding-top: 20px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍕 Welcome to ${process.env.APP_NAME || 'FoodPlaza'}!</h1>
        </div>
        <div class="content">
          <h2>Hi ${fullName},</h2>
          <p>Thank you for joining ${process.env.APP_NAME || 'FoodPlaza'}! Your account has been successfully verified.</p>
          <p>You can now explore our menu and place orders for your favorite meals.</p>
          <div class="cta">
            <a href="${process.env.FRONTEND_URL}" class="button">Browse Menu</a>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME || 'FoodPlaza'}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Welcome to ${process.env.APP_NAME || 'FoodPlaza'}!`,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { sendOTPEmail, sendWelcomeEmail };

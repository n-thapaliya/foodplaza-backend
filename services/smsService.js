require('dotenv').config();

// ─── Twilio SMS ────────────────────────────────────────────────────────────────
async function sendOTPSMS(phone, otp) {
  try {
    const twilio = require('twilio')(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    const message = await twilio.messages.create({
      body: `Your ${process.env.APP_NAME || 'FoodPlaza'} OTP is: ${otp}. Valid for ${process.env.OTP_EXPIRY_MINUTES || 5} minutes. Do not share.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('Twilio SMS error:', error.message);
    // Fallback: try Fast2SMS (India)
    return sendOTPFast2SMS(phone, otp);
  }
}

// ─── Fast2SMS Fallback (India) ─────────────────────────────────────────────────
async function sendOTPFast2SMS(phone, otp) {
  try {
    const https = require('https');
    const data = JSON.stringify({
      route: 'q',
      message: `Your ${process.env.APP_NAME || 'FoodPlaza'} OTP is: ${otp}. Valid for ${process.env.OTP_EXPIRY_MINUTES || 5} minutes.`,
      language: 'english',
      flash: 0,
      numbers: phone.replace('+91', '').replace(/\D/g, ''),
    });
    const options = {
      hostname: 'www.fast2sms.com',
      path: '/dev/bulkV2',
      method: 'POST',
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
        'Content-Type': 'application/json',
      },
    };
    return new Promise((resolve) => {
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          try {
            const result = JSON.parse(body);
            if (!result.return && process.env.NODE_ENV === 'development') {
              console.log(`\n==================================================\n🔑 [DEV MODE] SMS OTP FOR ${phone}: [ ${otp} ]\n==================================================\n`);
              resolve({ success: true, devMode: true });
            } else {
              resolve({ success: result.return, data: result });
            }
          } catch (e) {
            if (process.env.NODE_ENV === 'development') {
              console.log(`\n==================================================\n🔑 [DEV MODE] SMS OTP FOR ${phone}: [ ${otp} ]\n==================================================\n`);
              resolve({ success: true, devMode: true });
            } else {
              resolve({ success: false, error: 'Failed to parse response' });
            }
          }
        });
      });
      req.on('error', (e) => {
        console.error('Fast2SMS error:', e.message);
        if (process.env.NODE_ENV === 'development') {
          console.log(`\n==================================================\n🔑 [DEV MODE] SMS OTP FOR ${phone}: [ ${otp} ]\n==================================================\n`);
          resolve({ success: true, devMode: true });
        } else {
          resolve({ success: false, error: e.message });
        }
      });
      req.write(data);
      req.end();
    });
  } catch (error) {
    console.error('Fast2SMS error:', error.message);
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n==================================================\n🔑 [DEV MODE] SMS OTP FOR ${phone}: [ ${otp} ]\n==================================================\n`);
      return { success: true, devMode: true };
    }
    return { success: false, error: error.message };
  }
}

// ─── Twilio WhatsApp ───────────────────────────────────────────────────────────
async function sendOTPWhatsApp(phone, otp) {
  try {
    const twilio = require('twilio')(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    const message = await twilio.messages.create({
      body: `🍕 *${process.env.APP_NAME || 'FoodPlaza'}* OTP: *${otp}*\n\nValid for ${process.env.OTP_EXPIRY_MINUTES || 5} minutes. Do not share this OTP with anyone.`,
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${phone}`,
    });
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('WhatsApp send error:', error.message);
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n==================================================\n🔑 [DEV MODE] WHATSAPP OTP FOR ${phone}: [ ${otp} ]\n==================================================\n`);
      return { success: true, devMode: true };
    }
    return { success: false, error: error.message };
  }
}

module.exports = { sendOTPSMS, sendOTPWhatsApp };

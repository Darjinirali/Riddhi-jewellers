const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (to, otp, subject = 'Your OTP') => {
  const mailOptions = {
    from: `"Riddhi Jewellers" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Riddhi Jewellers - ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #d4af37; font-size: 28px; margin: 0;">✦ Riddhi Jewellers</h1>
          <p style="color: #999; font-size: 13px; letter-spacing: 2px; margin-top: 5px;">EST. 1995 | HANDCRAFTED EXCELLENCE</p>
        </div>
        <div style="background: #1a1a1a; border: 1px solid #d4af37; border-radius: 8px; padding: 30px; text-align: center;">
          <h2 style="color: #fff; margin-bottom: 10px;">${subject}</h2>
          <p style="color: #ccc; margin-bottom: 20px;">Your One-Time Password is:</p>
          <div style="background: #d4af37; color: #000; font-size: 36px; font-weight: bold; letter-spacing: 10px; padding: 20px; border-radius: 8px; display: inline-block;">
            ${otp}
          </div>
          <p style="color: #999; margin-top: 20px; font-size: 13px;">⏱ Valid for 5 minutes only. Do not share this OTP with anyone.</p>
        </div>
        <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">© 2024 Riddhi Jewellers, Ahmedabad, India</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { transporter, sendOTPEmail };

const { transporter } = require("./Email.config");

const SendEmailToUserByAdmin = async ({ to, subject, message }) => {
  try {
    const info = await transporter.sendMail({
      from: '"संyukt38 Admin" <sanyukt38@gmail.com>',
      to,
      subject,
      text: message,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; padding: 40px 20px;">
          <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
            <div style="background: linear-gradient(90deg, #2563EB, #1DB954); padding: 20px 30px;">
              <h2 style="margin: 0; color: white; font-size: 24px; text-align: center;">📢 Message from संyukt38 Admin</h2>
            </div>
            <div style="padding: 30px;">
              <p style="font-size: 16px; color: #333; line-height: 1.6;">
                Dear संyukt38 Member,
              </p>
              <p style="font-size: 15px; color: #444; line-height: 1.7;">
                ${message}
              </p>
              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:sanyukt38@gmail.com" style="background-color: #2563EB; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">
                  📬 Reply to Admin
                </a>
              </div>
              <p style="margin-top: 40px; font-size: 14px; color: #888; text-align: center;">
                This email was intended for alumni of संyukt38. If you believe you received this by mistake, you can safely ignore it.
              </p>
            </div>
            <div style="background-color: #f0f4f8; padding: 16px; text-align: center;">
              <p style="margin: 0; font-size: 13px; color: #999;">&copy; ${new Date().getFullYear()} संyukt38. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
    });

    // console.log("✅ Email successfully sent to:", to);
  } catch (err) {
   res.send("❌ Email send failed:", err.message);
  }
};

module.exports = SendEmailToUserByAdmin;

const { transporter } = require("./Email.config");

const SendEmail = async (email, code) => {
  try {
    const info = await transporter.sendMail({
      from: '"Aarambh38" <kumarraushanraj10@gmail.com>',
      to: email,
      subject: "Aarambh38 Email Verification",
      text: `Your verification code is ${code}`, // fallback for clients that don't render HTML
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="text-align: center; color: #4A90E2;">Verify Your Email</h2>
            <p style="font-size: 16px; color: #333;">
              Thank you for signing up for <strong>Aarambh38</strong>! Please use the verification code below to verify your email address:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; letter-spacing: 6px; background-color: #eaf4ff; padding: 10px 20px; border-radius: 8px; display: inline-block; color: #333; border: 1px solid #4A90E2;">
                ${code}
              </span>
            </div>
            <p style="font-size: 14px; color: #777;">
              This code is valid for a limited time. If you didn’t request this, you can safely ignore this email.
            </p>
            <p style="font-size: 14px; color: #777; text-align: center; margin-top: 40px;">
              — The Aarambh38 Team
            </p>
          </div>
        </div>
      `,
    });

    // console.log("Email sent to:", email);
  } catch (err) {
    console.error("Email send failed:", err.message);
  }
};

module.exports = SendEmail;

const { transporter } = require("./Email.config");

const AlumniAcceptanceEmail = async ({ emailId, fullName }) => {
  try {
    const info = await transporter.sendMail({
      from: '"संyukt38 Team" <sanyukt38@gmail.com>',
      to: emailId,
      subject: "Welcome to संyukt38 – Your Alumni Profile is Verified!",
      text: `Dear ${fullName},\n\nWe are delighted to inform you that your alumni profile has been successfully verified by the संyukt38 team. You can now mentor students, share experiences, and contribute to shaping the next generation.\n\nWarm regards,\nThe संyukt38 Team`,
      html: `
        <div style="background-color: #f2f4f8; padding: 40px; font-family: 'Segoe UI', sans-serif;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #4A90E2; margin-bottom: 5px;">You're Verified!</h1>
              <p style="color: #333; font-size: 18px;">Welcome to the संyukt38 Alumni Community</p>
            </div>
            <p style="font-size: 16px; color: #333;">Dear <strong>${fullName}</strong>,</p>
            <p style="font-size: 16px; color: #333;">
              We are delighted to inform you that your alumni profile has been 
              <strong>successfully verified</strong> by the संyukt38 team. 
              You can now mentor students, share your experiences, and guide them in their career journeys.
            </p>
            <p style="font-size: 16px; color: #333;">
              Your contribution will empower students, build meaningful connections, 
              and help create a strong bridge between academia and industry.
            </p>
            
            <p style="font-size: 14px; color: #555;">
              If you have any questions, feel free to reach out to us at 
              <a href="mailto:sanyukt38@gmail.com" style="color: #4A90E2;">sanyukt38@gmail.com</a>.
            </p>
            <p style="font-size: 14px; color: #999; text-align: center; margin-top: 40px;">
              — The संyukt38 Team
            </p>
          </div>
        </div>
      `,
    });

    // console.log("Alumni verification email sent to:", emailId);
  } catch (err) {
    resizeBy.send("Email send failed:", err.message);
  }
};

module.exports = AlumniAcceptanceEmail;

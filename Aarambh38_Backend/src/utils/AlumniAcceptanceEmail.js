const { transporter } = require("./Email.config");

const AlumniAcceptanceEmail = async ({ emailId, fullName }) => {
  try {
    const info = await transporter.sendMail({
      from: '"Aarambh38 Team" <aarambh38fromstart@gmail.com>',
      to: emailId,
      subject: "Welcome to Aarambh38 – You're Now a Verified Alumni Mentor!",
      text: `Dear ${fullName},\n\nCongratulations! Your alumni profile has been successfully verified by the Aarambh38 team. You can now guide students and contribute to shaping the future. Login to your dashboard to begin mentoring.\n\nWarm regards,\nThe Aarambh38 Team`,
      html: `
        <div style="background-color: #f2f4f8; padding: 40px; font-family: 'Segoe UI', sans-serif;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #4A90E2; margin-bottom: 5px;">You're Verified!</h1>
              <p style="color: #333; font-size: 18px;">Welcome to the Aarambh38 Mentor Community</p>
            </div>
            <p style="font-size: 16px; color: #333;">Dear <strong>${fullName}</strong>,</p>
            <p style="font-size: 16px; color: #333;">
              Congratulations! Your profile has been <strong>successfully verified</strong> by the Aarambh38 team. 
              You are now part of a growing community of dedicated alumni mentors committed to shaping student futures.
            </p>
            <p style="font-size: 16px; color: #333;">
              As a verified mentor, you can connect with students, provide guidance, share your experience, and make a meaningful impact in their educational and professional journey.
            </p>
            
            <p style="font-size: 14px; color: #555;">
              If you have any questions, feel free to reach out to us at 
              <a href="mailto:aarambh38fromstart@gmail.com" style="color: #4A90E2;">aarambh38fromstart@gmail.com</a>.
            </p>
            <p style="font-size: 14px; color: #999; text-align: center; margin-top: 40px;">
              — The Aarambh38 Team
            </p>
          </div>
        </div>
      `,
    });

    // console.log("Alumni verification email sent to:", emailId);
  } catch (err) {
    console.error("Email send failed:", err.message);
  }
};

module.exports = AlumniAcceptanceEmail;

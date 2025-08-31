const { transporter } = require("./Email.config");

const StudentRejectionEmail = async ({ emailId, fullName }) => {
  try {
    await transporter.sendMail({
      from: '"Aarambh38 Team" <aarambh38fromstart@gmail.com>',
      to: emailId,
      subject: "Aarambh38 Verification Update",
      text: `Dear ${fullName},\n\nWe regret to inform you that your student profile verification could not be approved at this time. Please review your details and try again or contact our support team for assistance.\n\nBest regards,\nThe Aarambh38 Team`,
      html: `
        <div style="background-color: #f2f4f8; padding: 40px; font-family: 'Segoe UI', sans-serif;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #E74C3C; margin-bottom: 5px;">Verification Not Approved</h1>
              <p style="color: #333; font-size: 18px;">Update on Your Student Profile</p>
            </div>
            <p style="font-size: 16px; color: #333;">Dear <strong>${fullName}</strong>,</p>
            <p style="font-size: 16px; color: #333;">
              We regret to inform you that your student profile verification could not be approved at this time.
            </p>
            <p style="font-size: 16px; color: #333;">
              Please review your submitted details and try again, or reach out to our support team for further assistance. 
              We're here to help you complete your verification successfully.
            </p>
            <p style="font-size: 14px; color: #555;">
              Contact us at 
              <a href="mailto:aarambh38fromstart@gmail.com" style="color: #E74C3C;">aarambh38fromstart@gmail.com</a> for any queries.
            </p>
            <p style="font-size: 14px; color: #999; text-align: center; margin-top: 40px;">
              — The Aarambh38 Team
            </p>
          </div>
        </div>
      `,
    });

    // console.log("Student verification rejection email sent to:", emailId);
  } catch (err) {
    console.error("Email send failed:", err.message);
  }
};

module.exports = StudentRejectionEmail;

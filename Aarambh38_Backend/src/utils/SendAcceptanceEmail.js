const { transporter } = require("./Email.config");

const SendAcceptanceEmail = async ({ 
  emailId,       // student's email
  fullName,      // alumni full name
  collegeName, 
  batch, 
  company, 
  role 
}) => {
  try {
    // Convert company and role to UPPERCASE
    const companyUpper = company ? company.toUpperCase() : "";
    const roleUpper = role ? role.toUpperCase() : "";

    const info = await transporter.sendMail({
      from: '"संyukt38" <aarambh38fromstart@gmail.com>',
      to: emailId,
      subject: "🎉 Your Connection Request Has Been Accepted!",
      text: `Good news! ${fullName} from ${collegeName} (Batch ${batch}), currently working at ${companyUpper} as ${roleUpper}, has accepted your connection request on संyukt38.`,
      html: `
      <div style="background-color:#f4f6f8; padding: 40px 0; font-family: Arial, sans-serif;">
        <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px 40px; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          
          <h2 style="color:#2c3e50; text-align:center; margin-bottom:20px;">
            🎉 Connection Accepted on <span style="color:#3498db;">संyukt38</span>
          </h2>

          <p style="font-size:16px; color:#444; line-height:1.6;">
            Great news! <strong>${fullName}</strong> from <strong>${collegeName}</strong> (Batch ${batch}), 
            currently working at <strong style="color:#3498db;">${companyUpper}</strong> 
            as <em style="color:#e67e22; font-weight:bold;">${roleUpper}</em>, has 
            <strong>accepted your connection request</strong>.
          </p>

          <p style="font-size:15px; color:#555; margin-top:20px;">
            You can now start networking and gain valuable guidance from our alumni community 🚀
          </p>

          <div style="text-align:center; margin-top:30px;">
            <a href="http://13.60.166.165" 
              style="display:inline-block; padding:10px 25px; background-color:#3498db; color:#fff; border-radius:5px; text-decoration:none; font-size:15px;">
              Go to Dashboard
            </a>
          </div>

          <p style="text-align:center; font-size:13px; color:#999; margin-top:40px;">
            — The संyukt38 Team
          </p>
        </div>
      </div>
      `,
    });

    // console.log("✅ Acceptance email sent to student:", emailId);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
};

module.exports = SendAcceptanceEmail;

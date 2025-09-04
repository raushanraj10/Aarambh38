const { transporter } = require("./Email.config");

const SendRejectanceEmail = async ({ 
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
      subject: "🙏 Update on Your Connection Request",
      text: `Hello! Unfortunately, ${fullName} from ${collegeName} (Batch ${batch}), currently at ${companyUpper} as ${roleUpper}, was unable to accept your connection request at this time. But don’t lose heart — many more alumni are here to guide and support you. Keep connecting, your right mentor is waiting for you on संyukt38 🚀`,
      html: `
      <div style="background-color:#f9f9fb; padding: 40px 0; font-family: Arial, sans-serif;">
        <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px 40px; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          
          <h2 style="color:#2c3e50; text-align:center; margin-bottom:20px;">
            🙏 Connection Request Update
          </h2>

          <p style="font-size:16px; color:#444; line-height:1.6;">
            Hello, we wanted to let you know that <strong>${fullName}</strong> from <strong>${collegeName}</strong> (Batch ${batch}), 
            currently working at <strong style="color:#3498db;">${companyUpper}</strong> 
            as <em style="color:#e67e22; font-weight:bold;">${roleUpper}</em>, 
            was <strong>unable to accept your connection request</strong> at this moment.
          </p>

          <p style="font-size:15px; color:#555; margin-top:20px;">
            But don’t lose heart 💙. Every “No” is just a step closer to finding the right mentor.  
            Many alumni on संyukt38 are here to share their knowledge and experiences with you.  
            Keep reaching out — your perfect guide is waiting! 🚀
          </p>

          <div style="text-align:center; margin-top:30px;">
            <a href="http://13.60.166.165" 
              style="display:inline-block; padding:10px 25px; background-color:#e74c3c; color:#fff; border-radius:5px; text-decoration:none; font-size:15px;">
              Explore More Alumni
            </a>
          </div>

          <p style="text-align:center; font-size:13px; color:#999; margin-top:40px;">
            — The संyukt38 Team
          </p>
        </div>
      </div>
      `,
    });

    // console.log("❌ Rejectance email sent to student:", emailId);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
};

module.exports = SendRejectanceEmail;

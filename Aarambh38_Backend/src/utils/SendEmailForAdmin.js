const { transporter } = require("./Email.config");

const SendEmailForAdmin = async ({ emailId, code, fullName, gender, collegeName, mobileNumber }) => {
  try {
    const info = await transporter.sendMail({
      from: '"संyukt38" <sanyukt38@gmail.com>',
      to: "sanyukt38@gmail.com", // Admin receives this
      subject: "संyukt38 - New Admin Verification",
      text: `
        Verification Code: ${code},
        Name: ${fullName},
        Email: ${emailId},
        Gender: ${gender},
        College: ${collegeName},
        Mobile: ${mobileNumber}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            
            <h2 style="text-align: center; color: #4A90E2;">New Admin Verification Request</h2>
            
            <p style="font-size: 16px; color: #333; text-align:center;">
              A new Admin has signed up on <strong>संyukt38</strong>. Below are their details:
            </p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px; font-weight: bold; color:#4A90E2;">Full Name</td>
                <td style="padding: 8px; color:#333;">${fullName}</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 8px; font-weight: bold; color:#4A90E2;">Email</td>
                <td style="padding: 8px; color:#333;">${emailId}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color:#4A90E2;">College</td>
                <td style="padding: 8px; color:#333;">${collegeName}</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 8px; font-weight: bold; color:#4A90E2;">Gender</td>
                <td style="padding: 8px; color:#333;">${gender}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color:#4A90E2;">Mobile</td>
                <td style="padding: 8px; color:#333;">${mobileNumber}</td>
              </tr>
            </table>

            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 28px; letter-spacing: 5px; background-color: #eaf4ff; padding: 10px 20px; border-radius: 8px; display: inline-block; color: #333; border: 1px solid #4A90E2;">
                Verification Code: ${code}
              </span>
            </div>

            <p style="font-size: 14px; color: #777; text-align: center; margin-top: 40px;">
              — The संyukt38 Team
            </p>
          </div>
        </div>
      `,
    });

    // console.log("Admin notified with user details:", fullName, emailId);
  } catch (err) {
  res.send("Email send failed:", err.message);
  }
};

module.exports = SendEmailForAdmin;

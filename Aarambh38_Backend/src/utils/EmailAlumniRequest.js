const { transporter } = require("./Email.config");

const EmailAlumniRequest = async (alumnidata) => {
  try {
    const {
      fullName,
      gender,
      emailId,
      registration,
      batch,
      collegeName,
      company,
      role,
      photourl,
      about,
      branch,
    } = alumnidata;

    const info = await transporter.sendMail({
      from: '"Aarambh38" <aarambh38fromstart@gmail.com>',
      to: "aarambh38fromstart@gmail.com", // send to admin
      subject: "New Alumni Registration Submitted",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 40px;">
          <div style="max-width: 650px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="text-align: center; color: #4A90E2;">📥 New Alumni Registration</h2>
            <p style="font-size: 16px; color: #333; text-align: center;">
              The following alumni has submitted their registration details:
            </p>

            <div style="margin: 20px 0; text-align: center;">
              <img src="${photourl}" alt="Profile Photo" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 2px solid #4A90E2;" />
            </div>

            <table style="width: 100%; font-size: 15px; color: #333; border-collapse: collapse;">
              <tbody>
                <tr><td style="padding: 8px;"><strong>Full Name:</strong></td><td style="padding: 8px;">${fullName}</td></tr>
                <tr><td style="padding: 8px;"><strong>Email ID:</strong></td><td style="padding: 8px;">${emailId}</td></tr>
                <tr><td style="padding: 8px;"><strong>Gender:</strong></td><td style="padding: 8px;">${gender}</td></tr>
                <tr><td style="padding: 8px;"><strong>College:</strong></td><td style="padding: 8px;">${collegeName}</td></tr>
                <tr><td style="padding: 8px;"><strong>Branch:</strong></td><td style="padding: 8px;">${branch}</td></tr>
                <tr><td style="padding: 8px;"><strong>Batch:</strong></td><td style="padding: 8px;">${batch}</td></tr>
                <tr><td style="padding: 8px;"><strong>Registration No.:</strong></td><td style="padding: 8px;">${registration}</td></tr>
                <tr><td style="padding: 8px;"><strong>Company:</strong></td><td style="padding: 8px;">${company}</td></tr>
                <tr><td style="padding: 8px;"><strong>Role:</strong></td><td style="padding: 8px;">${role}</td></tr>
                ${
                  about
                    ? `<tr><td style="padding: 8px;"><strong>About:</strong></td><td style="padding: 8px;">${about}</td></tr>`
                    : ""
                }
              </tbody>
            </table>

            <p style="font-size: 14px; color: #777; margin-top: 30px; text-align: center;">
              — Aarambh38 System Notification
            </p>
          </div>
        </div>
      `,
    });

    // console.log("Alumni data email sent to admin.");
  } catch (err) {
    console.error("Failed to send alumni info email:", err.message);
  }
};

module.exports = EmailAlumniRequest;

const { transporter } = require("./Email.config");

const SendEmail = async ({ emailId, data, message }) => {
  try {
    const info = await transporter.sendMail({
      from: '"संyukt38" <aarambh38fromstart@gmail.com>',
      to: emailId,
      subject: "New Connection Request from a Student",
      text: `${data.fullName} from ${data.collegeName}, ${data.branch} wants to connect with you.\n\nMessage:\n${message}`,
      html: `
      <div style="background-color:#f4f6f8; padding: 40px 0; font-family: Arial, sans-serif;">
        <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px 40px; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          
          <h2 style="color:#2c3e50; text-align:center; margin-bottom:20px;">
            🤝 Connection Request on <span style="color:#3498db;">संyukt38</span>
          </h2>

          <p style="font-size:16px; color:#444; line-height:1.6;">
            You’ve received a new connection request from <strong>${data.fullName}</strong> (${data.gender}),
            a student of <strong>${data.collegeName}</strong> - <em>${data.branch}</em>.
          </p>

          <div style="margin:25px 0; background:#f0f8ff; border-left:4px solid #3498db; padding:15px 20px; border-radius:6px;">
            <p style="margin:0; font-size:15px; color:#333;"><strong>Message from Student:</strong></p>
            <p style="margin-top:8px; font-size:15px; color:#2c3e50;">"${message}"</p>
          </div>

          <p style="font-size:15px; color:#555;">
            Please log in to your <strong>संyukt38</strong> alumni dashboard to respond to this request.
          </p>

          <div style="text-align:center; margin-top:30px;">
            <a href="http://13.60.166.165" style="display:inline-block; padding:10px 25px; background-color:#3498db; color:#fff; border-radius:5px; text-decoration:none; font-size:15px;">
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

    // console.log("Email sent successfully to", emailId);
  } catch (err) {
    console.error("Email send failed:", err.message);
  }
};

module.exports = SendEmail;

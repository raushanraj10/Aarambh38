const { transporter } = require("./Email.config");

const SendEmail = async ({ emailId, data, message }) => {
  try {
    const info = await transporter.sendMail({
      from: '"Aarambh38" <aarambh38fromstart@gmail.com>',
      to: emailId,
      subject: "New Connection Request from a Student",
      text: `${data.fullName} from ${data.collegeName}, ${data.branch} wants to connect with you.\n\nMessage:\n${message}`,
     html: `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 35px 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      <h1 style="color: #2c3e50; font-size: 24px; text-align: center; margin-bottom: 30px;">
        🤝 New Connection Request on <span style="color: #3498db;">Aarambh38</span>
      </h1>

      <p style="font-size: 16px; color: #333;">
        <strong>${data.fullName}</strong> (${data.gender}), a student from 
        <strong>${data.collegeName}</strong> 
        (<em>${data.branch}</em>), is requesting to connect with you.
      </p>

      <div style="margin: 30px 0; padding: 20px; background-color: #ecf7ff; border-left: 5px solid #3498db; border-radius: 6px;">
        <p style="margin: 0; font-size: 15px; color: #333;"><strong>Message:</strong></p>
        <p style="margin-top: 8px; font-size: 15px; color: #2c3e50;">"${message}"</p>
      </div>

      <p style="font-size: 15px; color: #555;">
        To view or respond to this request, please log in to your <strong>Aarambh38</strong> alumni dashboard.
      </p>

    

      <p style="text-align: center; font-size: 13px; color: #999; margin-top: 30px;">
        — The Aarambh38 Team
      </p>
    </div>
  </div>
`,
    });

    // console.log("Connection request email sent to:", emailId);
  } catch (err) {
    console.error("Email send failed:", err.message);
  }
};

module.exports = SendEmail;

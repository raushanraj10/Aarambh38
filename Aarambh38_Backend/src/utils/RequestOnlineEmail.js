const { transporter } = require("./Email.config");

const Requestonlineemail = async ({ emailId, fullName }) => {
  try {
    if (!emailId) {
      // console.error("Recipient email is missing!");
      return;
    }

    const info = await transporter.sendMail({
      from: '"संyukt38" <sanyukt38@gmail.com>',
      to: emailId,
      subject: `Chat Request from ${fullName} (संyukt38 Alumni)`,
      text: `Hello,

${fullName}, an alumnus of संyukt38, has requested to connect with you online to clear your queries and share guidance.

This is a great opportunity to interact directly and get your questions answered.

Click the link below to join the online chat:
http://13.60.166.165/

— The संyukt38 Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <h2 style="text-align: center; color: #2563eb;">Alumni Chat Request</h2>
            
            <p style="font-size: 16px; color: #333;">
              Hello,
            </p>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              <strong>${fullName}</strong>, an alumnus of <strong>संyukt38</strong>, has requested to connect with you online 
              to help answer your questions and guide you.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://13.60.166.165" target="_blank" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-size: 16px; display: inline-block;">
                Join Online Chat
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666;">
              If you were not expecting this request, you can safely ignore this email.
            </p>
            
            <p style="font-size: 14px; color: #777; text-align: center; margin-top: 40px;">
              — The संyukt38 Team
            </p>
          </div>
        </div>
      `,
    });

    // console.log("Chat request email sent to:", emailId);
  } catch (err) {
    res.send("Email send failed:", err.message);
  }
};

module.exports = Requestonlineemail;

const { transporter } = require("./Email.config");

const SendEmailByUser = async ({ useremail, subject, usermessage }) => {
  try {
    await transporter.sendMail({
      from: `"संyukt38 User" <${useremail}>`,
      to: '"संyukt38 Admin" <aarambh38fromstart@gmail.com>',
      subject,
      text: usermessage,
      html: `
        <div style="background-color:#f2f4f6; padding:40px 0; font-family:'Segoe UI', sans-serif;">
          <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden;">
            <div style="background:linear-gradient(90deg, #2563EB, #1DB954); padding:20px 30px;">
              <h2 style="margin:0; color:white; font-weight:600; font-size:20px;">
                📨 New Message from संyukt38 User
              </h2>
            </div>
            <div style="padding:30px;">
              <p style="font-size:15px; color:#333; margin:0 0 10px;"><strong>Sender Email:</strong> ${useremail}</p>
              <p style="font-size:15px; color:#333; margin:0 0 10px;"><strong>Subject:</strong> ${subject}</p>
              <div style="margin-top:20px;">
                <p style="font-size:15px; font-weight:500; margin-bottom:5px;">Message:</p>
                <div style="padding:15px; background:#f9fafb; border-left:4px solid #2563EB; border-radius:6px; white-space:pre-line; font-size:14px; color:#333;">
                  ${usermessage}
                </div>
              </div>
            </div>
            <div style="background:#f9fafc; padding:20px 30px; text-align:center; font-size:13px; color:#999;">
              This message was sent via the <strong>संyukt38</strong> contact form.
            </div>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
};

module.exports = SendEmailByUser;

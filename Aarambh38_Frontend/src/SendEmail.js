import { transporter } from "./Email.config";

export const sendMail=async () => {
    try{
  const info = await transporter.sendMail({
    from: '"Aarambh38" <kumarraushanraj10@gmail.com>',
    to: "r661157@gmail.com",
    subject: "Verification",
    text: "Verify your email", // plain‑text body
    html: "1234", // HTML body
  });

console.log("Email Sended");
}catch(err){console.log(err.message)}}
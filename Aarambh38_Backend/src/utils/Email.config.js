const nodemailer =require ("nodemailer")

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "sanyukt38@gmail.com",
    pass: "yasy xcdi qdoc tvys",
  },
});

module.exports={transporter}

import { createTransport } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendMail = async (email, subject, htmlContent) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GPASS,
    },
  });

  let mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: subject,
    html: htmlContent, // ✅ Use `html` instead of `text`
  };

  try {
    let info = await transport.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending mail:", error);
  }
};

export default sendMail;

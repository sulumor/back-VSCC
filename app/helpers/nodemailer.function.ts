import logger from "@/logger/index.logger";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function resetPasswordEmail({
  email,
  id,
  token,
}: {
  email: string;
  id: string;
  token: string;
}) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Réinitialiser votre mot de passe",
    text: `${process.env.ORIGIN}/reset-password/${id}/${token}`,
  };

  return new Promise((resolve) => {
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        logger.error(error);
        resolve(false);
      } else resolve(true);
    });
  });
}

export default resetPasswordEmail;

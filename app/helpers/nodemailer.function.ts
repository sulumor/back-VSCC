import { User } from "@/@Types/users.types";
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
  token,
  user,
}: {
  user: User;
  token: string;
}) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Vélo Club de Clichy - Réinitialiser votre mot de passe",
    text: resetPasswordText({ token, ...user }),
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

interface userWithToken extends User {
  token: string;
}

const resetPasswordText: (user: userWithToken) => string = (user) =>
  `Bonjour ${user.firstname},

  Vous venez d'effectuer une demande de réinitialisation de votre mot de passe. Veuillez cliquer sur ce lien afin de poursuivre votre démarche : ${process.env.ORIGIN}/reset-password/${user.id}/${user.token}.

  Si vous n'êtes pas l'auteur de cette demande, merci d'ignorer cette email.
    
  Vélomicalement,

  --
  Antoine Crochet-Damais
  13 rue Huntziger
  92110 Clichy
  Tél: 06 16 99 85 65  
  `;

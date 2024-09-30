import nodemailer from "nodemailer";
import type { User } from "@/@Types/users.types";
import logger from "@/logger/index.logger";

interface userWithToken extends User {
  token: string;
}

export default class MailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  resetPasswordEmail({
    token,
    user,
  }: {
    user: User;
    token: string;
  }): Promise<boolean> {
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Vélo Club de Clichy - Réinitialiser votre mot de passe",
      text: this.resetPasswordText({ token, ...user }),
    };

    return new Promise((resolve) => {
      this.transporter.sendMail(mailOptions, (error) => {
        if (error) {
          logger.error(error);
          resolve(false);
        } else resolve(true);
      });
    });
  }

  private resetPasswordText: (user: userWithToken) => string = (user) =>
    `Bonjour ${user.firstname},

  Vous venez d'effectuer une demande de réinitialisation de votre mot de passe. Veuillez cliquer sur ce lien afin de poursuivre votre démarche : ${process.env.FRONT_URL}/reset-password/${user.id}/${user.token}.

  Si vous n'êtes pas l'auteur de cette demande, merci d'ignorer cette email.
    
  Vélomicalement,

  --
  Antoine Crochet-Damais
  13 rue Huntziger
  92110 Clichy
  Tél: 06 16 99 85 65  
  `;
}

import nodemailer from "nodemailer";
import type { User } from "@/@Types/users.types";
import logger from "@/logger/index.logger";

interface userWithToken extends User {
  token: string;
}

//! Voir pour améliorer les functions

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

  newUserEmail({
    token,
    user,
  }: {
    user: User;
    token: string;
  }): Promise<boolean> {
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Vélo Club de Clichy - Nouvel utilisteur de notre plateforme",
      text: this.newUserText({ token, ...user }),
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

  private newUserText: (user: userWithToken) => string = (user) =>
    `Bonjour ${user.firstname},
  
  Un membre administrateur du club VSCC vient de vous enregistrer en tant que nouveau membre de la plateforme 'Itinéraires' du club. De ce faite, vous avez la posibilité de créer et de modifier les traces mise à disposition.

  Afin de finaliser votre enregistrement, vous devez modifier votre mot de passe via ce lien: ${process.env.FRONT_URL}/reset-password/${user.id}/${user.token}.

  Attention : Votre mot de passe doit faire au moins 8 caractères dons 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.

  Ensuite pour vous connecter, vos identifiants sont votre adresse email et le mot de passe choisi. 
  
  Si vous avez des questions, n'hésitez pas à me contacter ou bien Romuald.

  Vélomicalement,

  --
  Antoine Crochet-Damais
  13 rue Huntziger
  92110 Clichy
  Tél: 06 16 99 85 65 

    `;

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

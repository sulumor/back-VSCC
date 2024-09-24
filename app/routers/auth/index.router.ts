import { Router } from "express";
import cookieParser from "cookie-parser";
// ----- HELPERS -----
import Limiter from "@/helpers/rateLimiter.config";
import controllerWrapper from "@/helpers/controller.wrapper";
import validateMiddleware from "@/middlewares/validation.middleware";
// ----- CONTROLLERS -----
import AuthController from "@/controllers/auth/auth.controller";
// ----- SCHEMAS -----
import UserPostSchema from "@/schemas/api/users/post.schema";
import postSchema from "@/schemas/authentification/post.schema";
import emailSchema from "@/schemas/authentification/email.schema";
import resetPasswordSchema from "@/schemas/authentification/resetPassword.schema";
import ApiError from "@/errors/api.error";

const authRouter = Router();

authRouter.use(cookieParser(process.env.COOKIE_PARSER_SECRET));

/**
 * POST /auth/forgot_password
 * @summary Recevoir un email pour modifier son mot de passe
 * @tags Authentification
 * @param { EmailBody } request.body.required - Email pour l'envoi du formulaire de modification de mot de passe
 * @return  { } 204 - Réponse en cas de succès - application/json
 * @return { ApiJsonError } 404 - Réponse en cas de réponse non trouvée - application/json
 * @return { ApiJsonError } 409 - Réponse en cas de demande déjà effectuer - application/json
 * @return { ApiJsonError } 500 - Réponse en cas de problème serveur - application/json
 * @return { ApiJsonError } 503 - Réponse en cas de non envoie de l'email - application/json
 */
authRouter.post(
  "/forgot_password",
  Limiter.accountLogin,
  validateMiddleware("body", emailSchema),
  controllerWrapper(AuthController.forgotPassword.bind(AuthController))
);

/**
 * POST /auth/reset_password
 * @summary Modification de son mot de passe
 * @tags Authentification
 * @param { ResetPasswordBody } request.body.required - Information pour modifier le mot de passe
 * @return  { } 204 - Réponse en cas de succès - application/json
 * @return { ApiJsonError } 404 - Réponse en cas de réponse non trouvée - application/json
 * @return { ApiJsonError } 500 - Réponse en cas de problème serveur - application/json
 */
authRouter.post(
  "/reset_password",
  Limiter.accountLogin,
  validateMiddleware("body", resetPasswordSchema),
  controllerWrapper(AuthController.resetUserPassword.bind(AuthController))
);

/**
 * POST /auth/login
 * @summary Se connecter
 * @tags Authentification
 * @param { LoginBody } request.body.required - Information de connexion
 * @return  { Tokens } 200 - Réponse en cas de succès - application/json
 * @return { ApiJsonError } 401 - Réponse en cas d'échec de l'authentification - application/json
 * @return { ApiJsonError } 500 - Réponse en cas de problème serveur - application/json
 */
authRouter.post(
  "/login",
  Limiter.accountLogin,
  validateMiddleware("body", postSchema),
  controllerWrapper(AuthController.login.bind(AuthController))
);

authRouter
  .route("/refresh_token")
  /**
   * GET /auth/refresh_token
   * @summary Pour avoir un nouveau access token via le refresh token
   * @tags Authentification
   * @return  { Tokens } 200 - Réponse en cas de succès - application/json
   * @return { ApiJsonError } 401 - Réponse en cas d'échec de l'authentification - application/json
   * @return { ApiJsonError } 403 - Réponse en cas d'accès interdit - application/json
   * @return { ApiJsonError } 500 - Réponse en cas de problème serveur - application/json
   */
  .get(
    Limiter.refreshToken,
    controllerWrapper(AuthController.refreshToken.bind(AuthController))
  )

  /**
   * DELETE /auth/refresh_token
   * @summary Pour supprimer le refresh token des cookies
   * @tags Authentification
   * @return { Message } 200 - Réponse en cas de succès - application/json
   * @return { ApiJsonError } 500 - Réponse en cas de problème serveur - application/json
   */
  .delete(controllerWrapper(AuthController.deleteToken.bind(AuthController)));

/**
 * POST /auth/register
 * @summary S'enregistrer
 * @tags Authentification
 * @param { UserBody } request.body.required - Information pour s'enregistrer
 * @return  { Tokens } 200 - Réponse en cas de succès - application/json
 * @return { ApiJsonError } 401 - Réponse en cas d'échec de l'authentification - application/json
 * @return { ApiJsonError } 500 - Réponse en cas de problème serveur - application/json
 */
authRouter.post(
  "/register",
  Limiter.accountLogin,
  validateMiddleware("body", UserPostSchema),
  controllerWrapper(AuthController.register.bind(AuthController))
);

authRouter.use((_, __, next) =>
  next(new ApiError("Ressources non trouvées", { httpStatus: 404 }))
);

export default authRouter;

import { Router } from "express";
import AuthController from "@/controllers/auth/auth.controller";
import controllerWrapper from "@/helpers/controller.wrapper";
import validateMiddleware from "@/middlewares/validation.middleware";
import UserPostSchema from "@/schemas/api/users/post.schema";
import postSchema from "@/schemas/authentification/post.schema";
import Limiter from "@/helpers/rateLimiter.config";

const authRouter = Router();

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

export default authRouter;

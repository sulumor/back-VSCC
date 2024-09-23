import { Router } from "express";
import ApiError from "@/errors/api.error";
import UsersController from "@/controllers/api/users.controller";
// ----- HELPERS -----
import validationMiddleware from "@/middlewares/validation.middleware";
import {
  authenticateToken,
  isAdmin,
} from "@/middlewares/authorization.middleware";
import controllerWrapper from "@/helpers/controller.wrapper";
// ----- SCHEMAS
import UsersPatchSchema from "@/schemas/api/users/patch.schema";
import UsersPostSchema from "@/schemas/api/users/post.schema";

const usersRouter = Router();

usersRouter.use(authenticateToken);
usersRouter.use(isAdmin);

usersRouter
  .route(
    "/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})"
  )
  /**
   * GET /api/users/{id}
   * @summary Récupérer un utilisateur par son identifiant
   * @tags Users
   * @param { number } id.path.required - Identifiant de l'utilisateur
   * @return { User } 200 - Réponse en cas de succès - application/json
   * @return { UseronError } 400 - Réponse en cas de mauvais appel - application/json
   * @return { ApiJsonError } 404 - Réponse en cas de réponse non trouvée - application/json
   * @return { ApiJsonError } 500 - Réponse en cas de problème serveur - application/json
   */
  .get(controllerWrapper(UsersController.getByPk.bind(UsersController)))

  /**
   * PATCH /api/users/{id}
   * @summary Mettre à jour un utilisateur
   * @tags Users
   * @param { number } id.path.required - Identifiant de l'utilisateur
   * @param { TraceBody } request.body.required - Les informations à mettre à jour
   * @return { User } 200 - Réponse en cas de succès - application/json
   * @return { ApiJsonError } 400 - Réponse en cas de mauvais appel - application/json
   * @return { ApiJsonError } 404 - Réponse en cas de réponse non trouvée - application/json
   * @return { ApiJsonError } 500 - Réponse en cas de problème serveur - application/json
   */
  .patch(
    validationMiddleware("body", UsersPatchSchema),
    controllerWrapper(UsersController.update.bind(UsersController))
  )

  /**
   * DELETE /api/users/{id}
   * @summary Supprimer un utilisateur
   * @tags Users
   * @param { number } id.path.required - Identifiant de l'utilisateur
   * @return {} 204 - Réponse en cas de succès
   * @return { ApiJsonError } 400 - Réponse en cas de mauvais appel - application/json
   * @return { ApiJsonError } 404 - Réponse en cas de réponse non trouvée - application/json
   * @return { ApiJsonError } 500 - Réponse en cas de problème serveur - application/json
   */
  .delete(controllerWrapper(UsersController.delete.bind(UsersController)));

usersRouter
  .route("/")
  /**
   * GET /api/users
   * @summary Récupérer tous les utilisateurs
   * @tags Users
   * @return { User[] } 200 - Réponse en cas de succès - application/json
   * @return { ApiJsonError } 400 - Réponse en cas de mauvais appel - application/json
   * @return { ApiJsonError } 404 - Réponse en cas de réponse non trouvée - application/json
   * @return { ApiJsonError } 500 - Réponse en cas de problème serveur - application/json
   */
  .get(controllerWrapper(UsersController.getAll.bind(UsersController)))

  /**
   * POST /api/users
   * @summary Ajouter un nouvel utilisateur
   * @tags Users
   * @param { TraceBody } request.body.required - Information de la nouvelle trace
   * @return { User } 200 - Réponse en cas de succès - application/json
   * @return { ApiJsonError } 400 - Réponse en cas de mauvais appel - application/json
   * @return { ApiJsonError } 404 - Réponse en cas de réponse non trouvée - application/json
   * @return { ApiJsonError } 500 - Réponse en cas de problème serveur - application/json
   */
  .post(
    validationMiddleware("body", UsersPostSchema),
    controllerWrapper(UsersController.create.bind(UsersController))
  );

usersRouter.use((_, __, next) =>
  next(new ApiError("Ressources non trouvées", { httpStatus: 404 }))
);

export default usersRouter;

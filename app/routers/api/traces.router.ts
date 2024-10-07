import { Router } from "express";
import ApiError from "@/errors/api.error";
import TracesController from "@/controllers/api/traces.controller";
// ----- HELPERS -----
import controllerWrapper from "@/helpers/controller.wrapper";
import validationMiddleware from "@/middlewares/validation.middleware";
import { authenticateToken } from "@/middlewares/authorization.middleware";
// ----- SCHEMAS -----
import tracesPostSchema from "@/schemas/api/traces/post.schema";
import tracesPatchSchema from "@/schemas/api/traces/patch.schema";

const tracesRouter = Router();

tracesRouter
  .route("/:id(\\d+)")
  /**
   * GET /api/traces/{id}
   * @summary Récupérer une trace par son identifiant
   * @tags Traces
   * @param { number } id.path.required - Identifiant de la trace
   * @return { Trace } 200 - Réponse en cas de succès - application/json
   * @return { ApiJsonError } 400 - Réponse en cas de mauvais appel - application/json
   * @return { ApiJsonError } 404 - Réponse en cas de réponse non trouvée - application/json
   * @return { ApiJsonError } 500 - Réponse en cas de problème serveur - application/json
   */
  .get(controllerWrapper(TracesController.getByPk.bind(TracesController)))

  /**
   * PATCH /api/traces/{id}
   * @summary Mettre à jour une trace
   * @tags Traces
   * @param { number } id.path.required - Identifiant de la trace
   * @param { TraceBody } request.body.required - Les informations à mettre à jour
   * @return { Trace } 200 - Réponse en cas de succès - application/json
   * @return { ApiJsonError } 400 - Réponse en cas de mauvais appel - application/json
   * @return { ApiJsonError } 404 - Réponse en cas de réponse non trouvée - application/json
   * @return { ApiJsonError } 500 - Réponse en cas de problème serveur - application/json
   */
  .patch(
    // authenticateToken,
    validationMiddleware("body", tracesPatchSchema),
    controllerWrapper(TracesController.update.bind(TracesController))
  )

  /**
   * DELETE /api/traces/{id}
   * @summary Supprimer une trace
   * @tags Traces
   * @param { number } id.path.required - Identifiant de la trace
   * @return {} 204 - Réponse en cas de succès
   * @return { ApiJsonError } 400 - Réponse en cas de mauvais appel - application/json
   * @return { ApiJsonError } 404 - Réponse en cas de réponse non trouvée - application/json
   * @return { ApiJsonError } 500 - Réponse en cas de problème serveur - application/json
   */
  .delete(
    authenticateToken,
    controllerWrapper(TracesController.delete.bind(TracesController))
  );

tracesRouter
  .route("/")
  /**
   * GET /api/traces
   * @summary Récupérer toutes les traces
   * @tags Traces
   * @return { Trace[] } 200 - Réponse en cas de succès - application/json
   * @return { ApiJsonError } 400 - Réponse en cas de mauvais appel - application/json
   * @return { ApiJsonError } 404 - Réponse en cas de réponse non trouvée - application/json
   * @return { ApiJsonError } 500 - Réponse en cas de problème serveur - application/json
   */
  .get(controllerWrapper(TracesController.getAll.bind(TracesController)))

  /**
   * POST /api/traces
   * @summary Ajouter une nouvelle trace
   * @tags Traces
   * @param { TraceBody } request.body.required - Information de la nouvelle trace
   * @return { Trace } 200 - Réponse en cas de succès - application/json
   * @return { ApiJsonError } 400 - Réponse en cas de mauvais appel - application/json
   * @return { ApiJsonError } 404 - Réponse en cas de réponse non trouvée - application/json
   * @return { ApiJsonError } 500 - Réponse en cas de problème serveur - application/json
   */
  .post(
    authenticateToken,
    validationMiddleware("body", tracesPostSchema),
    controllerWrapper(TracesController.create.bind(TracesController))
  );

tracesRouter.use((_, __, next) =>
  next(new ApiError("Ressources non trouvées", { httpStatus: 404 }))
);

export default tracesRouter;

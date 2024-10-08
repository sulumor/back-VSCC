import logger from "../logger/index.logger.js";

/**
 * @params {Error} err
 * @params {Express.Request} req
 * @params {Express.Response} res
 * @params {Express.NextFunction} next
 * @returns {Express.Response}
 *
 */
export default (err: any, _: any, res: any, __: any): Express.Response => {
  if (err.httpStatus === 500) logger.error(" Serveur erreur", err);
  if (err.format === "html") {
    return res.status(err.httpStatus).render("error", { error: err });
  }
  return res.status(err.httpStatus).json({ error: err.message });
};

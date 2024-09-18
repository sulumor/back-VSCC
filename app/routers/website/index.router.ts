import { Router } from "express";
import WebsiteError from "../../errors/website.error";
import controllerWrapper from "../../helpers/controller.wrapper";
import controller from "../../controllers/website/website.controller";

const websiteRouter = Router();

/**
 * GET /
 * @summary Homepage
 * @tags ...
 * @param {} request.body.required - ... info
 * @return {} 200 - Success response - application/json
 * @return {ApiJsonError} 400 - Bad request response - application/json
 * @return {ApiJsonError} 500 - Internal Server Error - application/json
 */
websiteRouter.route("/").get(controllerWrapper(controller.homePage));

websiteRouter.use((_, __, next) => {
  next(new WebsiteError("Page not Found", { httpStatus: 404 }));
});

export default websiteRouter;

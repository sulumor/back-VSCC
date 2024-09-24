import { Router } from "express";
import tracesRouter from "./traces.router";
import usersRouter from "./users.router";
import ApiError from "@/errors/api.error";

const apiRouter = Router();

apiRouter.use("/traces", tracesRouter);
apiRouter.use("/users", usersRouter);

apiRouter.use((_, __, next) =>
  next(new ApiError("Ressources non trouvées", { httpStatus: 404 }))
);

export default apiRouter;

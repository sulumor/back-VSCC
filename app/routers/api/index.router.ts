import { Router } from "express";
import tracesRouter from "./traces.router";
// import usersRouter from "./users.router";

const apiRouter = Router();

apiRouter.use("/traces", tracesRouter);
// apiRouter.use("/users", usersRouter);

export default apiRouter;

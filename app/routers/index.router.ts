import { Router } from "express";
import apiRouter from "./api/index.router";
import websiteRouter from "./website/index.router";
import authRouter from "./auth/index.router";
import ApiError from "@/errors/api.error";

const router = Router();

router.use("/api", apiRouter);
router.use("/auth", authRouter);
router.use("/", websiteRouter);

router.use((_, __, next) =>
  next(new ApiError("Ressources non trouvées", { httpStatus: 404 }))
);

export default router;

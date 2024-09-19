import { Router } from "express";
import apiRouter from "./api/index.router";
import websiteRouter from "./website/index.router";
import authRouter from "./auth/index.router";

const router = Router();

router.use("/api", apiRouter);
router.use("/auth", authRouter);
router.use("/", websiteRouter);

export default router;

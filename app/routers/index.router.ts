import express from "express";
import apiRouter from "./api/index.router";
import websiteRouter from "./website/index.router";

const router = express.Router();

router.use("/api", apiRouter);
router.use("/", websiteRouter);

export default router;

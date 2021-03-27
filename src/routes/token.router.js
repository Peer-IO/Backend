import { refreshTokens } from "../controllers/token.controller";
import { Router } from "express";

const router = Router();

router.get("/", refreshTokens);

export default router;

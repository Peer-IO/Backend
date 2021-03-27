import { Router } from "express";
import { signin, signup } from "../controllers/auth.controller";
import { verifyIDToken } from "../utils/auth";

const router = Router();

router.use(verifyIDToken);

router.post("/signin", signin);
router.post("/signup", signup);

export default router;

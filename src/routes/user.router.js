import { me, updateMe } from "../controllers/user.controller";
import { Router } from "express";
import { protect } from "../services/auth";

const router = Router();

router.use(protect);
router.get("/", me);
router.put("/", updateMe);

export default router;

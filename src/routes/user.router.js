import {
	me,
	updateMe,
	revokeRefreshToken,
	registercourse,
	mycourses
} from "../controllers/user.controller";
import { Router } from "express";
import { protect } from "../services/auth";

const router = Router();

router.use(protect);
router.get("/", me);
router.put("/", updateMe);
router.get("/revoke", revokeRefreshToken);
router.route("/course")
	.get(mycourses)
	.put(registercourse);

export default router;

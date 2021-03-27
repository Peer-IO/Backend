import { Router } from "express";
import "../controllers/teacher.controller";
import { createCourse, deleteCourse, getCourse, updateCourse } from "../controllers/teacher.controller";
import { protect } from "../services/auth";

const router = Router();

router.use(protect);

router.route("/course")
	.post(createCourse)
	.get(getCourse);

router.route("/course/:code")
	.put(updateCourse)
	.delete(deleteCourse);

export default router;

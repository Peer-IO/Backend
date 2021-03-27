import { Router } from "express";
import "../controllers/teacher.controller";
import { createCourse, deleteCourse, getCourses, getCourse, updateCourse } from "../controllers/teacher.controller";
import { protect } from "../services/auth";

const router = Router();

router.use(protect);

router.route("/course")
	.post(createCourse)
	.get(getCourses);

router.route("/course/:code")
	.get(getCourse)
	.put(updateCourse)
	.delete(deleteCourse);

export default router;

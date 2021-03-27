import { Router } from "express";
import "../controllers/teacher.controller";
import { createCourse, deleteCourse, getCourses, getCourse, updateCourse } from "../controllers/teacher.controller";
import { protect } from "../services/auth";
import { forbidden } from "../services/controller";

const router = Router();

router.use(protect);

router.route("/course")
	.get(getCourses)
	.put(forbidden)
	.post(createCourse)
	.delete(forbidden);


router.route("/course/:code")
	.get(getCourse)
	.put(updateCourse)
	.post(forbidden)
	.delete(deleteCourse);

export default router;

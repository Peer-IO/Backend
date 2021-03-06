import { Router } from "express";
import {
	addAssignment,
	getAssignment,
	updateAssignment,
	getAllAssignments,
	deleteAssignment,
} from "../controllers/assignment.controller";
import { protect } from "../services/auth";
import { forbidden } from "../services/controller";

const router = Router();

router.use(protect);

router
	.route("/")
	.get(getAllAssignments)
	.put(forbidden)
	.post(addAssignment)
	.delete(forbidden);
router
	.route("/:id")
	.get(getAssignment)
	.put(updateAssignment)
	.post(forbidden)
	.delete(deleteAssignment);

export default router;

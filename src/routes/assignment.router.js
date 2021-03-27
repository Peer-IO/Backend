import { Router } from "express";
import {
	addAssignment,
	getAssignment,
	updateAssignment,
	getAllAssignments,
	deleteAssignment,
	forbidden,
} from "../controllers/assignment.controller";
const router = Router();

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

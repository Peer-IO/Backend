import { Router } from "express";
import { protect } from "../services/auth";
import { getSubmission, createSubmission, deleteSubmission, getSingleSubmission, updateSubmission } from "../controllers/submission.controller";
import { forbidden } from "../services/controller";

const router = Router();

router.use(protect);

router
	.route("/")
	.get(getSubmission)
	.put(forbidden)
	.post(createSubmission)
	.delete(forbidden);

router
	.route("/:id")
	.get(getSingleSubmission)
	.put(updateSubmission)
	.post(forbidden)
	.delete(deleteSubmission);

router.use(protect);

export default router;

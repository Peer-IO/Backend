import { Router } from "express";
import { protect } from "../services/auth";
import { forbidden } from "../services/controller";
import { createReview, getReviews, updateReview, deleteReview, getSingleReview } from "../controllers/review.controller";

const router = Router();

router.use(protect);

router.route("/")
	.get(getReviews)
	.put(forbidden)
	.post(createReview)
	.delete(forbidden);

router.route("/:id")
	.get(getSingleReview)
	.put(updateReview)
	.post(forbidden)
	.delete(deleteReview);

export default router;

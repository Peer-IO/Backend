import mongoose from "mongoose";
import { User } from "./user.model";
import { Submission } from "./submission.model";

const reviewSchema = new mongoose.Schema({
	course: {
		type: mongoose.Types.ObjectId,
		ref: "Course"
	},
	submission: {
		type: mongoose.Types.ObjectId,
		ref: "Submission",
	},
	assignment: {
		type: mongoose.Types.ObjectId,
		ref: "Assigment",
	},
	reviewer: {
		type: mongoose.Types.ObjectId,
		ref: "User",
	},
	scores: {
		type: Array /* scores to be stored in order [[crtron-1, crtron-2, ...], -> task-1 scores
                            criterion scores  <-  [crtron-1, crtron-2, ...], -> task-2 scores
                                                  ... ]*/,
		required: true,
	},
});

// updating the reviewer field.
reviewSchema.post("save", async function(next) {
	try {
		let user = await User.findById(this.reviewer);
		user.reviews.push(this._id);
		await user.save();
	} catch (err) {
		next(err);
	}
	try {
		let sub = await Submission.findById(this.submission);
		sub.reviews.push(this._id);
		await sub.save();
		next();
	} catch (err) {
		next(err);
	}
});
export const Review = mongoose.model("Review", reviewSchema);

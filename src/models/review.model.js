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
	remark: {
		type: String,
		required: true,
		trim: true
	},
	scores: {
		type: Number,
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

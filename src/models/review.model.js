import mongoose from "mongoose";
import { crudControllers } from "../services/crud";
import { Submission } from "./submission.model";

const reviewSchema = new mongoose.Schema({
	course: {
		type: mongoose.Types.ObjectId,
		ref: "Course",
		required: true
	},
	submission: {
		type: mongoose.Types.ObjectId,
		ref: "Submission",
		required: true
	},
	assignment: {
		type: mongoose.Types.ObjectId,
		ref: "Assigment",
		required: true
	},
	reviewer: {
		type: mongoose.Types.ObjectId,
		ref: "User",
		required: true
	},
	remark: {
		type: String,
		required: true,
		trim: true
	},
	score: {
		type: Number,
		required: true,
	},
}, {timestamps: true});
reviewSchema.pre("deleteOne", { document: true, query: false }, async function(next) {
	try {
		const submissionId = this.submission;
		const submission = await Submission.findOne({_id: this.submission});
		if(submission.number_of_reviews === 1) {
			await Submission.findByIdAndUpdate(submissionId, { number_of_reviews: 0, avg_score: 0 });
		} else {
			const newAvg = ((submission.avg_score * submission.number_of_reviews) - this.score) / (submission.number_of_reviews
				- 1);
			await Submission.findByIdAndUpdate(submissionId, { "$inc": {number_of_reviews: -1}, avg_score: Math.max(newAvg, 0) });
		}
	} catch(err) {
		console.log("review.model.js line: 56");
		next(err);
	}
	next();
});
export const Review = mongoose.model("Review", reviewSchema);

export default crudControllers(Review);

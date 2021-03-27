import mongoose from "mongoose";
import { crudControllers } from "../services/crud";
import { Submission } from "./submission.model";
import { Review } from "./review.model";
const assignmentSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			trim: true,
			required: true
		},
		description: {
			type: String,
			trim: true,
		},
		course: {
			type: mongoose.Types.ObjectId,
			ref: "Course"
		},
		totalPoints: {
			type: Number,
			required: true
		},
		submissionDeadline: {
			type: Date,
			required: true
		},
		reviewDeadline: {
			type: Date,
			required: true
		},
		attachments: {
			type: [
				String
			]
		}
	}, {timestamps: true}
);

assignmentSchema.pre("deleteOne", { document: true, query: false }, async function(next) {
	const promiseArray = [];
	try {
		promiseArray.push(Submission.deleteMany({assignment: this._id}));
		promiseArray.push(Review.deleteMany({assignment: this._id}));
		await Promise.all(promiseArray);
	} catch(err) {
		next(err);
	}
	next();
});
export const Assignment = mongoose.model("Assignment", assignmentSchema);

export default crudControllers(Assignment);
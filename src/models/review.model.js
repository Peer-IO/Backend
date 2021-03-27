import mongoose from "mongoose";
import { crudControllers } from "../services/crud";

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

export const Review = mongoose.model("Review", reviewSchema);

export default crudControllers(Review);

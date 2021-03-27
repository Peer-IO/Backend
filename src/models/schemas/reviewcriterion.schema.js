import mongoose from "mongoose";

export const reviewCriterionSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
		maxlength: 100,
	},
	points: {
		type: Number,
		required: true,
		default: 0
	}
});
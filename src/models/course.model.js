import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 20,
		},
		code: {
			type: String,
			required: true,
			trim: true,
		},
		instructor: {
			type: mongoose.Types.ObjectId,
			ref: "User"
		},
		ta: [{
			type: mongoose.Types.ObjectId,
			ref: "User"
		}],
		assignments: [{
			type: mongoose.Types.ObjectId,
			ref: "Assignment"
		}],
		totalStudents: {
			type: Number,
			default: 0,
		}
	},
	{
		timestamps: true
	}
);

export const Course = mongoose.model("Course", courseSchema);
import mongoose from "mongoose";
import { crudControllers } from "../services/crud";
import uniqueValidator from "mongoose-unique-validator";

const courseSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		code: {
			type: String,
			required: true,
			trim: true,
			unique: true,
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
		},
	},
	{
		timestamps: true
	}
);

courseSchema.plugin(uniqueValidator);

export const Course = mongoose.model("Course", courseSchema);
export default crudControllers(Course);

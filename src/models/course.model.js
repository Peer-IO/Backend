import mongoose from "mongoose";
import { crudControllers } from "../services/crud";
import { randomString } from "../services/random";
import uniqueValidator from "mongoose-unique-validator";

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
		classCode: {
			type: String,
			required: true,
			unique: true
		}
	},
	{
		timestamps: true
	}
);

courseSchema.pre("save",async function (next) {
	let classCode = randomString(7);
	let exists = await Course
		.find({ classCode })
		.select("classCode")
		.exec();

	while (exists) {
		classCode = randomString(7);
		exists = await Course
			.find({ classCode })
			.select("classCode")
			.exec();
	}
	this.classCode = classCode;
	next();
});

courseSchema.plugin(uniqueValidator);

export const Course = mongoose.model("Course", courseSchema);
export default crudControllers(Course);

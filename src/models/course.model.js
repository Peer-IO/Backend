import mongoose from "mongoose";
import { crudControllers } from "../services/crud";
import uniqueValidator from "mongoose-unique-validator";
import { Assignment } from "./assignment.model";
import { Submission } from "./submission.model";
import { Review } from "./review.model";
import { User } from "./user.model";

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

courseSchema.pre("deleteOne", { document: true, query: false }, async function(next) {
	const promiseArray = [];
	try {
		promiseArray.push(Assignment.deleteMany({course: this._id}));
		promiseArray.push(Submission.deleteMany({course: this._id}));
		promiseArray.push(Review.deleteMany({ course: this._id }));
		promiseArray.push(User.updateMany({ courses: this._id }, { $pull: { courses: this._id } }));
		await Promise.all(promiseArray);
	} catch(err) {
		next(err);
	}
	next();
});

courseSchema.plugin(uniqueValidator);

export const Course = mongoose.model("Course", courseSchema);
export default crudControllers(Course);

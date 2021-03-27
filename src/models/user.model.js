import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { crudControllers } from "../services/crud";

const userSchema = new mongoose.Schema(
	{
		first_name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 50,
		},
		last_name: {
			type: String,
			required: false,
			trim: true,
			maxlength: 50,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			immutable: true,
		},
		institution: {
			type: String,
			required: true,
			trim: true,
		},
		nationality: {
			type: String,
			required: false,
			trim: true,
		},
		gender: {
			type: String,
			required: false,
			enum: ["male", "female", "other"],
		},
		roll_number: {
			type: Number,
			required: false,
			maxlength: 11,
		},
		uid: {
			required: true,
			type: String,
			unique: true,
			immutable: true,
		},
		email_verified: {
			type: Boolean,
			required: true,
		},
		teacher: {
			type: Boolean,
			required: true,
			default: false
		},
		courses: [{
			type: mongoose.Types.ObjectId,
			ref: "Course",
		}],
	},
	{ timestamps: true }
);

userSchema.set("toJSON", {
	versionKey: false,
});

userSchema.plugin(uniqueValidator);

export const User = mongoose.model("User", userSchema);

export default crudControllers(User);

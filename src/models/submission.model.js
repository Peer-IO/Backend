import mongoose from "mongoose";
import { Review } from "./review.model";
import { crudControllers } from "../services/crud";

const submissionSchema = new mongoose.Schema({
	course: {
		type: mongoose.Types.ObjectId,
		ref: "Course",
		required: true
	},
	assignment: {
		type: mongoose.Types.ObjectId,
		ref: "Assignment",
		required: true
	},
	submitter: {
		type: mongoose.Types.ObjectId,
		ref: "User",
		required: true
	},
	reviews: [{
		type: mongoose.Types.ObjectId,
		ref: "Review",
		required: true
	}],
	attachments: [{
		type: String, // to store the links for the attatchments of a submission in same sequence as those of task.
	}]
}, {timestamps: true});
// Removing the reviews for the submission if it is deleted.
submissionSchema.pre("deleteOne", { document: true, query: false }, async function(next) {
	try {
		await Review.deleteMany({submission: this._id});
	} catch(err) {
		next(err);
	}
	next();
});
export const Submission = mongoose.model("Submission", submissionSchema);

export default crudControllers(Submission);

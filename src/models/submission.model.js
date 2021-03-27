import mongoose from "mongoose";
import { Review } from "./review.model";
import { crudControllers } from "../services/crud";
import { Assignment } from "./assignment.model";

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
	}],
	number_of_reviews: {
		type: Number,
		default: 0,
		min: 0,
		max: 3
	},
	avg_score: {
		type: Number,
		default: 0,
		min: 0
	}
}, {timestamps: true});
// Removing the reviews for the submission if it is deleted.
submissionSchema.pre("save", function (next) {
	this.wasNew = this.isNew;
	next();
});
submissionSchema.pre("deleteOne", { document: true, query: false }, async function(next) {
	try {
		const assignmentId = this.assignment;
		await Review.deleteMany({submission: this._id});
		await Assignment.findByIdAndUpdate(assignmentId, { "$inc": {number_of_submissions: -1} });
	} catch(err) {
		console.log("submission.model.js line: 49");
		next(err);
	}
	next();
});
submissionSchema.post("save", { document: true, query: false }, async function(next) {
	try {
		if(this.wasNew) {
			const assignmentId = this.assignment;
			await Assignment.findByIdAndUpdate(assignmentId, { "$inc": {number_of_submissions: 1} });
		}
	} catch(err) {
		console.log("submission.model.js line: 62");
		next(err);
	}

});
export const Submission = mongoose.model("Submission", submissionSchema);

export default crudControllers(Submission);

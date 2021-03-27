import mongoose from "mongoose";
import { User } from "./user.model";
import { Assignment } from "./assignment.model";

const submissionSchema = new mongoose.Schema({
	course: {
		type: mongoose.Types.ObjectId,
		ref: "Course"
	},
	assignment: {
		type: mongoose.Types.ObjectId,
		ref: "Assignment"
	},
	submitter: {
		type: mongoose.Types.ObjectId,
		ref: "User"
	},
	reviews: [{
		type: mongoose.Types.ObjectId,
		ref: "Review"
	}],
	attachments: [{
		type: String, // to store the links for the attatchments of a submission in same sequence as those of task.
	}]
});

// updating the related assignment and user with submission id.
submissionSchema.post("save", async function (next) {
	try {
		let student = await User.findById(this.submitter);
		student.submissions.push(this._id);
		await student.save();
	}catch(err) {
		next(err);
	}
	try {
		let assign = await Assignment.findById(this.assignment);
		assign.submissions.push(assign);
		await assign.save();
		next();
	} catch(err) {
		next(err);
	}
});

export const Submission = mongoose.model("Submission", submissionSchema);

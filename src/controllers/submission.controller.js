import submissionCrud, { Submission } from "../models/submission.model";
import courseCrud from "../models/course.model";
import assignmentCrud from "../models/assignment.model";

export const createSubmission = async (req, res) => {
	const user = req.user;
	const course = await courseCrud.getOneDoc({ findBy: {_id: req.body.course} });
	if(!req.body.attachments || req.body.attachments.length === 0)
		return res.status(400).json({message: "No attachments found."});
	if(!course)
		return res.status(400).json({ message:"Invalid Course Id." });
	const assignment = await assignmentCrud.getOneDoc({ findBy: { _id: req.body.assignment} });
	if(!assignment)
		return res.status(400).json({message: "Assignment not found."});
	if(assignment.course != req.body.course)
		return res.status(400).json({error: "Assignment not found in course."});
	try {
		const submission = await submissionCrud.createOne({body:{...req.body, submitter: user._id, reviews: []}});
		return res.status(201).json(submission);
	} catch(err) {
		return res.status(400).json({error: err.message});
	}
};
export const getSubmission = async (req, res) => {
	try {
		const assignmentId = req.query.assignmentId;
		const courseId = req.query.courseId;
		const userSpecific = req.query.userSpecific;
		if(assignmentId && !(await assignmentCrud.getOne({findBy: {_id: assignmentId}}))) {
			return res.status(400).json({error: "Invalid assignment Id."});
		}
		if(courseId && !(await courseCrud.getOne({findBy: {_id: courseId}}))) {
			return res.status(400).json({error: "Invalid course Id."});
		}
		let findBy = {};
		if(userSpecific === "T") {
			findBy.submitter = req.user._id;
			if(!courseId && !assignmentId) {
				// returns all the submissions for a user regardless of assignments and course.
				console.log("1");
				findBy.submitter = req.user._id;
				console.table(findBy);
				// populate({path:"ta", select:"first_name email -_id"}).populate({path:"instructor",select:"first_name email -_id"});
				const submissions = await Submission.find(findBy).populate({path: "assignment", select: "title totalPoints _id"}).populate({path: "course", select: "name _id"}).populate({path: "submitter", select: "first_name email _id"});
				return res.status(200).json(submissions);
			} else if(courseId && assignmentId) {
				// returns all submissions of a user for a given assignment in given course.
				console.log("2");
				findBy.course = courseId;
				findBy.assignment = assignmentId;
				const submissions = await Submission.find(findBy).populate({path: "assignment", select: "title totalPoints _id"}).populate({path: "course", select: "name _id"}).populate({path: "submitter", select: "first_name email _id"});
				return res.status(200).json(submissions);
			}
		} else if( userSpecific === "F") {
			if(!courseId && !assignmentId) {
				console.log("3");
				res.statusCode = 403;
				return res.send("endpoint not supported.");
			} else if(courseId && assignmentId) {
				// return all the submissions for a given course and given assignment.
				console.log("4");
				findBy.course = courseId;
				findBy.assignment = assignmentId;
				const submissions = await Submission.find(findBy).populate({path: "assignment", select: "title totalPoints _id"}).populate({path: "course", select: "name _id"}).populate({path: "submitter", select: "first_name email _id"});
				res.status(200).json(submissions);
			}
		} else {
			res.statusCode = 400;
			return res.json({error: "specify userSpecific as T and F"});
		}
	} catch(e) {
		return res.status(400).json({error: e.message});
	}
};
export const deleteSubmission = async(req, res) => {
	const submissionId = req.params.id;
	try {
		const submission = await submissionCrud.getOneDoc({findBy: {_id: submissionId}});
		const submitterId = submission.submitter.toString();
		const userId = req.user._id.toString();
		if(submitterId === userId) {
			submission.deleteOne();
			res.statusCode = 204;
			return res.send();
		} else {
			return res.status(400).json({error: "Only submitter can delete."});
		}
	} catch(err) {
		return res.status(400).json({error: err.message});
	}
};

export const getSingleSubmission = async (req, res) => {
	try {
		const submission = await submissionCrud.getOne({findBy: {_id: req.params.id}});
		if(submission) {
			return res.status(200).json(submission);
		} else {
			return res.status(404).json({error: "No submission for given Id exists."});
		}
	} catch(err) {
		return res.status(400).json({error: err.message});
	}
};

export const updateSubmission = async (req, res) => {
	try {
		if(req.params.id === req.user_id.toString()){
			const updatedSubmission = await Submission.findByIdAndUpdate({_id: req.params.id}, {"$set" : {attachments: req.body.attachments}}, {new: true});
			return res.status(200).json(updatedSubmission);
		} else {
			return res.status(400).json({error: "Only submitter can update the submission."});
		}
	} catch(err) {
		return res.status(400).json({error: err.message});
	}
};
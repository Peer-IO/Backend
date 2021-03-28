import submissionCrud, { Submission } from "../models/submission.model";
import courseCrud from "../models/course.model";
import assignmentCrud from "../models/assignment.model";
import { isSubmissionUpdatable } from "../services/controller";

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
	console.log("assignment:", assignment);
	console.log(assignment.course.toString());
	console.log(req.body.course);
	if(assignment.course.toString() !== req.body.course)
		return res.status(400).json({error: "Assignment not found in course."});
	const submissionDeadline = new Date(assignment.submissionDeadline.toString());
	if(submissionDeadline >= new Date()) {
		try {
			const submission = await submissionCrud.createOne({body:{...req.body, submitter: user._id, reviews: []}});
			return res.status(201).json(submission);
		} catch(err) {
			return res.status(400).json({error: err.message});
		}
	} else {
		return res.status(403).json({error: "Submission deadline is over."});
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
				if(req.user.teacher) {
					findBy.course = courseId;
					findBy.assignment = assignmentId;
					const submissions = await Submission.find(findBy).populate({path: "assignment", select: "title totalPoints _id"}).populate({path: "course", select: "name _id"}).populate({path: "submitter", select: "first_name email _id"});
					return res.status(200).json(submissions);
				} else {
					return res.status(400).json({error: "Only available to instructor."});
				}
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
		if(submission) {
			const submitterId = submission.submitter.toString();
			const userId = req.user._id.toString();
			if(submitterId === userId){
				const assignment = await assignmentCrud.getOne({findBy: {_id: req.body.assignment}});
				if(assignment) {
					if(submission && assignment._id.toString() === submission.assignment.toString()) {
						if(isSubmissionUpdatable(assignment)) {
							submission.deleteOne();
							res.statusCode = 204;
							return res.send();
						} else {
							return res.status(403).json({error: "Submission Deadline is over."});
						}
					} else {
						console.log("submission:", submission);
						return res.status(400).json({error: "Submission is not for given assignment."});
					}
				} else {
					return res.status(404).json({error: "Assignment does not exists."});
				}
			} else {
				return res.status(400).json({error: "Only submitter can delete the submission."});
			}
		} else {
			return res.status(404).json({error: "Submission does not exists."});
		}
	} catch(err) {
		console.log(err);
		return res.status(400).json({error: err.message});
	}
};

export const getSingleSubmission = async (req, res) => {
	try {
		const submission = await Submission.findById(req.params.id).populate({path: "assignment", select: "title totalPoints _id"}).populate({path: "course", select: "name _id"}).populate({path: "submitter", select: "first_name email _id"});
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
		const submission = await submissionCrud.getOne({findBy: {_id: req.params.id}});
		const submitterId = submission.submitter.toString();
		if(submitterId === req.user._id.toString()){
			const assignment = await assignmentCrud.getOne({findBy: {_id: req.body.assignment}});
			if(assignment) {
				if(submission && assignment._id.toString() === submission.assignment.toString()) {
					if(isSubmissionUpdatable(assignment)) {
						const updatedSubmission = await Submission.findByIdAndUpdate({_id: req.params.id}, {"$set" : {attachments: req.body.attachments}}, {new: true});
						return res.status(200).json(updatedSubmission);
					} else {
						return res.status(403).json({error: "Submission Deadline is over."});
					}
				} else {
					console.log("submission:", submission);
					return res.status(400).json({error: "Submission is not for given assignment."});
				}
			} else {
				return res.status(404).json({error: "Assignment does not exists."});
			}
		} else {
			return res.status(400).json({error: "Only submitter can update the submission."});
		}
	} catch(err) {
		console.log(err);
		return res.status(400).json({error: err.message});
	}
};
export const getReviewedSubmissions = async (req, res) => {
	if(req.user.teacher) {
		const assignment = await assignmentCrud.getOne({findBy: {_id: req.query.assignmentId}});
		const courseId = req.query.courseId;
		if(assignment) {
			if(assignment.course.toString() === req.query.courseId) {
				const submissions = await Submission.find({number_of_reviews: {"$gte": 3}, course: courseId, assignment: assignment._id}).populate({path: "assignment", select: "title totalPoints _id"}).populate({path: "course", select: "name _id"}).populate({path: "submitter", select: "first_name email _id"});
				return res.status(200).json(submissions);
			} else {
				return res.status(400).json({error: "Course is not of provided assignment."});
			}
		} else {
			return res.status(400).json({error: "Assignment not found."});
		}
	} else {
		return res.status(403).json({error: "Only available to instructor."});
	}
};
export const getInPhaseSubmissions = async (req, res) => {
	if(req.user.teacher) {
		const assignment = await assignmentCrud.getOne({findBy: {_id: req.query.assignmentId}});
		const courseId = req.query.courseId;
		if(assignment) {
			if(assignment.course.toString() === req.query.courseId) {
				const submissions = await Submission.find({number_of_reviews: {"$lt": 3}, course: courseId, assignment: assignment._id}).populate({path: "assignment", select: "title totalPoints _id"}).populate({path: "course", select: "name _id"}).populate({path: "submitter", select: "first_name email _id"});
				return res.status(200).json(submissions);
			} else {
				return res.status(400).json({error: "Course is not of provided assignment."});
			}
		} else {
			return res.status(400).json({error: "Assignment not found."});
		}
	} else {
		return res.status(403).json({error: "Only available to instructor."});
	}
};

import submissionCrud from "../models/submission.model";
import assignmentCrud from "../models/assignment.model";
import reviewCrud, { Review } from "../models/review.model";

export const createReview = async (req, res) => {
	const submissionId = req.body.submission;
	const assignmentId = req.body.assignment;
	const courseId = req.body.course;
	const submission = await submissionCrud.getOne({findBy: {_id: submissionId}});
	if(!submission) {
		return res.status(400).json({error: "Submission does not exists."});
	}
	console.log("submission:", submission);
	console.log("assignmentId:", assignmentId);
	console.log("submission.assignment:", submission.assignment);
	console.log("submission._id:", submission._id);
	console.log("submissionId:", submissionId);
	if(assignmentId !== submission.assignment.toString()) {
		return res.status(400).json({error: "Provided assignment does not match with submission's assignment."});
	}
	if(courseId !== submission.course.toString()) {
		return res.status(400).json({error: "Provided course does not match with submission's assignment."});
	}
	if(assignmentId === submission.assignment.toString() && courseId === submission.course.toString()) {
		const assignment = await assignmentCrud.getOne({findBy: {_id: assignmentId}});
		const date1 = new Date(assignment.reviewDeadline.toString());
		const date2 = new Date();
		if(date2 <= date1) {
			const review = await reviewCrud.createOne({body: {...req.body, reviewer: req.user._id}});
			return res.status(201).json(review);
		} else {
			return res.status(403).json({error: "Cannot review as deadline is completed."});
		}
	} else {
		return res.status(400).json({error: "Provided course or assignment does not match with submission's assignment or course."});
	}
};
export const getReviews = async (req, res) => {
	try {
		const submissionId = req.query.submission;
		const reviewer = req.query.reviewer;
		if(submissionId && !reviewer) {
			const reviews = await Review.find({ submission: submissionId}).populate({path: "course", select: "name code classCode _id"}).populate({path: "reviewer", select: "_id first_name email roll_number"});
			return res.status(200).json(reviews);
		} else if(!submissionId && reviewer) {
			const reviews = await Review.find({reviewer: reviewer}).populate({path: "course", select: "name code classCode _id"}).populate({path: "reviewer", select: "_id first_name email roll_number"});
			return res.status(200).json(reviews);
		} else {
			return res.status(400).json({error: "Specify either submission or user"});
		}
	} catch(err) {
		return res.status(400).json({error: err.message});
	}
};
export const updateReview = async(req, res) => {
	try {
		const review = await reviewCrud.getOneDoc({findBy: {_id: req.params.id}});
		if(review.reviewer.toString() !== req.user._id.toString()) {
			res.status(403).json({error: "You are not reviewer of this review."});
		} else {
			const updatedReview = await reviewCrud.updateOne({findBy: {_id: req.params.id}, updateBody: req.body});
			return res.status(200).json(updatedReview);
		}
	} catch(err) {
		return res.status(400).json({error: err.message});
	}
};
export const deleteReview = async(req, res) => {
	try {
		const review = await reviewCrud.getOneDoc({findBy: {_id: req.params.id}});
		console.log(review.reviewer);
		console.log(req.user._id);
		if(review.reviewer.toString() !== req.user._id.toString()) {
			res.status(403).json({error: "You are not reviewer of this review."});
		} else {
			await review.deleteOne();
			res.statusCode = 204;
			return res.send("Successfully deleted the review.");
		}
	} catch(err) {
		return res.status(400).json({error: err.message});
	}
};

export const getSingleReview = async (req, res) => {
	try {
		const id = req.params.id;
		const review = await Review.findById(id).populate({path: "course", select: "name code classCode _id"}).populate({path: "reviewer", select: "_id first_name email roll_number"});
		console.log("review:", review);
		if(review) {
			return res.status(200).json(review);
		} else {
			res.status(404).json({error: "NO review with provided id!"});
		}
	} catch(err) {
		console.log("error: ", err);
		res.status(400).json({error: err.message});
	}
};
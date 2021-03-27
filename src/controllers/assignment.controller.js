import assignmentCrud from "../models/assignment.model";
import courseCrud from "../models/course.model";

export const getAllAssignments = async (req, res, next) => {
	const courseId = req.query.courseId;
	const findBy = {
		course: courseId
	};
	const assignments = await assignmentCrud.getMany({findBy}).catch(next);
	return res.status(200).json(assignments);
};

export const addAssignment = async (req, res, next) => {
	console.table(req.body);
	try {
		const newAssignment = await assignmentCrud.createOne({body: req.body});
		const course = await courseCrud.getOneDoc({ findBy: { _id: req.query.courseId } });
		course.assignments.push(newAssignment._id);
		await course.save();
		return res.status(201).json(newAssignment);
	} catch(err) {
		return next(err);
	}
};

export const deleteAssignment = async (req, res, next) => {
	const assignmentId = req.params.id;
	const courseId = req.bodycourseId;
	try {
		let assignment = await assignmentCrud.getOneDoc({ _id: assignmentId });
		await assignment.deleteOne();
		const course = await courseCrud.getOneDoc({ _id: courseId });
		course.assignments = course.assignments.filter( assign => (assign !== assignmentId) );
		await course.save();
		res.statusCode = 204;
		res.send();
	} catch(err) {
		return next(err);
	}
};

export const getAssignment = async (req, res, next) => {
	const assignmentId = req.params.assignmentId;
	const assignment = await assignmentCrud.getOne({ findBy: assignmentId }).catch(next);
	return res.status(200).json(assignment);
};

export const updateAssignment = async (req, res, next) => {
	const assignmentId = req.params.id;
	delete req.body.user;
	try {
		const updatedAssignment = await assignmentCrud.updateOne({  findBy: { _id: assignmentId }, updateBody: req.body });
		return res.status(200).json(updatedAssignment);
	} catch(err) {
		next(err);
	}
};

export const forbidden = async (req, res) => {
	res.statusCode = 403;
	res.send("Endpoint not supported.");
};
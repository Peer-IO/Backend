import assignmentCrud, { Assignment } from "../models/assignment.model";
import courseCrud from "../models/course.model";

export const getAllAssignments = async (req, res, next) => {
	const courseId = req.query.courseId;
	const findBy = {
		course: courseId
	};
	const assignments = await assignmentCrud.getMany({findBy}).catch(next);
	return res.status(200).json(assignments);
};

export const addAssignment = async (req, res) => {
	try {
		if(req.user.teacher) {
			const course = await courseCrud.getOneDoc({ findBy: { _id: req.query.courseId } });
			if(course) {
				if(course.instructor.toString() === req.user._id.toString()){
					const newAssignment = await assignmentCrud.createOne({body: {...req.body, course: req.query.courseId}});
					course.assignments.push(newAssignment._id);
					await course.save();
					return res.status(201).json(newAssignment);
				} else {
					return res.status(403).json({error: "You are not instructor of this course."});
				}
			} else {
				return res.status(404).json({error: "course not found."});
			}
		} else {
			return res.status(403).json({error: "Only instructor can add assignment."});
		}
	} catch(err) {
		return res.status(400).json({error: err.message});
	}
};

export const deleteAssignment = async (req, res) => {
	const assignmentId = req.params.id;
	const courseId = req.body.course;
	try {
		let assignment = await Assignment.findById(assignmentId).populate({path: "course", select: "instructor _id"});
		if(assignment.course.instructor.toString() === req.user._id.toString()) {
			await assignment.deleteOne();
			const findBy = { _id: courseId };
			const updateBody = { $pull: { assignments: assignmentId }};
			await courseCrud.updateOne({ findBy, updateBody });
			res.statusCode = 204;
			res.send();
		} else {
			return res.status(403).json({error: "You are not creator of the assignment."});
		}
	} catch(err) {
		return res.status(400).json({error: err.message});
	}
};

export const getAssignment = async (req, res, next) => {
	const assignmentId = req.params.assignmentId;
	const assignment = await assignmentCrud.getOne({ findBy: assignmentId }).catch(next);
	return res.status(200).json(assignment);
};

export const updateAssignment = async (req, res) => {
	const assignmentId = req.params.id;
	try {
		let assignment = await Assignment.findById(assignmentId).populate({path: "course", select: "instructor _id"});
		if(assignment.course.instructor.toString() === req.user._id.toString()) {
			const updatedAssignment = await assignmentCrud.updateOne({  findBy: { _id: assignmentId }, updateBody: req.body });
			return res.status(200).json(updatedAssignment);
		} else {
			return res.status(403).json({error: "You are not creator of the assignment."});
		}
	} catch(err) {
		return res.status(400).json({error: err.message});
	}
};

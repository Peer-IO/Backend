import courseCrud, { Course } from "../models/course.model";
import {User} from "../models/user.model";
import { randomString } from "../services/random";

export const createCourse = async (req, res, next) => {
	if (!req.body.name || !req.body.code)
		return res.status(400).json({ "error": "Name and Code are necessary" });
	if (!req.user.teacher)
		return res.status(401).json({ "error": "Only Teachers can create course" });
	const validateCode = req.body.code.search(/[^\w\s-]/);
	if (validateCode !== -1)
		return res.status(400).json({ "error": "Course Code can contain only alphanumeric and hyphen" });

	const classCode = await generateClassCode();
	const body = { ...req.body, instructor: req.user._id, classCode };

	try {
		let ta = [];
		if (req.body.ta) {
			ta = await Promise.all(req.body.ta.map(email => User.findOne({ email }).select("_id").exec()));
			ta = ta.filter(Boolean);
			ta = ta.map(val => val._id);
		}

		let course = await courseCrud.createOne({body:{ ...body, ta }});
		return res.status(201).json(course);
	}
	catch (e) {
		if (e.name === "ValidationError")
			return res.status(400).json(e);
		next(e);
	}
};

export const getCourses = async (req, res) => {
	if (!req.user.teacher)
		return res.status(401).json({ "error": "Only Teachers can see courses" });

	const courses = await Course.find({instructor:req.user._id}).populate("assignments").select("-createdAt -updatedAt -__v -ta").exec();
	return res.status(200).json(courses);
};

export const getCourse = async (req, res) => {
	const course = await Course.findById(req.params.code).select("-createdAt -updatedAt -__v -_id").populate({path:"ta", select:"first_name email -_id"}).populate({path:"instructor",select:"first_name email -_id"}).populate({path:"assignments",select:"-__v -course"}).exec();
	return res.json(course);
};

export const updateCourse = async (req, res, next) => {
	const searchParam = { instructor: req.user._id, _id: req.params.code };


	const validateCode = req.body.code.search(/[^\w\s-]/);
	if (validateCode !== -1)
		return res.status(400).json({ "error": "Course Code can contain only alphanumeric and hyphen" });

	const updateParam = { name: req.body.name, code: req.body.code };
	if (req.body.ta) {
		let ta = await Promise.all(req.body.ta.map(email => User.findOne({ email }).select("_id").exec()));
		ta = ta.filter(Boolean);
		updateParam["$addToSet"] = {"ta":[...ta]};
	}

	Object.keys(updateParam).filter(x => !!updateParam[x]);
	try {
		const course = await courseCrud.updateOne({findBy:searchParam, updateBody:updateParam});
		return res.status(200).json(course);
	}
	catch (e) {
		if (e.name === "ValidationError")
			return res.status(400).json(e);
		next(e);
	}

};

export const deleteCourse = async (req, res, next) => {
	const searchParam = { instructor: req.user._id, _id: req.params.code };
	try {
		let course = await courseCrud.getOneDoc({ findBy: { ...searchParam } });
		if(course.instructor.toString() === req.user._id.toString() && req.user.teacher) {
			await course.deleteOne();
			return res.sendStatus(204);
		} else {
			return res.status(403).json({error: "Only instructor can delete the course."});
		}
	} catch(err) {
		return next(err);
	}
};

async function generateClassCode () {
	let classCode = randomString(7);
	let exists = await Course
		.find({ classCode })
		.select("classCode")
		.exec();

	while (exists.length !== 0) {
		classCode = randomString(7);
		exists = await Course
			.find({ classCode })
			.select("classCode")
			.exec();
	}

	return classCode;
}

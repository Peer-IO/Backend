import userCrud, {User} from "../models/user.model";
import { ownsToken, revokeToken } from "../services/token";
import courseCrud from "../models/course.model";

export const me = (req, res) => {
	return res.status(200).send({ data: req.user });
};

export const updateMe = async (req, res) => {
	// prevent user from resetting id and verification status
	delete req.body.email_verified;
	delete req.body._id;
	try {
		const user = await userCrud.updateOne({
			findBy: { _id: req.user._id },
			updateBody: req.body,
		});

		return res.status(200).send({ data: user });
	} catch (e) {
		console.error(e);
		res.status(400).end();
	}
};

export const revokeRefreshToken = async (req, res, next) => {
	const token = req.cookies.refreshToken;
	const ipAddress = req.ip;

	if (!token) return res.status(401).json({ message: "Token is required" });
	if (!ownsToken(req.user, token))
		return res.status(401).json({ message: "Unauthorized" });

	await revokeToken({ token, ipAddress }).catch(next);
	return res.sendStatus(204);
};

export const mycourses = async (req, res, next) => {
	try {
		const {courses} = await User.findById(req.user._id).select("courses").populate({path:"courses",select:"-ta -instructor -__v -createdAt -updatedAt", populate: {path:"assignments", model: "Assignment"}}).lean().exec();
		return res.status(200).json({courses});
	}
	catch (e) {
		next(e);
	}
};

export const registercourse = async (req, res, next) => {
	const classCode = req.body.classCode;
	const course = await courseCrud.getOne({ findBy: { classCode } });
	if (!course)
		return res.sendStatus(404);
	try {
		const user = await User.findById(req.user._id);

		if (user.courses.includes(course._id)) {
			return res.sendStatus(200);
		}

		await Promise.all([
			courseCrud.updateOne({ findBy: { _id: course._id }, updateBody: { totalStudents: (course.totalStudents + 1) } }),
			userCrud.updateOne({findBy:{_id:req.user._id},updateBody:{"$addToSet":{"courses":[course._id]}}})
		]);
	} catch (e) {
		console.log(e);
		next(e);
	}

	return res.sendStatus(201);
};

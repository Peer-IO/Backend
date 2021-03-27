import courseCrud from "../models/course.model";

export const createCourse = async (req, res, next) => {
	if (!req.body.name || !req.body.code)
		return res.status(400).json({ "error": "Name and Code are necessary" });
	if (!req.user.teacher)
		return res.status(401).json({ "error": "Only Teachers can create course" });

	const validateCode = req.body.code.search(/[^\w\s-]/);
	if (validateCode)
		return res.status(400).json({ "error": "Course Code can contain only alphanumeric and hyphen" });

	const body = { ...req.body, instructor: req.user._id };
	await courseCrud.createOne({ body }).catch(next);
	const course = courseCrud.getOne({ findBy: { ...body } });
	return res.status(201).json(course);
};

export const getCourse = async (req, res) => {
	const findBy = { ...req.body };
	return res.status(200).json(await courseCrud.getMany({findBy}));
};

export const updateCourse = async (req, res, next) => {
	const searchParam = { instructor: req.user._id, code: req.params.code };

	const validateCode = req.body.code.search(/[^\w\s-]/);
	if (validateCode)
		return res.status(400).json({ "error": "Course Code can contain only alphanumeric and hyphen" });

	const updateParam = { name: req.body.name, ta: [...req.body.ta], code: req.body.code };

	Object.keys(updateParam).filter(x => !!updateParam[x]);

	const course = await courseCrud.updateOne({ findBy: searchParam, updateBody: updateParam }).catch(next);
	return res.status(200).json(course);
};

export const deleteCourse = async (req, res, next) => {
	const searchParam = { instructor: req.user._id, code: req.params.code };
	await courseCrud.removeOne({ findBy: searchParam }).catch(next);
	return res.sendStatus(204);
};

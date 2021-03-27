export const getOne = (model) => ({ findBy }) => {
	return model
		.findOne({ ...findBy })
		.lean()
		.exec();
};

export const getMany = (model) => ({ findBy }) => {
	return model
		.find({ ...findBy })
		.lean()
		.exec();
};

export const createOne = (model) => ({ body }) => {
	return model.create({ ...body });
};

export const updateOne = (model) => ({ findBy, updateBody }) => {
	const update = { ...updateBody };
	return model
		.findOneAndUpdate({ ...findBy }, update, {
			new: true,
			useFindAndModify: false,
			runValidators: true,
			context: "query",
		})
		.lean()
		.exec();
};

export const removeOne = (model) => ({ findBy }) => {
	return model.findOneAndRemove({ ...findBy });
};

export const crudControllers = (model) => ({
	removeOne: removeOne(model),
	updateOne: updateOne(model),
	getMany: getMany(model),
	getOne: getOne(model),
	createOne: createOne(model),
});

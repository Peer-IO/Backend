export const getOne = (model) => ({ findBy }) => {
	// returns document in form of javascript object.
	return model
		.findOne({ ...findBy })
		.lean()
		.exec();
};

export const getOneDoc = (model) => ({ findBy }) => {
	// returns document in form of mongoose doc.
	return model
		.findOne({ ...findBy })
		.exec();
};

export const getMany = (model) => ({ findBy }) => {
	// returns documents in the form of javascript objects.
	return model
		.find({ ...findBy })
		.lean()
		.exec();
};

export const getManyDocs = (model) => ({ findBy }) => {
	// retruns document in the form of mongoose doc.
	return model
		.find({ ...findBy })
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

export const deleteOne = (model) => ({ findBy }) => {
	return model.deleteOne(findBy);
};

export const crudControllers = (model) => ({
	deleteOne: deleteOne(model),
	removeOne: removeOne(model),
	updateOne: updateOne(model),
	getMany: getMany(model),
	getManyDocs: getManyDocs(model),
	getOne: getOne(model),
	getOneDoc: getOneDoc(model),
	createOne: createOne(model),
});

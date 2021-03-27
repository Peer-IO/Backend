export const forbidden = async (req, res) => {
	res.statusCode = 403;
	res.send("Endpoint not supported.");
};
export const isUpdatable = (assignment) => {
	const reviewDeadline = new Date(assignment.reviewDeadline.toString());
	const submissionDeadline = new Date(assignment.submissionDeadline.toString());
	const currentDate = new Date();
	return ((currentDate > submissionDeadline) && (currentDate <= reviewDeadline));
};
export const isSubmissionUpdatable = (assignment) => {
	const submissionDeadline = new Date(assignment.submissionDeadline.toString());
	const currentDate = new Date();
	return (currentDate <= submissionDeadline);
};

export const forbidden = async (req, res) => {
	res.statusCode = 403;
	res.send("Endpoint not supported.");
};

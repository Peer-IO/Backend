import userCrud from "../models/user.model";
import { ownsToken, revokeToken } from "../services/token";

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

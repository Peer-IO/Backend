import config from "../config";
import userCrud from "../models/user.model";
import jwt from "jsonwebtoken";
import { auth } from "../utils/firebase";

// verify firebase token and email verification then only sign in user
export const verifyIDToken = async (req, res, next) => {
	const idToken = req.body.idToken;
	if (!idToken) return res.status(401).json({ message: "Token not provided" });
	try {
		const decodedToken = await auth.verifyIdToken(idToken);

		if (decodedToken) {
			let { email, emailVerified, providerData } = await auth.getUser(decodedToken.uid);

			const providers = ["google.com", "github.com", "facebook.com"];

			if (!emailVerified) {
				const result = providerData.some((userInfo) => providers.some((provider) => provider === userInfo.providerId));
				if (result) {
					emailVerified = true;
					await auth.updateUser(decodedToken.uid, {
						emailVerified: true
					});
				}
			}

			req.body.email = email;
			req.body.uid = decodedToken.uid;
			req.body.email_verified = emailVerified;
			next();
		} else {
			return res.status(401).json({ message: "Unauthorized" });
		}
	} catch (e) {
		if (e.code === "auth/argument-error")
			return res.status(401).json({ message: "Invalid Firebase Token" });
		next(e);
	}
};

// verify jwt token using secret in config and return user id
const verifyToken = (token) =>
	new Promise((resolve, reject) => {
		jwt.verify(token, config.secrets.jwt, (err, payload) => {
			if (err) return reject(err);
			resolve(payload);
		});
	});

// check header for authorization token prefixed with Bearer and then fetch user and add to request object
export const protect = async (req, res, next) => {
	const token = req.headers.authorization ?? null;

	if (!token) return res.status(401).json({ message: "No Token Provided" });

	const [identity, tokenVal] = token.split(" ");
	if (identity !== "Bearer") return res.status(401).end();

	try {
		const payload = await verifyToken(tokenVal);
		const user = await userCrud.getOne({ findBy: { _id: payload.id } });
		req.user = user;
		next();
	} catch (error) {
		if (error.name == "JsonWebTokenError")
			return res.status(401).json({ message: "Malformed Token" });
		next(error);
	}
};

// generate new jwt token
export const newToken = (user) => {
	return jwt.sign({ id: user._id }, config.secrets.jwt, {
		expiresIn: config.secrets.jwtExp,
	});
};

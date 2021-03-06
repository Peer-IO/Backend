import { newToken } from "../services/auth";
import userCrud from "../models/user.model";
import {
	generateRefreshToken,
	setTokenCookie,
	getActiveToken
} from "../services/token";

export const signin = async (req, res, next) => {
	try {
		// Find user using uid in request body
		let user = await userCrud.getOne({ "findBy": { "uid": req.body.uid } });

		// User doesn't exist 404
		if (!user) {
			return res.status(404).send("User not registered");
		}
		// User isn't verified 401
		if (!req.body.email_verified) {
			return res.status(401).json({ "message": "User not Verified" });
		}

		// Update user status
		user = await userCrud.updateOne({
			"findBy": { "_id": user._id },
			"updateBody": { "email_verified": true }
		});

		let refreshToken = await getActiveToken(user);

		if (!refreshToken) {
			refreshToken = generateRefreshToken(user, req.ip);
			refreshToken.save();
		}

		const token = newToken(user);

		setTokenCookie(res, refreshToken.token);

		return res.status(200).send({ token });
	} catch (e) {
		next(e);
	}
};

//
export const signup = async (req, res, next) => {
	// Data not complete return  400
	if (!req.body.first_name || !req.body.institution || !req.body.roll_number) {
		return res.status(400).send({ "message": "Incomplete data provided" });
	}

	try {
		// Check if user with same email, uid already exists
		if (
			await userCrud.getOne({
				"findBy": {
					"$or": [
						{ "email": req.body.email },
						{ "uid": req.body.uid }
					]
				}
			})
		) {
			return res.status(400).json({ "message": "User already exists" });
		}

		// Create user
		const data = await userCrud.createOne({ "body": req.body });
		// Create jwt token
		const token = newToken(data);
		// Create refresh token and save it if verified user

		if (req.body.email_verified) {
			const refreshToken = generateRefreshToken(data, req.ip);

			await refreshToken.save();
			// Set cookie for refreshToken
			setTokenCookie(res, refreshToken.token);
		}

		return res.status(201).send({ token });
	} catch (error) {
		next(error);
	}
};

// (async function temp() {
// 	const body = {
// 		"first_name":"meluhan",
// 		"last_name":"Tiwari",
// 		"institution":"KCNIT",
// 		"email":"purushottammisc@gmail.com",
// 		"roll_number":19074022
// 	};
// 	try {
// 		const data = await userCrud.createOne({"body": body});
// 		const token = newToken(data);
// 		console.log("token =", token);
// 	} catch(err) {
// 		console.log("error =", err.message);
// 	}
// }());

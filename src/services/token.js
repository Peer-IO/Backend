import { Token } from "../models/token.model";
import { newToken } from "./auth";
import { randomBytes } from "crypto";
import config from "../config";

function generateRefreshToken(user, ipAddress) {
	// create a refresh token that expires in
	return Token({
		user: user._id,
		token: randomBytes(40).toString("hex"),
		expires: new Date(Date.now() + config.secrets.refExp),
		createdByIp: ipAddress,
	});
}

async function getRefreshToken(token) {
	const refreshToken = await Token.findOne({
		token,
	})
		.populate("user")
		.exec();

	if (!refreshToken || !refreshToken.isActive) throw "Invalid token";
	return refreshToken;
}

async function revokeToken({ token, ipAddress }) {
	const refreshToken = await getRefreshToken(token);

	// revoke token and save
	refreshToken.revoked = Date.now();
	refreshToken.revokedByIp = ipAddress;
	await refreshToken.save();
}

async function refreshToken({ token, ipAddress }) {
	const refreshToken = await getRefreshToken(token);
	const { user } = refreshToken;

	// replace old refresh token with a new one and save
	const newRefreshToken = generateRefreshToken(user, ipAddress);
	refreshToken.revoked = Date.now();
	refreshToken.revokedByIp = ipAddress;
	refreshToken.replacedByToken = newRefreshToken.token;
	await refreshToken.save();
	await newRefreshToken.save();

	// generate new jwt
	const jwtToken = newToken(user);
	// return user and tokens
	return {
		token: jwtToken,
		refToken: newRefreshToken.token,
	};
}

function setTokenCookie(res, token) {
	const cookieOptions = {
		httpOnly: true,
		expires: new Date(Date.now() + config.secrets.refExp),
	};
	res.cookie("refreshToken", token, cookieOptions);
}

const ownsToken = async (user, token) => {
	const refreshTokens = await Token.find({ user: user._id });
	return refreshTokens.some((x) => x.token === token);
};

async function getActiveToken(user) {
	const refreshTokens = await Token.find({ user: user._id });
	return refreshTokens.find((x) => x.isActive);
}

export {
	setTokenCookie,
	refreshToken,
	generateRefreshToken,
	revokeToken,
	ownsToken,
	getActiveToken,
};

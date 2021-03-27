import crypto from "crypto";

export const randomString = (size) => {
	return crypto
		.randomBytes(size)
		.toString("hex")
		.slice(0, size);
};

const crypto = require("crypto");

const getCipherKey = (password) => {
	return crypto.createHash("sha256").update(password).digest();
};

module.exports = getCipherKey;

const fs = require("fs");
const crypto = require("crypto");
const zlib = require("zlib");

const getCipherKey = require("./getCipherKey");

function decrypt({ filePath, password, decipherFilePath }) {
	const readInitVect = fs.createReadStream(filePath, { end: 15 });

	let initVect;
	readInitVect.on("data", (chunk) => {
		initVect = chunk;
	});

	readInitVect.on("close", () => {
		const cipheyKey = getCipherKey(password);
		const readStream = fs.createReadStream(filePath, { start: 16 });
		const decipher = crypto.createDecipheriv("aes256", cipheyKey, initVect);
		const unzip = zlib.createUnzip();
		const writeStream = fs.createWriteStream(decipherFilePath);

		readStream.pipe(decipher).pipe(unzip).pipe(writeStream);
	});
}

module.exports = decrypt;

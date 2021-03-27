const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const crypto = require("crypto");

const getCipherKey = require("./getCipherKey");
const AppendInitVect = require("./appendInitVect");

function encrypt({ file, password }) {
  // Generate a secure, pseudo random initialization vector.
  const initVect = crypto.randomBytes(16);
  // Generate a cipher key from the password.
  const CIPHER_KEY = getCipherKey(password);
  const readStream = fs.createReadStream(file);
  const gzip = zlib.createGzip();
  const cipher = crypto.createCipheriv("aes256", CIPHER_KEY, initVect);
  const appendInitVect = new AppendInitVect(initVect);
  // Create a write stream with a different file extension.
  const writeStream = fs.createWriteStream(path.join(file + ".aes.key"));

  readStream.pipe(gzip).pipe(cipher).pipe(appendInitVect).pipe(writeStream);
}

const [filePath, password] = process.argv.slice(2);
const file = path.join(__dirname, filePath);

encrypt({ file: file, password: password });

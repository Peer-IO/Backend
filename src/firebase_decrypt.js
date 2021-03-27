import decrypt from "./secure/decrypt";
const path = require("path");

import config from "./config";

const env = process.env.NODE_ENV || "development";

if (env.toLowerCase() == "production") {
  const fileName = config.fileName;
  const filePath = path.join(__dirname, `./config/${fileName}.aes.key`);
  const decipherFilePath = path.join(__dirname, `./config/${fileName}`);
  const password = process.env.DECRYPT_KEY;

  decrypt({ filePath, password, decipherFilePath });
}

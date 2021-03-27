import { start } from "./app";
import config from "./config";

const dbURL = config.url ?? config.dbURL;
const port = config.port;

console.log("****************************");
console.log(`*\tNODE_ENV: ${config.env}`);

start({ dbURL, port });

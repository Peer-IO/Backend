import { start } from "./app";
import config from "./config";

const dbURL = config.url ?? config.dbURL;
const port = config.port;

start({ dbURL, port });

import { merge } from "lodash";
require("dotenv").config();
const env = process.env.NODE_ENV || "development";

const baseConfig = {
  env,
  isDev: env === "development",
  port: 3000,
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: "1d",
  },
  url: process.env.DB_URL || null,
};

let envConfig = {};

switch (env) {
  case "dev":
  case "development":
    envConfig = require("./dev").config;
    break;
  default:
    envConfig = require("./dev").config;
}

export default merge(baseConfig, envConfig);

import mongoose from "mongoose";
import options from "../config";

const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbURL = options.url ?? options.dbURL;

export const connect = (url = dbURL) => {
  return mongoose.connect(url, { ...opts });
};

import mongoose from "mongoose";

const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  useCreateIndex: true,
};

export const connect = async (url) => {
  try {
    await mongoose.connect(url, opts);
    console.log("*\tDatabase: MongoDB");
    console.log("*\tDB Connection: OK");
    console.log("****************************");
  } catch (e) {
    console.error(e);
  }
};

import mongoose from "mongoose";

const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
};

export const connect = async (url) => {
  try {
    await mongoose.connect(url, opts);
  } catch (e) {
    console.error(e);
  }
};

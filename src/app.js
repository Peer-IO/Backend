const createError = require("http-errors");
const path = require("path");
import express from "express";
import helmet from "helmet";
import { json, urlencoded } from "body-parser";
import logger from "morgan";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";

// db connect
import { connect } from "./utils/db";

//routers
import auth from "./routes/auth.router";
import user from "./routes/user.router";
import refreshToken from "./routes/token.router";

export const app = express();

// remove powered by cookie
app.disable("x-powered-by");
// enhance API security
app.use(helmet());
// allow cors origin for all
app.use(cors({ origin: true }));
//log https requests using morgan
app.use(logger("dev"));
// using bodyparser to parse json bodies into js objects
app.use(json());
// body parsing urlencoded data
app.use(urlencoded({ extended: true }));
// compress response
app.use(compression());
// static file storage
app.use(express.static(path.join(__dirname, "public")));
// use cookie-parser for refresh token
app.use(cookieParser());

app.use("/auth", auth);
app.use("/user", user);
app.use("/refresh", refreshToken);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env !== "production" ? err : {};
  // console error for debugging
  console.error(err);
  // check type of error
  switch (true) {
    case typeof err === "string":
      // custom application error
      const is404 = err.toLowerCase().endsWith("not found");
      const statusCode = is404 ? 404 : 400;
      return res.status(statusCode).json({ message: err });
    case err.name === "ValidationError":
      // mongoose validation error
      return res.status(400).json({ message: err.message });
    case err.name === "UnauthorizedError":
      // jwt authentication error
      return res.status(401).json({ message: "Unauthorized" });
    default:
      return res.status(500).json({ message: err.message });
  }
});

export const start = ({ port, dbURL }) => {
  app.listen(port, () => {
    console.log("*\tStarting Server");
    console.log(`*\tPort: ${port}`);
  });
  connect(dbURL);
};

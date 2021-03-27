const createError = require("http-errors");
const path = require("path");
import express from "express";
import helmet from "helmet";
import { json, urlencoded } from "body-parser";
import logger from "morgan";
import cors from "cors";
import compression from "compression";

// db connect
import { connect } from "./utils/db";

//routers
import auth from "./routes/auth/auth.router";
import user from "./routes/user/user.router";

const app = express();

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

app.use("/auth", auth);
app.use("/user", user);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).json({ message: err });
});

export const start = ({ port, dbURL }) => {
  app.listen(port, () => {
    console.log(`server on port ${port}`);
  });

  connect(dbURL);
};

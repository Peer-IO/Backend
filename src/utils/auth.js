import config from "../config";
import { User } from "../routes/user/user.model";
import jwt from "jsonwebtoken";
import { auth } from "./firebase";

// verify firebase token and email verification then only sign in user
export const verifyIDToken = async (req, res, next) => {
  const idToken = req.body.idToken;
  if (!idToken) return res.status(400).send("Token not provided");

  try {
    const decodedToken = await auth.verifyIdToken(idToken);

    if (decodedToken) {
      const { emailVerified, email } = await auth.getUser(decodedToken.uid);

      if (!emailVerified) {
        await auth.generateEmailVerificationLink(email);
        return res.status(401).send("Email not verified");
      }

      req.body.email = email;
      req.body.uid = decodedToken.uid;
      next();
    } else {
      return res.status(401).send("Unauthorized");
    }
  } catch (e) {
    return res.status(401).send("Unauthorized");
  }
};

// verify jwt token using secret in config and return user id
const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });

// check header for authorization token prefixed with Bearer and then fetch user and add to request object
export const protect = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).end();

  const [identity, tokenVal] = token.split(" ");
  if (identity !== "Bearer") return res.status(401).end();

  try {
    const payload = await verifyToken(tokenVal);
    const user = await User.findById(payload.id).lean().exec();
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).end();
  }
};

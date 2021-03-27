import { config } from "../../config";
import { User } from "../user/user.model";
import jwt from "jsonwebtoken";

// generate new jwt token
const newToken = (user) => {
  return jwt.sign({ id: user._id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp,
  });
};

// find user using uid in request body
export const signin = async (req, res) => {
  const user = User.find({ uid: req.body.uid }).select("-uid").lean().exec();
  if (!user) return res.status(404).send("User not registered");
  const token = newToken(user);
  return res.status(201).send({ token });
};

//
export const signup = async (req, res) => {
  if (!req.body.first_name || !req.body.email || !req.body.institution)
    return res.status(400).send({ message: "Incomplete data provided" });

  try {
    const data = await User.create(req.body);
    const token = newToken(data);
    return res.status(201).send({ token });
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};

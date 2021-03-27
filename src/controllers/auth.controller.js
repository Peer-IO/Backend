import { newToken } from "../services/auth";
import userCrud from "../models/user.model";
import {
  generateRefreshToken,
  setTokenCookie,
  getActiveToken,
} from "../services/token";

export const signin = async (req, res, next) => {
  try {
    // find user using uid in request body
    let user = await userCrud.findOne({ findBy: { uid: req.body.uid } });

    // user doesn't exist 404
    if (!user) return res.status(404).send("User not registered");
    // user isn't verified 401
    if (!req.body.email_verified)
      return res.status(401).json({ message: "User not Verified" });

    // update user status
    user = await userCrud.updateOne({
      findBy: { _id: req.user._id },
      updateBody: { email_verified: true },
    });

    let refreshToken = await getActiveToken(user);
    if (!refreshToken) {
      refreshToken = generateRefreshToken(user, req.ip);
      refreshToken.save();
    }

    const token = newToken(user);

    setTokenCookie(res, refreshToken.token);
    return res.status(200).send({ token });
  } catch (e) {
    next(e);
  }
};

//
export const signup = async (req, res, next) => {
  // data not complete return  400
  if (!req.body.first_name || !req.body.institution || !req.body.roll_number)
    return res.status(400).send({ message: "Incomplete data provided" });

  try {
    // check if user with same email, uid already exists
    if (
      await userCrud.getOne({
        findBy: {
          $or: [{ email: req.body.email }, { uid: req.body.uid }],
        },
      })
    )
      return res.status(400).json({ message: "User already exists" });

    // create user
    const data = await userCrud.createOne({ body: req.body });
    // create jwt token
    const token = newToken(data);
    // create refresh token and save it
    const refreshToken = generateRefreshToken(data, req.ip);
    await refreshToken.save();
    // set cookie for refreshToken
    setTokenCookie(res, refreshToken.token);

    return res.status(201).send({ token });
  } catch (error) {
    next(error);
  }
};

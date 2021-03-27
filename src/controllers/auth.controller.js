import { newToken } from "../services/auth";
import userCrud from "../models/user.model";

export const signin = async (req, res) => {
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

    const token = newToken(user);
    return res.status(201).send({ token });
  } catch (e) {
    next(e);
  }
};

//
export const signup = async (req, res) => {
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
    const token = newToken(data);
    return res.status(201).send({ token });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

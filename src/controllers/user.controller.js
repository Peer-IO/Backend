import userCrud from "../models/user.model";

export const me = (req, res) => {
  return res.status(200).send({ data: req.user });
};

export const updateMe = async (req, res) => {
  // prevent user from resetting id and verification status
  delete req.body.email_verified;
  delete req.body._id;
  try {
    const user = await userCrud.updateOne({
      findBy: { _id: req.user._id },
      updateBody: req.body,
    });

    return res.status(200).send({ data: user });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

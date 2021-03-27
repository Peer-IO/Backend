import { refreshToken, setTokenCookie } from "../services/token";

export const refreshTokens = async (req, res, next) => {
  const refresh_token = req.cookies.refreshToken;
  const ipAddress = req.ip;

  if (!refresh_token)
    return res.status(401).json({ message: "Token is required" });

  try {
    const { refToken, token } = await refreshToken({
      token: refresh_token,
      ipAddress,
    });
    setTokenCookie(res, refToken);
    return res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

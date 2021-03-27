export const config = {
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: "1d",
  },
  dbURL: process.env.DB_URL,
  fileName: process.env.KEY_NAME,
};

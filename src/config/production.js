export const config = {
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: "1d",
    refExp: 20 * 24 * 60 * 60 * 1000,
  },
  dbURL: process.env.DB_URL,
  fileName: process.env.KEY_NAME,
};

export const config = {
  secrets: {
    jwt: "peertopeerjwt",
    jwtExp: "2d",
    refExp: 10 * 24 * 60 * 60 * 1000,
  },
  dbURL: "mongodb://localhost:27017/api-design",
  fileName: "firebase.json",
};

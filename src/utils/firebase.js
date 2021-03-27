import admin from "firebase-admin";
import config from "../config";

const fileName = config.fileName;
const serviceAccount = require(`../config/${fileName}`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://peer2peer-a77ac.firebaseio.com",
});

export default admin;

export const auth = admin.auth();

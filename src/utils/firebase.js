import admin from "firebase-admin";

const serviceAccount = require("../config/peer2peer-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://peer2peer-a77ac.firebaseio.com",
});

export default admin;

export const auth = admin.auth();

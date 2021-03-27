import request from "supertest";
import userCrud from "../../models/user.model";
import { newToken } from "../../services/auth";
import { generateRefreshToken } from "../../services/token";
import { randomBytes } from "crypto";
import { app } from "../../app";

import { setupDB } from "../../../test-db-setup";
setupDB("api-user-route-testing");

describe("User route", () => {
  let token, refreshToken;
  beforeEach(async () => {
    const user = await userCrud.createOne({
      body: {
        first_name: "tester",
        email: "nitya@mail.com",
        institution: "IIT BHU",
        gender: "male",
        roll_number: 1907410,
        uid: randomBytes(40).toString("hex"),
        email_verified: true,
      },
    });
    token = newToken(user);
    refreshToken = generateRefreshToken(user);
    refreshToken.save();
    refreshToken = refreshToken.token;
  });

  test("user end point test", async () => {
    const jwt = `Bearer ${token}`;
    const results = await Promise.all([
      request(app).get("/user").set("Authorization", jwt),
      request(app).put("/user").set("Authorization", jwt),
      request(app)
        .get("/user/revoke")
        .set("Authorization", jwt)
        .set("Cookie", [`refreshToken=${refreshToken}`]),
    ]);

    results.forEach((res) => expect(res.statusCode).not.toBe(401));
  });
});

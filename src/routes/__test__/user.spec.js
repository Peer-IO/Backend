import request from "supertest";
import userCrud from "../../models/user.model";
import { newToken } from "../../services/auth";
import { generateRefreshToken, getActiveToken } from "../../services/token";
import { randomBytes } from "crypto";
import { app } from "../../app";

import { setupDB } from "../../../test-db-setup";
setupDB("api-user-route-testing");

describe("User route", () => {
	let token, refreshToken, user;

	beforeEach(async () => {
		user = await userCrud.createOne({
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
		user = await userCrud.getOne({ findBy: { uid: user.uid } });
		token = newToken(user);
		refreshToken = generateRefreshToken(user);
		await refreshToken.save();
		refreshToken = refreshToken.token;
	});

	test("get user endpoint", async () => {
		const jwt = `Bearer ${token}`;
		const response = await request(app).get("/user").set("Authorization", jwt);

		expect(response.statusCode).toBe(200);
		expect(response.body?.data?.email).toBe(user.email);
		expect(response.body?.data?.first_name).toBe(user.first_name);
	});

	test("update user endpoint", async () => {
		const jwt = `Bearer ${token}`;
		const data = {...user,gender:"female",email: "kripa@mail.com"};
		const response = await request(app).put("/user").send(data).set("Authorization", jwt);

		expect(response.body?.data?.email).not.toBe("kripa@mail.com");
		expect(response.body?.data?.gender).toBe("female");
		expect(response.statusCode).toBe(200);
	});

	test("revoke token", async () => {
		const jwt = `Bearer ${token}`;
		const response = await request(app).get("/user/revoke").set("Cookie", [`refreshToken=${refreshToken}`]).set("Authorization", jwt);

		expect(response.statusCode).toBe(204);
		expect(getActiveToken(user)).resolves.toBeUndefined();
	});
});

import request from "supertest";
import userCrud from "../../models/user.model";
import { generateRefreshToken } from "../../services/token";
import { randomBytes } from "crypto";
import { app } from "../../app";

import { setupDB } from "../../../test-db-setup";
setupDB("api-user-route-testing");

describe("Token route", () => {
	let refreshToken;
	beforeAll(async () => {
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
		refreshToken = generateRefreshToken(user);
		await refreshToken.save();
		refreshToken = refreshToken.token;
	});

	test("refresh and return tokens", async () => {
		const results = await request(app)
			.get("/refresh")
			.set("Cookie", [`refreshToken=${refreshToken}`]);

		expect(results.statusCode).toBe(201);
		expect(results.body.token).not.toBeNull();
	});
});

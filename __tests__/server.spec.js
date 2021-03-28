import request from "supertest";
import { app } from "../src/app";

import { setupDB } from "../test-db-setup";
setupDB("api-auth-testing");

describe("API Authentication", () => {
	describe("api auth", () => {
		test("api should be locked down", async () => {
			let response = await request(app).get("/user");
			expect(response.statusCode).toBe(401);

			response = await request(app).get("/user/revoke");
			expect(response.statusCode).toBe(401);

			response = await request(app).get("/refresh");
			expect(response.statusCode).toBe(401);

			response = await request(app).get("/auth");
			expect(response.statusCode).toBe(401);
		});
	});
});

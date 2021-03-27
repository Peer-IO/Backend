import request from "supertest";
import { app } from "../../app";
import { auth } from "../../utils/firebase";
import { setupDB, removeAllCollections } from "../../../test-db-setup";
setupDB("api-auth-route-testing");

describe("Auth route", () => {
	let decodedToken = null, idToken = null;
	beforeAll(async () => {
		const data = {
			email: "test@p2p.com",
			password: "testpass123",
			returnSecureToken: true
		};

		const response = await request("https://identitytoolkit.googleapis.com")
			.post(`/v1/accounts:signUp?key=${process.env.APIKEY}`)
			.set("Content-Type","application/json")
			.send(data);

		idToken = response.body.idToken;
		decodedToken = await auth.verifyIdToken(response.body.idToken);
	});

	afterAll(async () => {
		await auth.deleteUser(decodedToken.uid);
	});

	test("Has correct Decoded Token", () => {
		expect(decodedToken.email).toBe("test@p2p.com");
		expect(decodedToken.uid).toBeDefined();
		expect(idToken).not.toBeNull();
	});

	describe("Auth with not verified User", () => {
		test("SignIn without signup", async () => {
			const response = await request(app)
				.post("/auth/signin")
				.send({ idToken });

			expect(response.statusCode).toBe(404);
		});

		test("Signup with not verified User", async () => {
			const data = {
				first_name:"Test User",
				institution: "IIT B",
				roll_number: 1907043,
				idToken
			};

			const response = await request(app)
				.post("/auth/signup")
				.send(data);

			expect(response.statusCode).toBe(201);
			expect(response.body).toHaveProperty("token");
			expect(response.headers).not.toHaveProperty("set-cookie");
		});

		test("SignIn with not verified User", async () => {
			const response = await request(app)
				.post("/auth/signin")
				.send({ idToken });

			expect(response.statusCode).toBe(401);
		});
	});

	describe("Auth with verified User", () => {

		beforeAll(async () => {
			await removeAllCollections();
			await auth.updateUser(decodedToken.uid, {
				emailVerified:true
			});
		});

		afterAll(async () => {
			await auth.updateUser(decodedToken.uid, {
				emailVerified:false
			});
		});

		test("Signup with verified User", async () => {
			const data = {
				first_name:"Test User",
				institution: "IIT B",
				roll_number: 1907043,
				idToken
			};

			const response = await request(app)
				.post("/auth/signup")
				.send(data);

			const expected = [expect.stringMatching(/refreshToken=.+;\sPath=\/;\sExpires=.+;\sHttpOnly$/)];

			expect(response.statusCode).toBe(201);
			expect(response.body).toHaveProperty("token");
			expect(response.headers).toHaveProperty("set-cookie");
			expect(response.headers["set-cookie"].length).toBeGreaterThanOrEqual(1);
			expect(response.headers["set-cookie"]).toEqual(expect.arrayContaining(expected));
		});

		test("SignIn with verified User", async () => {
			const response = await request(app)
				.post("/auth/signin")
				.send({ idToken });

			const expected = [expect.stringMatching(/refreshToken=.+;\sPath=\/;\sExpires=.+;\sHttpOnly$/)];

			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveProperty("token");
			expect(response.headers).toHaveProperty("set-cookie");
			expect(response.headers["set-cookie"].length).toBeGreaterThanOrEqual(1);
			expect(response.headers["set-cookie"]).toEqual(expect.arrayContaining(expected));
		});
	});
});

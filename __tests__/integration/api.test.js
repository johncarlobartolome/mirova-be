const request = require("supertest");
const app = require("../../src/app");

describe("API Endpoints", () => {
  describe("POST /api/auth/signup", () => {
    it("should create a new user and return 201 status", async () => {
      const response = await request(app).post("/signup").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("username", "testuser");
      expect(response.body).toHaveProperty("email", "testuser@example.com");
    });

    it("should return 400 status if required fields are missing", async () => {
      const response = await request(app).post("/signup").send({
        username: "testuser",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should return 409 status if the email is already in use", async () => {
      // Assuming a user with this email already exists in the database
      await request(app).post("/signup").send({
        username: "existinguser",
        email: "existinguser@example.com",
        password: "password123",
      });

      const response = await request(app).post("/signup").send({
        username: "newuser",
        email: "existinguser@example.com",
        password: "password123",
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("error", "Email already in use");
    });
  });
});

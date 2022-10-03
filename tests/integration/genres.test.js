const { default: mongoose } = require("mongoose");
const request = require("supertest");

const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../app");
  });
  afterEach(async () => {
    await server.close();
    await Genre.remove({});
  });
  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id ", () => {
    it("should return a specific genre", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return a 404 error if invalid genre ID", async () => {
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(404);
    });

    it("should return a 404 error if no genre with the given ID exist", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });
  });
  describe("POST /", () => {
    // Define the happy path, and then in each test, we change
    // one parameter that clearly alighns with the same name of the
    // test.

    let token;
    let name;
    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({
          name,
        });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      name = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      // TO DO::
      await exec();

      const genre = await Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT .", () => {
    let token;
    let id;
    let newName;
    let genre;

    const exec = async () => {
      return await request(server)
        .put("/api/genres/" + id)
        .send({ name: newName })
        .set("x-auth-token", token);
    };

    beforeEach(async () => {
      genre = new Genre({ name: "genre1" });
      await genre.save();

      id = genre._id;
      token = new User().generateAuthToken();
      newName = "Updatedname";
    });

    it("should return 400 if genre name is less than 5 characters", async () => {
      newName = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre name is more  than 50 characters", async () => {
      newName = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should update the genre successfully", async () => {
      const res = await exec();
      const genre = await Genre.findById(id);
      expect(genre.name).toBe("Updatedname");
    });

    it("should return 404 error if genre is not found", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 error if genre ID is invalid", async () => {
      id = 1
      const res = await exec();
      expect(res.status).toBe(404);
    });
  });
});

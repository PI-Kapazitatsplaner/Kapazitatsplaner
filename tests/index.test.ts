import request from "supertest";
import seedDB from "../Prisma/seed";
import app from "../app";

describe("GET /", () => {
    it("should return 200 and body", (done) => {
        seedDB();
        request(app).get("/")
            .expect(200)
            .end(done);
    });
});

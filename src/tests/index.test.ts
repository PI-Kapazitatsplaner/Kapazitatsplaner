import request from "supertest";
import app from "../app";


describe("GET /", () => {
    it("should return 200 and body", (done) => {
        request(app).get("/")
            .expect(200)
            .end(done);
    });
});

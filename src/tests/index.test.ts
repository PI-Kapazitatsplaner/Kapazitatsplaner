import request from "supertest";
import app from "../app";


describe("GET /", () => {
    it("should return 302", (done) => {
        request(app).get("/")
            .expect(302)
            .end(done);
    });
});

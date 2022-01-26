import { expect } from "chai";
import request from "supertest";
import app from "../app";

describe("GET /random-url", () => {
    it("should return 404", (done) => {
        request(app).get("/random-url")
            .expect(404)
            .end(function (err, res) {
                expect(res.text).to.contains("Not Found");
                done();
            });
    });
});



import { expect } from "chai";
import request from "supertest";
import app from "../app";

describe("GET /sprint_verwaltung", () => {
    it("should return 200", (done) => {
        request(app).get("/sprint_verwaltung")
            .expect(200)
            .end(function (err, res) {
                expect(res.text).includes("Sprint Verwaltung</h1>")
                done();
            });
    });
});
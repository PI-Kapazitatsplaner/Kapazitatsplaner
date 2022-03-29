import { expect } from "chai";
import request from "supertest";
import app from "../app";

describe("GET /team_kalender/2022/PI-01", () => {
    it("should return 200", (done) => {
        request(app).get("/team_kalender/2022/PI-01")
            .expect(200)
            .end(function (err, res) {
                expect(res.text).includes("2022"),
                expect(res.text).includes("Team Kalender"),
                done();
            });
    });
});
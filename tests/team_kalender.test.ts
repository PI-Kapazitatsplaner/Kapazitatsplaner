import { expect } from "chai";
import request from "supertest";
import app from "../app";

describe("GET /team_kalender", () => {
    it("should return 200", (done) => {
        request(app).get("/team_kalender")
            .expect(200)
            .end(function (err, res) {
                expect(res.text).includes("<b><p><a href=\"/team_kalender\" class=\"title\">Team Kalender</a></p></b>")
                done();
            });
    });
});
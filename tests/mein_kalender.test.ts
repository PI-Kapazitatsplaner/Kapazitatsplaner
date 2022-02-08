import { expect } from "chai";
import request from "supertest";
import app from "../app";

describe("GET /mein_kalender", () => {
    it("should return 200", (done) => {
        request(app).get("/mein_kalender")
            .expect(200)
            .end(function (err, res) {
                expect(res.text).to.contain('Mein Kalender</a></p></b>')
                done();
            });
    });
});
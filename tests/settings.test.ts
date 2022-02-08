import { expect } from "chai";
import request from "supertest";
import app from "../app";

describe("GET /settings", () => {
    it("should return 200", (done) => {
        request(app).get("/settings")
            .expect(200)
            .end(function (err, res) {
                expect(res.text).includes("<h1 class=\"title\">Settings</h1>")
                done();
            });
    });
});



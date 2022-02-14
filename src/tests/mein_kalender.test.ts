import { expect } from "chai";
import request from "supertest";
import app from "../app";
import { setTestUser } from "../prisma/client";

describe("GET /mein_kalender", () => {
    it("should return 200 and be in dark mode", (done) => {
        setTestUser('c2842822-67f5-4759-8db8-a431ddfc3500');
        request(app).get("/mein_kalender")
            .expect(200)
            .end(function (err, res) {
                expect(res.text).to.contain('Mein Kalender</a></p></b>')
                expect(res.text).to.contain('<script>setColors("dark");</script>')
                done();
            });
    });
    it("should return 200  and be in white mode", (done) => {
        setTestUser('4296e3d8-a609-4ffa-b27a-3106ed7a5126');
        request(app).get("/mein_kalender")
            .expect(200)
            .end(function (err, res) {
                expect(res.text).to.contain('Mein Kalender</a></p></b>')
                expect(res.text).to.contain('<script>setColors("light");</script>')
                done();
            });
    });
});
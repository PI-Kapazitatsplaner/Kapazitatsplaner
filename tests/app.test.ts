import request from "supertest";
import app from "../app";

describe("GET /random-url", () => {
    it("should return 404", (done) => {
        request(app).get("/random-url")
            .expect(404)
            .expect("<h1>Not Found</h1>\r\n<h2></h2>\r\n<pre></pre>")
            .end(done);
    });
});



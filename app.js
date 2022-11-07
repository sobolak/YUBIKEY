const U2F = require("u2f");
const Express = require("express");
const BodyParser = require("body-parser");
const Cors = require("cors");
const HTTPS = require("https");
const FS = require("fs");
const session = require("express-session");


var app = Express();

const APP_ID = "https://localhost:2015";

app.use(session({ secret: "admin", cookie: { secure: true, maxAge: 60000 }, saveUninitialized: true, resave: true }));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(Cors());

var user;

app.get("/", (request, response, next) => {
    response.send({"message" : "Hello World"})
});

app.get("/register", (request, response, next) => {
    request.session.u2f = U2F.request(APP_ID);
    response.send(request.session.u2f);
});
app.post("/register", (request, response, next) => {
    var registration = U2F.checkRegistration(request.session.u2f, request.body.registerResponse);
    if(!registration.successful) {
        return response.status(500).send({ message: "error" });
    }
    user = registration;
    response.send({ message: "The hardware key has been registered" });
});

app.get("/login", (request, response, next) => {
    request.session.u2f = U2F.request(APP_ID, user.keyHandle);
    response.send(request.session.u2f);
});
app.post("/login", (request, response, next) => {
    var success = U2F.checkSignature(request.session.u2f, request.body.loginResponse, user.publicKey);
    response.send(success);
});

app.listen(1337, () => {
    console.log("Started server");
  });

// HTTPS.createServer({
//     key: FS.readFileSync("localhost.key"),
//     cert: FS.readFileSync("localhost.crt")
// }, app).listen(443, () => {
//     console.log("Listening at :443...");
// });
const express = require("express");
const auth = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(auth);

app.use("/", require("./routes"));

module.exports = app;

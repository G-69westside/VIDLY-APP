const express = require("express");
const winston = require("winston");

const app = express();
app.use(express.urlencoded({ extended: true }));

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/connect")();
require("./startup/config")();
require("./startup/prod")(app);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  winston.info(`Listening on port ${port}...😊`);
});
module.exports = server;

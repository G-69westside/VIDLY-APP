const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");
module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(config.get("db"))
    .then(() => winston.info(`Connected to the ${db}...`));
};

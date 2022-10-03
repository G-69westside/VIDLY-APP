const config = require("config");
module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    throw new Error(
      "FATAL ERROR: jwtPrivateKey is not defined, on terminal run this command: set vidly_jwtPrivatekey=mySecretKey"
    );
  }
};

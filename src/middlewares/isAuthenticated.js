const jwt = require("express-jwt");

function extractTokenFromHeaders(req, res) {
  // verificar se o cabeçalho Authorization existe
  if (!req.headers.authorization) {
    throw new Error("Faltando o cabeçalho Authorization");
  }

  return req.headers.authorization.split(" ")[1];
}

module.exports = jwt({
  secret: process.env.TOKEN_SIGN_SECRET,
  userProperty: "user",
  getToken: extractTokenFromHeaders,
  algorithms: ["HS256"],
});

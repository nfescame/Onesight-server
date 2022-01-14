const jwt = require("jsonwebtoken");

function generateToken(userObj) {
  // A senha NUNCA pode ser enviada no token
  const { _id, name, email } = userObj;

  const signatureSecret = process.env.TOKEN_SIGN_SECRET;
  const expiration = "6h";

  return jwt.sign({ _id, name, email }, signatureSecret, {
    expiresIn: expiration,
  });
}

module.exports = generateToken;

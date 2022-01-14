const mongoose = require("mongoose");

const DB_NAME = "projectManagementApp";

module.exports = mongoose
  .connect(process.env.MONGODB_URI)
  .then((self) => console.log(`Conectado ao banco ${self.connection.name}`))
  .catch((err) => console.error(err));

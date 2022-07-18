
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//méthode Schema mise à dispo par Mongoose
const userSchema = mongoose.Schema({
  //pas besoin de champ pour id car il est automatiquement généré par Mongoose
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

//export du schéma en tant que modèle Mongoose "User" (dispo pour notre application Express)
module.exports = mongoose.model("User", userSchema);
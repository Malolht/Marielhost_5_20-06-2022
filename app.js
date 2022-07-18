//Import packages
const express = require("express");
const mongoose = require("mongoose");
const helmet = require('helmet');
const path = require("path");


//Import des routes
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

//Connexion a MongoDB et sécurisation de la clé d'accès
mongoose.connect(process.env.MDP_MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//Lancement de express
const app = express();

//Sécurisation des en-tête et configuration CORS
app.use(helmet());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  //autorisation des images venant d'une autre origine
  res.header("Cross-Origin-Resource-Policy", "cross-origin")
  next();
});

// Pour parser les objets json
app.use(express.json());

//gestionnaire de routage, la ressources images est gérée de manière statique
app.use('/images', express.static(path.join(__dirname, 'images')));

//routes
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;
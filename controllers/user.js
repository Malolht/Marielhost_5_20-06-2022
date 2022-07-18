const User = require("../models/user");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cryptojs = require('crypto-js');
require('dotenv').config();

/**La méthode  hash() de bcrypt crée un hash crypté des mots de passe des utilisateurs 
 * pour les enregistrer de manière sécurisée dans la base de données */
exports.signup = (req, res, next) => {
  //regex mot de passe, sécurisation authentification
  const passwordRegex = /^(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/;
  if (passwordRegex.test(req.body.password)){
  /**appel fonction de hachage de bcrypt dans notre mot de passe 
   * lui demandons de « saler » le mot de passe 10 fois */
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        //adresse fournie dans le corps de la requête
        email: req.body.email,
        //mdp crypté
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => { 
      console.log(error)
      return res.status(500).json({ error }) });
    }
    else {
      res.status(400).json({ message : 'Mot de passe invalide, veuillez mettre au minimum 10 caractères, dont 1 majuscule, un nombre et 1 caractère spécial'})
    }
};

exports.login = (req, res, next) => {
  /**modèle Mongoose pour vérifier que l'e-mail entré par l'utilisateur 
   * correspond à un utilisateur existant de la base de données */
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      /**fonction compare de bcrypt pour comparer le mot de passe entré 
       * par l'utilisateur avec le hash enregistré dans la base de données */
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            //fonction sign de jsonwebtoken pour chiffrer un nouveau token
            token: jwt.sign(
              { userId: user._id },
              //token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token)
              process.env.SECRET_TOKEN_STRING,
              //utilisateur doit se reconnecter au bout de 24h
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
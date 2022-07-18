const jwt = require('jsonwebtoken');
 
//vérification que l'utilisateur est bien connecté 
//Transmission des info de connexions aux méthodes qui gèrent les requêtes
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_STRING);
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};
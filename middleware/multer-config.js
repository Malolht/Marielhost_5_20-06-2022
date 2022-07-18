const multer = require('multer');

//constante storage
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//constante storage à passer à multer comme config
const storage = multer.diskStorage({
  //fonction destination indique à multer où enregistrer les fichiers  
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    //constante disctionnaire type MIME pour résoudre l'extension fichier appropriée
    const extension = MIME_TYPES[file.mimetype];
    //ajout timestamp dans le nom du fichier
    callback(null, name + Date.now() + '.' + extension);
  }
});

//export du multer configuré avec constante storage, téléchargement des fichiers 'image' seulement
module.exports = multer({storage: storage}).single('image');
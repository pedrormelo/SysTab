const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/termos/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const userId = req.params.idUser;
        cb(null, `termo_${userId}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Apenas arquivos PDF são aceitos."), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usersController");

router.post("/", usuariosController.criarUsuario);
router.get("/", usuariosController.listarUsuarios);
router.put("/:id", usuariosController.editarUsuario);
router.delete("/:id", usuariosController.deletarUsuario);

console.log('Usuarios routes loaded!');

module.exports = router;
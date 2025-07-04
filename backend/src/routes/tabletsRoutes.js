const express = require("express");
const router = express.Router();
const tabletsController = require("../controllers/tabletsController");
const auth = require("../middlewares/authMiddleware"); // <- Adicione isso

router.post("/", auth, tabletsController.criarTablet);
router.get("/", auth, tabletsController.listarTablets);
router.get("/busca", auth, tabletsController.buscarTablet);
router.get("/:id", auth, tabletsController.buscarTabletPorId);
router.put("/:id", auth, tabletsController.editarTablet);

// ✅ Aqui aplicamos o controle de nível de acesso:
router.delete("/:id", auth, (req, res, next) => {
    if (req.usuario.nivel !== 'admin') {
        return res.status(403).json({ error: "Apenas administradores podem excluir tablets" });
    }
    next();
}, tabletsController.deletarTablet);

console.log("Tablets Routes Loaded");

module.exports = router;

const express = require("express");
const router = express.Router();
const regionaisController = require("../controllers/regionaisController");

router.post("/", regionaisController.criarRegional);
router.get("/", regionaisController.listarRegionais);
router.put("/:id", regionaisController.editarRegional);
router.delete("/:id", regionaisController.deletarRegional);

console.log("Regionais Routes Loaded");

module.exports = router;

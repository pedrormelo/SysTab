const db = require("../config/db");

exports.criarRegional = (req, res) => {
    const { numReg } = req.body;
    if (!numReg) return res.status(400).json({ error: "Número da regional é obrigatório." });

    const sql = "INSERT INTO regionais (numReg) VALUES (?)";
    db.query(sql, [numReg], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao criar regional." });
        res.status(201).json({ message: "Regional criada com sucesso.", idRegional: result.insertId });
    });
};

exports.listarRegionais = (req, res) => {
    db.query("SELECT * FROM regionais", (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao listar regionais." });
        res.json(result);
    });
};

exports.editarRegional = (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    const sql = "UPDATE regionais SET nome = ? WHERE idRegional = ?";

    db.query(sql, [nome, id], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao atualizar regional." });
        res.json({ message: "Regional atualizada com sucesso." });
    });
};

exports.deletarRegional = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM regionais WHERE idRegional = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao deletar regional." });
        res.json({ message: "Regional deletada com sucesso." });
    });
};
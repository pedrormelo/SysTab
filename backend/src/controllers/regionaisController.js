const db = require("../config/db");


exports.criarRegional = async (req, res) => {
    const { numReg } = req.body;
    if (!numReg) return res.status(400).json({ error: "Número da regional é obrigatório." });
    const sql = "INSERT INTO regionais (numReg) VALUES (?)";
    try {
        const [result] = await db.query(sql, [numReg]);
        res.status(201).json({ message: "Regional criada com sucesso.", idRegional: result.insertId });
    } catch (err) {
        res.status(500).json({ error: "Erro ao criar regional." });
    }
};


exports.listarRegionais = async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM regionais");
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar regionais." });
    }
};


exports.editarRegional = async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    const sql = "UPDATE regionais SET nome = ? WHERE idRegional = ?";
    try {
        await db.query(sql, [nome, id]);
        res.json({ message: "Regional atualizada com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar regional." });
    }
};


exports.deletarRegional = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM regionais WHERE idRegional = ?", [id]);
        res.json({ message: "Regional deletada com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao deletar regional." });
    }
};
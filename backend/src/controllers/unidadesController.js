const db = require("../config/db");

exports.criarUnidade = (req, res) => {
    const { nome, idRegional } = req.body;
    if (!nome || !idRegional) return res.status(400).json({ error: "Nome e regional são obrigatórios." });

    const sql = "INSERT INTO unidades (nome, idRegional) VALUES (?, ?)";
    db.query(sql, [nome, idRegional], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao criar unidade." });
        res.status(201).json({ message: "Unidade criada com sucesso.", idUnidade: result.insertId });
    });
};

exports.listarUnidades = (req, res) => {
    db.query("SELECT unidades.*, regionais.nome AS regional FROM unidades JOIN regionais ON unidades.idRegional = regionais.idRegional", (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao listar unidades." });
        res.json(result);
    });
};

exports.editarUnidade = (req, res) => {
    const { id } = req.params;
    const { nome, idRegional } = req.body;
    const sql = "UPDATE unidades SET nome = ?, idRegional = ? WHERE idUnidade = ?";

    db.query(sql, [nome, idRegional, id], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao atualizar unidade." });
        res.json({ message: "Unidade atualizada com sucesso." });
    });
};

exports.deletarUnidade = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM unidades WHERE idUnidade = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao deletar unidade." });
        res.json({ message: "Unidade deletada com sucesso." });
    });
};
const db = require("../config/db");

exports.criarUnidade = (req, res) => {
    const { nomeUnidade, idReg } = req.body;
    if (!nomeUnidade || !idReg) return res.status(400).json({ error: "Nome da unidade e ID da regional são obrigatórios." });

    const sql = "INSERT INTO unidades (nomeUnidade, idReg) VALUES (?, ?)";
    db.query(sql, [nomeUnidade, idReg], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao criar unidade." });
        res.status(201).json({ message: "Unidade criada com sucesso.", idUnidade: result.insertId });
    });
};

// Listar unidades com contagem de tablets vinculados
exports.listarUnidades = (req, res) => {
    const sql = `
        SELECT un.*, r.numReg AS regional, COUNT(t.idTab) AS tabletsCount
        FROM unidades un
        JOIN regionais r ON un.idReg = r.idReg
        LEFT JOIN tablets t ON un.idUnidade = t.idUnidade
        GROUP BY un.idUnidade
    `;
    db.query(sql, (err, result) => {
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
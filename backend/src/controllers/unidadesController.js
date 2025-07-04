const db = require("../config/db");


exports.criarUnidade = async (req, res) => {
    const { nomeUnidade, idReg } = req.body;
    if (!nomeUnidade || !idReg) return res.status(400).json({ error: "Nome da unidade e ID da regional são obrigatórios." });
    const sql = "INSERT INTO unidades (nomeUnidade, idReg) VALUES (?, ?)";
    try {
        const [result] = await db.query(sql, [nomeUnidade, idReg]);
        res.status(201).json({ message: "Unidade criada com sucesso.", idUnidade: result.insertId });
    } catch (err) {
        res.status(500).json({ error: "Erro ao criar unidade." });
    }
};

// Listar unidades com contagem de tablets vinculados

exports.listarUnidades = async (req, res) => {
    const sql = `
        SELECT un.*, r.numReg AS regional, COUNT(t.idTab) AS tabletsCount
        FROM unidades un
        JOIN regionais r ON un.idReg = r.idReg
        LEFT JOIN tablets t ON un.idUnidade = t.idUnidade
        GROUP BY un.idUnidade
    `;
    try {
        const [result] = await db.query(sql);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar unidades." });
    }
};


exports.editarUnidade = async (req, res) => {
    const { id } = req.params;
    const { nome, idRegional } = req.body;
    const sql = "UPDATE unidades SET nome = ?, idRegional = ? WHERE idUnidade = ?";
    try {
        await db.query(sql, [nome, idRegional, id]);
        res.json({ message: "Unidade atualizada com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar unidade." });
    }
};


exports.deletarUnidade = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM unidades WHERE idUnidade = ?", [id]);
        res.json({ message: "Unidade deletada com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao deletar unidade." });
    }
};
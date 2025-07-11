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
    // Atualizado para refletir tablets vinculados via usuarios, não mais via tablets.idUnidade
    const sql = `
        SELECT un.*, r.numReg AS regional, COUNT(t.idTab) AS tabletsCount
        FROM unidades un
        JOIN regionais r ON un.idReg = r.idReg
        LEFT JOIN usuarios u ON u.idUnidade = un.idUnidade
        LEFT JOIN tablets t ON t.idUser = u.idUser
        GROUP BY un.idUnidade, un.nomeUnidade, un.idReg, r.numReg
    `;
    try {
        const [result] = await db.query(sql);
        res.json(result);
    } catch (err) {
        // Log detalhado para debug
        console.error('Erro ao listar unidades:', err);
        res.status(500).json({ error: "Erro ao listar unidades.", details: err.message });
    }
};


// Permitir apenas admin editar unidade (verificado por middleware), login padrão não pode editar
exports.editarUnidade = async (req, res) => {
    if (!req.usuario || req.usuario.nivel !== 'admin') {
        return res.status(403).json({ error: 'Apenas administradores podem editar unidades.' });
    }
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


// Permitir apenas admin deletar unidade (verificado por middleware), login padrão não pode deletar
exports.deletarUnidade = async (req, res) => {
    if (!req.usuario || req.usuario.nivel !== 'admin') {
        return res.status(403).json({ error: 'Apenas administradores podem excluir unidades.' });
    }
    const { id } = req.params;
    try {
        await db.query("DELETE FROM unidades WHERE idUnidade = ?", [id]);
        res.json({ message: "Unidade deletada com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao deletar unidade." });
    }
};
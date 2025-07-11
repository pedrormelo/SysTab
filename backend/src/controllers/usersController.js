const db = require("../config/db");

// Criar usuário
exports.criarUsuario = async (req, res) => {
    const { nomeUser, cpf, telUser } = req.body;
    if (!nomeUser || !cpf) return res.status(400).json({ error: "Nome e CPF do usuário são obrigatórios." });
    const sql = "INSERT INTO usuarios (nomeUser, cpf, telUser) VALUES (?, ?, ?)";
    try {
        const [result] = await db.query(sql, [nomeUser, cpf, telUser]);
        res.status(201).json({ message: "Usuário criado com sucesso.", idUsuario: result.insertId });
    } catch (err) {
        res.status(500).json({ error: "Erro ao criar usuário." });
    }
};

// Listar usuários com tablet vinculado (um tablet por usuário)
exports.listarUsuarios = async (req, res) => {
    const { unidade } = req.query;
    let sql = `
        SELECT u.idUser, u.nomeUser, u.cpf, u.telUser, u.idUnidade,
               t.idTab, t.idTomb, t.imei
        FROM usuarios u
        LEFT JOIN tablets t ON u.idUser = t.idUser
    `;
    let params = [];
    if (unidade) {
        sql += ' WHERE u.idUnidade = ?';
        params.push(unidade);
    }
    try {
        const [result] = await db.query(sql, params);
        const users = result.map(row => ({
            idUser: row.idUser,
            nomeUser: row.nomeUser,
            cpf: row.cpf,
            telUser: row.telUser,
            idUnidade: row.idUnidade,
            tablet: row.idTab ? {
                idTab: row.idTab,
                idTomb: row.idTomb,
                imei: row.imei
            } : null
        }));
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar usuários." });
    }
};

// Editar usuário
exports.editarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nomeUser, cpf, telUser } = req.body;
    if (!nomeUser || !cpf) {
        return res.status(400).json({ error: "Nome e CPF são obrigatórios." });
    }
    const sql = "UPDATE usuarios SET nomeUser = ?, cpf = ?, telUser = ? WHERE idUser = ?";
    try {
        await db.query(sql, [nomeUser, cpf, telUser, id]);
        res.json({ message: "Usuário atualizado com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar usuário." });
    }
};


// Deletar usuário
exports.deletarUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM usuarios WHERE idUser = ?", [id]);
        res.json({ message: "Usuário deletado com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao deletar usuário." });
    }
};

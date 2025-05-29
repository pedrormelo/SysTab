const db = require("../config/db");

// Criar usuário
exports.criarUsuario = (req, res) => {
    const { nomeUser, cpf, telUser } = req.body;
    if (!nomeUser || !cpf) return res.status(400).json({ error: "Nome e CPF do usuário são obrigatórios." });

    const sql = "INSERT INTO usuarios (nomeUser, cpf, telUser) VALUES (?, ?, ?)";
    db.query(sql, [nomeUser, cpf, telUser], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao criar usuário." });
        res.status(201).json({ message: "Usuário criado com sucesso.", idUsuario: result.insertId });
    });
};

// Listar usuários com tablet vinculado (um tablet por usuário)
exports.listarUsuarios = (req, res) => {
    const sql = `
        SELECT u.idUser, u.nomeUser, u.cpf, u.telUser,
               t.idTab, t.idTomb, t.imei
        FROM usuarios u
        LEFT JOIN tablets t ON u.idUser = t.idUser
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao listar usuários." });
        // Cada usuário terá as informações do tablet (ou null se não houver)
        const users = result.map(row => ({
            idUser: row.idUser,
            nomeUser: row.nomeUser,
            cpf: row.cpf,
            telUser: row.telUser,
            tablet: row.idTab ? {
                idTab: row.idTab,
                idTomb: row.idTomb,
                imei: row.imei
            } : null
        }));
        res.json(users);
    });
};

// Editar usuário
exports.editarUsuario = (req, res) => {
    const { id } = req.params;
    const { nomeUser, cpf, telUser } = req.body;

    if (!nomeUser || !cpf) {
        return res.status(400).json({ error: "Nome e CPF são obrigatórios." });
    }

    const sql = "UPDATE usuarios SET nomeUser = ?, cpf = ?, telUser = ? WHERE idUser = ?";
    db.query(sql, [nomeUser, cpf, telUser, id], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar usuário:", err);
            return res.status(500).json({ error: "Erro ao atualizar usuário." });
        }
        res.json({ message: "Usuário atualizado com sucesso." });
    });
};


// Deletar usuário
exports.deletarUsuario = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM usuarios WHERE idUser = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao deletar usuário." });
        res.json({ message: "Usuário deletado com sucesso." });
    });
};

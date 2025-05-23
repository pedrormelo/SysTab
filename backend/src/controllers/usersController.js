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

// Listar usuários
exports.listarUsuarios = (req, res) => {
    db.query("SELECT idUser, nomeUser, cpf, telUser FROM usuarios", (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao listar usuários." });
        res.json(result);
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

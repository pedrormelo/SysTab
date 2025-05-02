const db = require("../config/db");

// Criar usuário
exports.criarUsuario = (req, res) => {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ error: "Nome do usuário é obrigatório." });

    const sql = "INSERT INTO usuarios (nome) VALUES (?)";
    db.query(sql, [nome], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao criar usuário." });
        res.status(201).json({ message: "Usuário criado com sucesso.", idUsuario: result.insertId });
    });
};

// Listar usuários
exports.listarUsuarios = (req, res) => {
    db.query("SELECT * FROM usuarios", (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao listar usuários." });
        res.json(result);
    });
};

// Editar usuário
exports.editarUsuario = (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    const sql = "UPDATE usuarios SET nome = ? WHERE idUsuario = ?";

    db.query(sql, [nome, id], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao atualizar usuário." });
        res.json({ message: "Usuário atualizado com sucesso." });
    });
};

// Deletar usuário
exports.deletarUsuario = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM usuarios WHERE idUsuario = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao deletar usuário." });
        res.json({ message: "Usuário deletado com sucesso." });
    });
};

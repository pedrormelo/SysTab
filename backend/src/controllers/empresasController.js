const db = require("../config/db");

// Criar empresa
exports.criarEmpresa = (req, res) => {
    const { nome } = req.body;

    if (!nome) {
        return res.status(400).json({ error: "Nome da empresa é obrigatório." });
    }

    const sql = "INSERT INTO empresas (nome) VALUES (?)";

    db.query(sql, [nome], (err, result) => {
        if (err) {
            console.error("Erro ao criar empresa:", err);
            return res.status(500).json({ error: "Erro ao criar empresa." });
        }

        res.status(201).json({ message: "Empresa criada com sucesso.", idEmpresa: result.insertId });
    });
};

// Listar empresas
exports.listarEmpresas = (req, res) => {
    db.query("SELECT * FROM empresas", (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao listar empresas." });
        }

        res.json(result);
    });
};

// Deletar empresa
exports.deletarEmpresa = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM empresas WHERE idEmpresa = ?", [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao deletar empresa." });
        }

        res.json({ message: "Empresa deletada com sucesso." });
    });
};

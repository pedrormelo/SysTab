const db = require("../config/db");

// Criar empresa

exports.criarEmpresa = async (req, res) => {
    const { nome } = req.body;
    if (!nome) {
        return res.status(400).json({ error: "Nome da empresa é obrigatório." });
    }
    const sql = "INSERT INTO empresas (nomeEmp) VALUES (?)";
    try {
        const [result] = await db.query(sql, [nome]);
        res.status(201).json({ message: "Empresa criada com sucesso.", idEmpresa: result.insertId });
    } catch (err) {
        console.error("Erro ao criar empresa:", err);
        res.status(500).json({ error: "Erro ao criar empresa." });
    }
};

// Listar empresas

exports.listarEmpresas = async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM empresas");
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar empresas." });
    }
};

// Deletar empresa

exports.deletarEmpresa = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM empresas WHERE idEmpresa = ?", [id]);
        res.json({ message: "Empresa deletada com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao deletar empresa." });
    }
};

const db = require("../config/db");

exports.criarTablet = (req, res) => {
    const { tombamento, imei, idUsuario, idUnidade, idEmpresa } = req.body;

    if (!tombamento || !imei || !idUsuario || !idUnidade || !idEmpresa) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // Verificar se o usuário já possui um tablet
    const verificarSql = "SELECT * FROM tablets WHERE idUsuario = ?";
    db.query(verificarSql, [idUsuario], (verifErr, verifResult) => {
        if (verifErr) return res.status(500).json({ error: "Erro ao verificar usuário." });
        if (verifResult.length > 0) {
            return res.status(400).json({ error: "Este usuário já possui um tablet vinculado." });
        }

        const sql = "INSERT INTO tablets (tombamento, imei, idUsuario, idUnidade, idEmpresa) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, [tombamento, imei, idUsuario, idUnidade, idEmpresa], (err, result) => {
            if (err) return res.status(500).json({ error: "Erro ao criar tablet." });
            res.status(201).json({ message: "Tablet criado com sucesso.", idTablet: result.insertId });
        });
    });
};

exports.listarTablets = (req, res) => {
    const sql = `
        SELECT t.*, u.nome AS usuario, un.nome AS unidade, r.nome AS regional, e.nome AS empresa
        FROM tablets t
        JOIN usuarios u ON t.idUsuario = u.idUsuario
        JOIN unidades un ON t.idUnidade = un.idUnidade
        JOIN regionais r ON un.idRegional = r.idRegional
        JOIN empresas e ON t.idEmpresa = e.idEmpresa
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao listar tablets." });
        res.json(result);
    });
};

exports.buscarTablet = (req, res) => {
    const { tombamento, imei } = req.query;

    if (!tombamento && !imei) {
        return res.status(400).json({ error: "Informe tombamento ou IMEI." });
    }

    const sql = `
        SELECT t.*, u.nome AS usuario, un.nome AS unidade, r.nome AS regional, e.nome AS empresa
        FROM tablets t
        JOIN usuarios u ON t.idUsuario = u.idUsuario
        JOIN unidades un ON t.idUnidade = un.idUnidade
        JOIN regionais r ON un.idRegional = r.idRegional
        JOIN empresas e ON t.idEmpresa = e.idEmpresa
        WHERE t.tombamento = ? OR t.imei = ?
    `;

    db.query(sql, [tombamento, imei], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro na busca." });
        res.json(result);
    });
};

exports.editarTablet = (req, res) => {
    const { id } = req.params;
    const { tombamento, imei, idUsuario, idUnidade, idEmpresa } = req.body;

    // Verificar se o novo usuário já possui outro tablet (excluindo o atual)
    const verificarSql = "SELECT * FROM tablets WHERE idUsuario = ? AND idTablet != ?";
    db.query(verificarSql, [idUsuario, id], (verifErr, verifResult) => {
        if (verifErr) return res.status(500).json({ error: "Erro ao verificar usuário." });
        if (verifResult.length > 0) {
            return res.status(400).json({ error: "Este usuário já possui outro tablet vinculado." });
        }

        const sql = `
            UPDATE tablets
            SET tombamento = ?, imei = ?, idUsuario = ?, idUnidade = ?, idEmpresa = ?
            WHERE idTablet = ?
        `;

        db.query(sql, [tombamento, imei, idUsuario, idUnidade, idEmpresa, id], (err, result) => {
            if (err) return res.status(500).json({ error: "Erro ao atualizar tablet." });
            res.json({ message: "Tablet atualizado com sucesso." });
        });
    });
};

exports.deletarTablet = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM tablets WHERE idTablet = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao deletar tablet." });
        res.json({ message: "Tablet deletado com sucesso." });
    });
};

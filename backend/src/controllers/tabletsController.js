const db = require("../config/db");


exports.criarTablet = async (req, res) => {
    const { idTomb, imei, idUser, idUnidade, idEmp } = req.body;
    if (!idTomb || !imei || !idUser || !idUnidade || !idEmp) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }
    const verificarSql = "SELECT * FROM tablets WHERE idUser = ?";
    try {
        const [verifResult] = await db.query(verificarSql, [idUser]);
        if (verifResult.length > 0) {
            return res.status(400).json({ error: "Este usuário já possui um tablet vinculado." });
        }
        const sql = "INSERT INTO tablets (idTomb, imei, idUser, idUnidade, idEmp) VALUES (?, ?, ?, ?, ?)";
        const [result] = await db.query(sql, [idTomb, imei, idUser, idUnidade, idEmp]);
        res.status(201).json({ message: "Tablet criado com sucesso.", idTab: result.insertId });
    } catch (err) {
        res.status(500).json({ error: "Erro ao criar tablet." });
    }
};


exports.listarTablets = async (req, res) => {
    const sql = `
    SELECT t.*, u.nomeUser AS usuario, un.nomeUnidade AS unidade, r.numReg AS regional, e.nomeEmp AS empresa
    FROM tablets t
    JOIN usuarios u ON t.idUser = u.idUser
    JOIN unidades un ON t.idUnidade = un.idUnidade
    JOIN regionais r ON un.idReg = r.idReg
    JOIN empresas e ON t.idEmp = e.idEmp
  `;
    try {
        const [result] = await db.query(sql);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar tablets." });
    }
};


exports.buscarTablet = async (req, res) => {
    const { tombamento, imei } = req.query;
    if (!tombamento && !imei) {
        return res.status(400).json({ error: "Informe tombamento ou IMEI." });
    }
    const sql = `
    SELECT t.*, u.nomeUser AS usuario, un.nomeUnidade AS unidade, r.numReg AS regional, e.nomeEmp AS empresa
    FROM tablets t
    JOIN usuarios u ON t.idUser = u.idUser
    JOIN unidades un ON t.idUnidade = un.idUnidade
    JOIN regionais r ON un.idReg = r.idReg
    JOIN empresas e ON t.idEmp = e.idEmp
    WHERE t.idTomb = ? OR t.imei = ?
  `;
    try {
        const [result] = await db.query(sql, [tombamento, imei]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Erro na busca." });
    }
};


exports.buscarTabletPorId = async (req, res) => {
    const { id } = req.params;
    const sql = `
    SELECT t.*, u.nomeUser, u.telUser, un.nomeUnidade, r.numReg, e.nomeEmp
    FROM tablets t
    JOIN usuarios u ON t.idUser = u.idUser
    JOIN unidades un ON t.idUnidade = un.idUnidade
    JOIN regionais r ON un.idReg = r.idReg
    JOIN empresas e ON t.idEmp = e.idEmp
    WHERE t.idTab = ?
  `;
    try {
        const [result] = await db.query(sql, [id]);
        if (result.length === 0) return res.status(404).json({ error: "Tablet não encontrado." });
        res.json(result[0]);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar tablet." });
    }
};



exports.editarTablet = async (req, res) => {
    const { id } = req.params;
    const { idTomb, imei, idUser, idUnidade, idEmp } = req.body;
    const verificarSql = "SELECT * FROM tablets WHERE idUser = ? AND idTab != ?";
    try {
        const [verifResult] = await db.query(verificarSql, [idUser, id]);
        if (verifResult.length > 0) {
            return res.status(400).json({ error: "Este usuário já possui outro tablet vinculado." });
        }
        const sql = `
      UPDATE tablets
      SET idTomb = ?, imei = ?, idUser = ?, idUnidade = ?, idEmp = ?
      WHERE idTab = ?
    `;
        await db.query(sql, [idTomb, imei, idUser, idUnidade, idEmp, id]);
        res.json({ message: "Tablet atualizado com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar tablet." });
    }
};


exports.deletarTablet = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM tablets WHERE idTab = ?", [id]);
        res.json({ message: "Tablet deletado com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao deletar tablet." });
    }
};

const path = require("path");
const fs = require("fs");

// Delete Termo de Responsabilidade (PDF)
exports.deleteTermo = (req, res) => {
    const { idUser } = req.params;
    const filePath = path.join(__dirname, "../../uploads/termos", `termo_${idUser}.pdf`);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return res.json({ message: "Termo deleted." });
    }
    res.status(404).json({ error: "File not found." });
};

// Upload Termo de Responsabilidade (PDF)
exports.uploadTermo = (req, res) => {
    const { idUser } = req.params;
    if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado ou formato inválido." });
    }
    // Arquivo já salvo pelo multer
    res.status(201).json({ message: "Termo enviado com sucesso." });
};

// Download Termo de Responsabilidade (PDF)
exports.downloadTermo = (req, res) => {
    const { idUser } = req.params;
    const filePath = path.join(__dirname, "../../uploads/termos", `termo_${idUser}.pdf`);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Arquivo não encontrado." });
    }
    res.download(filePath);
};

// View Termo de Responsabilidade (PDF inline)
exports.viewTermo = (req, res) => {
    const { idUser } = req.params;
    const filePath = path.join(__dirname, "../../uploads/termos", `termo_${idUser}.pdf`);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Arquivo não encontrado." });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="termo.pdf"');
    fs.createReadStream(filePath).pipe(res);
};
const db = require("../config/db");

// Criar usuário
exports.criarUsuario = async (req, res) => {
    const { nomeUser, cpf, telUser, idUnidade } = req.body;
    if (!nomeUser || !cpf || !idUnidade) return res.status(400).json({ error: "Nome, CPF e Unidade do usuário são obrigatórios." });
    const sql = "INSERT INTO usuarios (nomeUser, cpf, telUser, idUnidade) VALUES (?, ?, ?, ?)";
    try {
        const [result] = await db.query(sql, [nomeUser, cpf, telUser, idUnidade]);
        res.status(201).json({ message: "Usuário criado com sucesso.", idUsuario: result.insertId });
    } catch (err) {
        res.status(500).json({ error: "Erro ao criar usuário." });
    }
};

// Listar usuários com tablet vinculado (um tablet por usuário)
exports.listarUsuarios = async (req, res) => {
    const { unidade } = req.query;
    let sql = `
        SELECT u.idUser, u.nomeUser, u.cpf, u.telUser, u.idUnidade, un.nomeUnidade,
               t.idTab, t.idTomb, t.imei
        FROM usuarios u
        LEFT JOIN tablets t ON u.idUser = t.idUser
        LEFT JOIN unidades un ON u.idUnidade = un.idUnidade
    `;
    let params = [];
    if (unidade) {
        sql += ' WHERE u.idUnidade = ?';
        params.push(unidade);
    }
    try {
        const [result] = await db.query(sql, params);
        const users = result.map(row => {
            const termoPath = path.join(__dirname, "../../uploads/termos", `termo_${row.idUser}.pdf`);
            const termoAssinado = fs.existsSync(termoPath);
            return {
                idUser: row.idUser,
                nomeUser: row.nomeUser,
                cpf: row.cpf,
                telUser: row.telUser,
                idUnidade: row.idUnidade,
                unidade: row.nomeUnidade || "",
                tablet: row.idTab ? {
                    idTab: row.idTab,
                    idTomb: row.idTomb,
                    imei: row.imei
                } : null,
                termoAssinado
            };
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar usuários." });
    }
};

// Editar usuário
exports.editarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nomeUser, cpf, telUser, idUnidade } = req.body;
    if (!nomeUser || !cpf || !idUnidade) {
        return res.status(400).json({ error: "Nome, CPF e Unidade são obrigatórios." });
    }
    const sql = "UPDATE usuarios SET nomeUser = ?, cpf = ?, telUser = ?, idUnidade = ? WHERE idUser = ?";
    try {
        await db.query(sql, [nomeUser, cpf, telUser, idUnidade, id]);
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

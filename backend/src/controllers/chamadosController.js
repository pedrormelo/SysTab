const db = require('../config/db');
const path = require('path');
const fs = require('fs');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale');

exports.criarChamado = (req, res) => {
    const { idTab, descricao, item } = req.body;
    const sql = 'INSERT INTO chamados (idTab, descricao, item, status, dataEntrada) VALUES (?, ?, ?, "Aberto", NOW())';

    db.query(sql, [idTab, descricao, item], (err, result) => {
        if (err) {
            console.error("Error creating chamado:", err);
            return res.status(500).json({ error: "Erro ao criar chamado." });
        }

        res.status(201).json({ message: "Chamado criado com sucesso.", idChamado: result.insertId });
    });
};

exports.listarChamados = (req, res) => {
    const sql = `
        SELECT chamados.*, tablets.idTomb, tablets.imei, usuarios.nomeUser, usuarios.telUser
        FROM chamados
        JOIN tablets ON chamados.idTab = tablets.idTab
        JOIN usuarios ON tablets.idUser = usuarios.idUser
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.buscarChamadoPorIdChamado = (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT chamados.*, tablets.*, usuarios.nomeUser, usuarios.telUser, unidades.nomeUnidade, regionais.numReg AS nomeRegional, empresas.nomeEmp
        FROM chamados
        JOIN tablets ON chamados.idTab = tablets.idTab
        JOIN usuarios ON tablets.idUser = usuarios.idUser
        JOIN unidades ON tablets.idUnidade = unidades.idUnidade
        JOIN regionais ON unidades.idReg = regionais.idReg
        JOIN empresas ON tablets.idEmp = empresas.idEmp
        WHERE chamados.idChamado = ?
    `;
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ mensagem: 'Chamado não encontrado' });
        res.json(results[0]);
    });
};

exports.listarChamadosAtrasados = async (req, res) => {
    const dias = parseInt(req.query.dias) || 7;
    try {
        const [rows] = await db.query(
            `SELECT * FROM chamados 
            WHERE status = 'Aberto' AND dataEntrada < DATE_SUB(NOW(), INTERVAL ? DAY)`,
            [dias]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar chamados antigos.', error: err });
    }
};


exports.listarPorTablet = (req, res) => {
    const { id } = req.params;

    const sql = `
    SELECT idChamado, dataEntrada, dataSaida, descricao, status,
    DATEDIFF(CURDATE(), dataEntrada) AS diasAberto
    FROM chamados
    WHERE idTab = ?
    ORDER BY dataEntrada DESC
  `;

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao buscar chamados." });
        res.json(result);
    });
};


// Deletar chamado
exports.deletarChamado = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM chamados WHERE idChamado = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting chamado:", err);
            return res.status(500).json({ error: "Erro ao deletar chamado." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Chamado não encontrado." });
        }

        res.json({ message: "Chamado deletado com sucesso." });
    });
};

// Function to update a chamado
exports.atualizarChamado = (req, res) => {
    const { id } = req.params;
    // Only allow fields that exist in chamados table
    const allowedFields = ["idTab", "status", "item", "descricao", "dataSaida", "itensRecebidos"];
    const updates = [];
    const values = [];

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            let dbField = field;
            if (field === "itensRecebidos") dbField = "item";
            updates.push(`${dbField} = ?`);
            values.push(req.body[field]);
        }
    }

    if (updates.length === 0) {
        return res.status(400).json({ error: "Nenhum campo válido para atualizar." });
    }

    const sql = `UPDATE chamados SET ${updates.join(", ")} WHERE idChamado = ?`;
    values.push(id);

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Erro ao atualizar chamado:", err);
            return res.status(500).json({ error: "Erro ao atualizar chamado." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Chamado não encontrado." });
        }

        res.json({ message: "Chamado atualizado com sucesso." });
    });
};

// Function to close a chamado
exports.fecharChamado = (req, res) => {
    const { id } = req.params;
    const sql = 'UPDATE chamados SET status = "Fechado", dataSaida = NOW() WHERE idChamado = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Erro ao fechar chamado:", err);
            return res.status(500).json({ error: "Erro ao fechar chamado." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Chamado não encontrado." });
        }

        res.json({ message: "Chamado fechado com sucesso." });
    });
};

exports.gerarOS = (req, res) => {
    const { id, tipo } = req.params;
    const caminhoModelo = path.join(__dirname, `../../templates/template${tipo.toUpperCase()}.docx`);

    if (!fs.existsSync(caminhoModelo)) {
        return res.status(400).json({
            erro: `Modelo de O.S. '${tipo.toUpperCase()}' não encontrado. Verifique se o arquivo 'template${tipo.toUpperCase()}.docx' existe na pasta templates.`
        });
    }

    const sql = `
        SELECT 
            chamados.idChamado, chamados.descricao, chamados.dataEntrada, chamados.item,
            tablets.idTomb, tablets.imei, 
            usuarios.nomeUser, usuarios.telUser, usuarios.cpf, 
            unidades.nomeUnidade, 
            regionais.numReg AS nomeRegional, 
            empresas.nomeEmp, empresas.idEmp
        FROM chamados
        JOIN tablets ON chamados.idTab = tablets.idTab
        JOIN usuarios ON tablets.idUser = usuarios.idUser
        JOIN unidades ON tablets.idUnidade = unidades.idUnidade
        JOIN regionais ON unidades.idReg = regionais.idReg
        JOIN empresas ON tablets.idEmp = empresas.idEmp
        WHERE chamados.idChamado = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ mensagem: 'Chamado não encontrado' });

        const data = results[0];

        const conteudo = fs.readFileSync(caminhoModelo, 'binary');
        const zip = new PizZip(conteudo);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

        const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        const hoje = new Date();

        const dataHoje = `Jaboatão dos Guararapes, ${hoje.getDate()} de ${meses[hoje.getMonth()]
            } de ${hoje.getFullYear()}`;

        const dia = format(hoje, 'dd', { locale: ptBR });
        const mes = format(hoje, 'MMMM', { locale: ptBR });
        const ano = format(hoje, 'yyyy', { locale: ptBR });

        const dataToSet = {
            dia,
            mes,
            ano,
            dataHoje,
            nomeUser: data.nomeUser,
            telUser: data.telUser || '',
            cpf: data.cpf,
            tombamento: data.idTomb,
            imei: data.imei,
            regional: data.nomeRegional,
            unidade: data.nomeUnidade,
            empresa: data.idEmp,
            item: data.item,
            idChamado: data.idChamado,
            descricao: data.descricao,
            dataEntrada: data.dataEntrada
                ? format(new Date(data.dataEntrada), 'dd/MM/yyyy', { locale: ptBR })
                : 'Data não disponível', // Fallback value
        };

        try {
            doc.render(dataToSet);
        } catch (erro) {
            return res.status(500).json({ erro: 'Erro ao renderizar documento', detalhes: erro });
        }

        const buffer = doc.getZip().generate({ type: 'nodebuffer' });

        const nomeArquivo = `OS_${tipo.toUpperCase()}_${data.tombamento}_${Date.now()}.docx`;
        const caminhoFinal = path.join(__dirname, `../../output/${nomeArquivo}`);
        fs.writeFileSync(caminhoFinal, buffer);

        res.download(caminhoFinal);
    });
};

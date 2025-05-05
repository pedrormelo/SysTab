const db = require('../config/db');
const PDFDocument = require('pdfkit');
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale');

// Criar novo chamado
exports.criarChamado = async (req, res) => {
    const { idTablet, problema, itens_recebidos } = req.body;
    try {
        const [tablet] = await db.query('SELECT * FROM tablets WHERE id = ?', [idTablet]);
        if (tablet.length === 0) return res.status(404).json({ message: 'Tablet não encontrado.' });

        const [result] = await db.query(
            'INSERT INTO chamados (idTablet, problema, itens_recebidos) VALUES (?, ?, ?)',
            [idTablet, problema, itens_recebidos]
        );
        res.status(201).json({ message: 'Chamado criado com sucesso.', id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar chamado.', error: err });
    }
};

// Listar todos os chamados
exports.listarChamado = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM chamados');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar chamados.', error: err });
    }
};

// Listar chamados por tablet
exports.listarChamadoPorId = async (req, res) => {
    const { idTablet } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM chamados WHERE idTablet = ?', [idTablet]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar chamados por tablet.', error: err });
    }
};

// Atualizar chamado
exports.atualizarChamado = async (req, res) => {
    const { id } = req.params;
    const { problema, itens_recebidos } = req.body;
    try {
        await db.query(
            'UPDATE chamados SET problema = ?, itens_recebidos = ? WHERE id = ?',
            [problema, itens_recebidos, id]
        );
        res.json({ message: 'Chamado atualizado com sucesso.' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar chamado.', error: err });
    }
};

// Fechar chamado
exports.atualizarStatus = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(
            'UPDATE chamados SET status = "Fechado", dataSaida = NOW() WHERE id = ?',
            [id]
        );
        res.json({ message: 'Chamado fechado com sucesso.' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao fechar chamado.', error: err });
    }
};

// Deletar chamado
exports.deletarChamado = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM chamados WHERE id = ?', [id]);
        res.json({ message: 'Chamado deletado com sucesso.' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao deletar chamado.', error: err });
    }
};

// Listar chamados abertos há mais de X dias
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

// Buscar chamado pelo ID do chamado
exports.buscarChamadoPorIdChamado = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM chamados WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Chamado não encontrado.' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar chamado.', error: err });
    }
};


// Gerar Ordem de Serviço (PDF)
exports.gerarOS = async (req, res) => {
    const { id } = req.params;

    try {
        const [chamadoRows] = await db.query('SELECT * FROM chamados WHERE id = ?', [id]);
        if (chamadoRows.length === 0) return res.status(404).json({ message: 'Chamado não encontrado.' });

        const chamado = chamadoRows[0];

        const [tabletRows] = await db.query(`
            SELECT t.*, u.nome AS nome_unidade, r.nome AS nome_regional, e.nome AS nome_empresa
            FROM tablets t
            JOIN unidades u ON t.idUnidade = u.id
            JOIN regionais r ON u.idRegional = r.id
            JOIN empresas e ON t.idEmpresa = e.id
            WHERE t.id = ?
        `, [chamado.idTablet]);

        if (tabletRows.length === 0) return res.status(404).json({ message: 'Tablet vinculado não encontrado.' });

        const tablet = tabletRows[0];

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="os_chamado_${id}.pdf"`);

        doc.fontSize(20).text('Ordem de Serviço - Chamado de Tablet', { align: 'center' });
        doc.moveDown();

        const dataFormatada = format(new Date(chamado.dataEntrada), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

        doc.fontSize(12).text(`ID do Chamado: ${chamado.id}`);
        doc.text(`Data de Entrada: ${dataFormatada}`);
        doc.text(`Status: ${chamado.status}`);
        doc.text(`Problema: ${chamado.problema}`);
        doc.text(`Itens Recebidos: ${chamado.itens_recebidos ? 'Sim' : 'Não'}`);
        doc.moveDown();

        doc.text(`Tablet - Tombamento: ${tablet.tombamento}`);
        doc.text(`Número de Série: ${tablet.ns}`);
        doc.text(`Usuário: ${tablet.usuario}`);
        doc.text(`Unidade: ${tablet.nome_unidade}`);
        doc.text(`Regional: ${tablet.nome_regional}`);
        doc.text(`Empresa: ${tablet.nome_empresa}`);

        doc.end();
        doc.pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao gerar Ordem de Serviço.', error: err });
    }
};

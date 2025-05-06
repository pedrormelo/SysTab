const db = require('../config/db');
const path = require('path');
const fs = require('fs');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale');

exports.listarChamados = (req, res) => {
    const sql = `
        SELECT chamados.*, tablets.tombamento, tablets.modelo, tablets.imei, usuarios.nomeUser, usuarios.telUser
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

exports.criarChamado = (req, res) => {
    const { idTab, problema, item } = req.body;
    const sql = 'INSERT INTO chamados (idTab, problema, item, situacao, dataAbertura) VALUES (?, ?, ?, "Pendente", NOW())';
    db.query(sql, [idTab, problema, item], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ idChamado: result.insertId });
    });
};

exports.fecharChamado = (req, res) => {
    const { id } = req.params;
    const sql = 'UPDATE chamados SET situacao = "Concluído", dataFechamento = NOW() WHERE idChamado = ?';
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensagem: 'Chamado fechado com sucesso' });
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


exports.listarChamadoPorTablet = async (req, res) => {
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

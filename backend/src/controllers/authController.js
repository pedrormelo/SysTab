const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const SECRET = process.env.JWT_SECRET || 'systab_super_secreto';


exports.login = async (req, res) => {
    // Debug log to see what is being received from frontend
    console.log('Login POST body:', req.body);
    const { nome, senha } = req.body;
    try {
        const [result] = await db.query('SELECT * FROM login WHERE nome = ?', [nome]);
        const user = result[0];
        if (!user) return res.status(401).json({ error: 'Usuário ou senha inválidos' });
        const valid = await bcrypt.compare(senha, user.senha);
        if (!valid) return res.status(401).json({ error: 'Usuário ou senha inválidos' });
        const token = jwt.sign({ idLogin: user.idLogin, nivel: user.nivel }, SECRET, { expiresIn: '1d' });
        res.json({ token, usuario: { nome: user.nome, nivel: user.nivel } });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro no login' });
    }
};

module.exports = (req, res, next) => {
    if (!req.usuario || req.usuario.nivel !== 'admin') {
        return res.status(403).json({ error: 'Acesso restrito a administradores.' });
    }
    next();
};

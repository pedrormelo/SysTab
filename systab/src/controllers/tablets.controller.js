const pool = require('../config/db');

const getTablets = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tablets');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const searchTablets = async (req, res) => {
    const { idTomb } = req.query;
    try {
        const [rows] = await pool.query(`SELECT * FROM tablets WHERE idTomb = '${idTomb}'`);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getTablets,
    searchTablets,
};
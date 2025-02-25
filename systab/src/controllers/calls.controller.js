const pool = require('../config/db');

const getCalls = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM calls');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createCall = (req, res) => {
    // Logic to create a new call
    res.status(201).send('Call created');
};

module.exports = {
    getCalls,
    createCall,
};

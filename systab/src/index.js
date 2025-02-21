const express = require('express');
const cors = require('cors');
require('dotenv').config();

const tabletsRoutes = require('./routes/tablets.routes');
const chamadosRoutes = require('./routes/calls.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tablets', tabletsRoutes);
app.use('/api/chamados', chamadosRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});


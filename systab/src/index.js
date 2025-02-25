const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();

const tabletsRoutes = require('./routes/tablets.routes.js');
const chamadosRoutes = require('./routes/calls.routes.js');

app.use(cors());
app.use(express.json());

app.use('/tablets', tabletsRoutes);
app.use('/api/chamados', chamadosRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// a vida é feita de escolhas, e eu so escolhi errado, talvez pelos erros da vida, talvez por ser humano
// mas eu mão me arrependo de tudo que fiz, e de tudo que não fiz. apenas saia da matrix e viva a vida
// como ela é, um jogo, onde o vencedor é quem mais se diverte.+ 

//Por que escreveu isso?


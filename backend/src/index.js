require('dotenv').config();

const express = require('express');
const cors = require('cors');

const tabletsRoutes = require('./routes/tabletsRoutes.js');
const chamadosRoutes = require('./routes/chamadosRoutes.js');
const empresasRoutes = require("./routes/empresasRoutes");
const usersRoutes = require("./routes/usersRoutes");
const unidadesRoutes = require("./routes/unidadesRoutes");
const regRoutes = require("./routes/regRoutes");

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', //frontend url
    credentials: true,
}));

app.use(express.json());

//rotas
app.use('/tablets', tabletsRoutes);
app.use('/chamados', chamadosRoutes);
app.use('/empresas', empresasRoutes);
app.use('/usuarios', usersRoutes);
app.use('/unidades', unidadesRoutes);
app.use('/regionais', regRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;

// a vida é feita de escolhas, e eu so escolhi errado, talvez pelos erros da vida, talvez por ser humano
// mas eu mão me arrependo de tudo que fiz, e de tudo que não fiz. apenas saia da matrix e viva a vida
// como ela é, um jogo, onde o vencedor é quem mais se diverte.+ 

//Por que escreveu isso?


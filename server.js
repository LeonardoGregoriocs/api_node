const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 4000;
const usuarioRoute = require('./routes/UsuarioRoute');
const produtosRoute = require('./routes/ProdutoRoute');

app.use(bodyParser.json())

app.use('/usuario', usuarioRoute)
app.use('/produto', produtosRoute)

app.listen(PORT, () => console.log("Servidor rodando na porta "+ PORT));

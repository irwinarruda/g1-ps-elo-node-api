const express = require("express");
const app = express();
const mongoose = require("mongoose");

// Configurando o Banco de dados
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://sistemawebelo.68fnn.mongodb.net/sistemaweb", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => console.log("BANCO DE DADOS ACESSADO COM SUCESSO"))
.catch((err) => console.error("ERRO AO ACESSAR O BANCO DE DADOS " + err));

// Abrindo o servidor na porta 6001
const PORT = process.env.PORT || 6001;
app.listen(PORT, () => console.log("SERVIDOR RODANDO NA PORTA " + PORT));
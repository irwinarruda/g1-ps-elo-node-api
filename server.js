const express = require("express");
const app = express();
const mongoose = require("mongoose");
const routes = require("./src/routes");

// Permite requerer respostas .json
app.use(express.json());

// Configurando o Banco de dados
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://@sistemawebelo.68fnn.mongodb.net/sistemaweb", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => console.log("BANCO DE DADOS ACESSADO COM SUCESSO"))
.catch((err) => console.error("ERRO AO ACESSAR O BANCO DE DADOS " + err));

// Configurando as Rotas
app.use("/api", routes);

// Abrindo o servidor na porta 3005
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log("SERVIDOR RODANDO NA PORTA " + PORT));
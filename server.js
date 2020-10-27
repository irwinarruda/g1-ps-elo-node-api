const express = require("express");
const app = express();
const mongoose = require("mongoose");
const routes = require("./src/routes");
const dotenv = require("dotenv");
const path = require("path");

app.use(express.json());
app.use(express.static(path.join(__dirname + "/public")));
dotenv.config();

// Configurando o Banco de dados
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_CONNECT, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => console.log("BANCO DE DADOS ACESSADO COM SUCESSO"))
.catch((err) => console.error("ERRO AO ACESSAR O BANCO DE DADOS " + err));

// Configurando as Rotas
app.use("/api", routes);

// Abrindo o servidor na porta 3005
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log("SERVIDOR RODANDO NA PORTA " + PORT));

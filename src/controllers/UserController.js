const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("user");

module.exports = {
    async index(req, res) {
        try {
            const user = await User.find();
            console.log("USUARIOS PROCURADOS COM SUCESSO");
            return res.json(user);
        } catch (err) {
            console.error("ERRO AO PROCURAR USUÁRIOS: " + err);
        } 
    },
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            console.log("USUARIO CRIADO COM SUCESSO");
            return res.json(user);
        } catch(err) {
            console.error("ERRO AO CRIAR USUÁRIO: " + err);
        } 
    }
}
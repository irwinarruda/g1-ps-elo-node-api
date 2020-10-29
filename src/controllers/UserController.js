const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
            const haveUser = await User.findOne({ email: req.body.email });
            if(haveUser !== null) {
                throw new Error("USUÁRIO JÁ EXISTE");
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, salt);
            req.body.password = hashPassword;

            const user = await User.create(req.body);
            console.log("USUARIO CRIADO COM SUCESSO");
            return res.json(user);
        } catch(err) {
            console.error("ERRO AO CRIAR USUÁRIO: " + err);
            return res.status(400).send("ERRO AO CRIAR USUÁRIO:" + err);
        } 
    },
    async getUser(req, res) {
        try {

            const user = await User.findOne({email: req.body.email});
            if(!user) {
                throw new Error("EMAIL INVALIDO");
            }
            const samePassword = await bcrypt.compare(req.body.password, user.password);
            
            if(samePassword) {
                console.log("USUARIO LOGADO COM SUCESSO");
                return res.json(user);
                
            } else {
                throw new Error("SENHA INVÁLIDA");
            }    
            
        } catch(err) {
            console.error("ERRO AO SOLICITAR USUÁRIO: " + err);
            return res.status(404).send("ERRO AO SOLICITAR USUÁRIO: " + err);
        }
        
    }
}
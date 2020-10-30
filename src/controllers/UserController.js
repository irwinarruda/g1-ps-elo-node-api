require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const User = mongoose.model("user");
const imgURL = "http://localhost:3005/uploads/";

module.exports = {
    async findUsers(req, res) {
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
            if(req.file) {
                var pathImg = `${imgURL}${req.file.filename}`;
            } else {
                var pathImg = ``;
            }
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, salt);
            const newUser = {
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
                urlImg: pathImg
            };
            const user = await User.create(newUser);
            console.log("USUARIO CRIADO COM SUCESSO");
            return res.json(user);
        } catch(err) {
            if(req.file) fs.unlinkSync(`${req.file}`);
            console.error("ERRO AO CRIAR USUÁRIO: " + err);
            return res.status(400).send("ERRO AO CRIAR USUÁRIO:" + err);
        } 
    },
    async getUser(req, res) {
        try {
            const user = await User.findOne({email: req.body.email});
            const samePassword = await bcrypt.compare(req.body.password, user.password);
            if(samePassword) {
                console.log("USUARIO LOGADO COM SUCESSO");
                return res.json(user);
            } else {
                throw new Error("SENHA INVÁLIDA");
            }
        } catch(err) {
            console.error("ERRO AO SOLICITAR USUÁRIO: " + err);
            return res.status(400).send("ERRO AO SOLICITAR USUÁRIO: " + err);
        }
    },
    async updateUser(req, res) {
        try {
            if(req.file) {
                var pathImg = `${imgURL}${req.file.filename}`;
            } else {
                throw new Error("IMAGEM NÃO INSERIDA");
            }
            const user = await User.findOneAndUpdate({email: req.body.email}, {urlImg: pathImg}, {new: true});
            console.log("USUARIO ATUALIZADO COM SUCESSO");
            return res.json(user);
        } catch(err) {
            console.error("ERRO AO ATUALIZAR USUÁRIO: " + err);
            return res.status(400).send("ERRO AO ATUALIZAR USUÁRIO: " + err);
        }
    },
    async destroy(req, res) {
        try {
            User.findOneAndRemove({email: req.body.email});
            console.log("USUÁRIO REMOVIDO COM SUCESSO");
            return res.send("USUÁRIO REMOVIDO COM SUCESSO");
        } catch(err) {
            console.error("ERRO AO REMOVER USUÁRIO: " + err);
            return res.status(400).send("ERRO AO REMOVER USUÁRIO: " + err);
        }
    }
}
require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const User = mongoose.model("user");
const imgURL = "http://localhost:3005/uploads/";

module.exports = {
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
            if(req.file) {
                fs.unlinkSync(`public/uploads/${req.file.filename}`);
            }
            console.error("ERRO AO CRIAR USUÁRIO: " + err);
            const statusNumber = 400;
            const satusmessage = {
                status: statusNumber,
                error: "ERRO AO CRIAR USUÁRIO: " + err
            }
            return res.status(statusNumber).json(satusmessage);
        } 
    },
    async getUser(req, res) {
        try {
            const user = await User.findOne({email: req.body.email});
            if(!user){
                throw new Error("EMAIL INVALIDO"); 
            }
            const samePassword = await bcrypt.compare(req.body.password, user.password);
            if(samePassword){
                const userInfo = {
                    username: user.username,
                    email: user.email
                };
                const accesstoken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '60s'});
                console.log(accesstoken);
                console.log("USUARIO LOGADO COM SUCESSO");
                const accesstokenResponse = {
                    username: user.username,
                    email: user.email,
                    accesstoken: accesstoken
                }
                return res.json(accesstokenResponse);
            } else {
                throw new Error("SENHA INVÁLIDA");
            }
        } catch(err) {
            console.error("ERRO AO SOLICITAR USUÁRIO: " + err);
            const statusNumber = 400;
            const satusmessage = {
                status: statusNumber,
                error: "ERRO AO SOLICITAR USUÁRIO: " + err
            }
            return res.status(statusNumber).json(satusmessage);
        }
    },
    async updateUser(req, res) {
        try {
            const authenticatedUser = req.user;
            if(req.file) {
                var pathImg = `${imgURL}${req.file.filename}`;
            } else {
                throw new Error("IMAGEM NÃO INSERIDA");
            }
            const user = await User.findOne({email: authenticatedUser.email});
            fs.unlinkSync(`public/uploads/${user.urlImg.split("/")[4]}`);

            const userUpdate = await User.findOneAndUpdate({email: req.user.email}, {urlImg: pathImg}, {new: true});
            console.log("USUARIO ATUALIZADO COM SUCESSO");
            return res.json(userUpdate);
        } catch(err) {
            fs.unlinkSync(`public/uploads/${req.file.filename}`);
            console.error("ERRO AO ATUALIZAR USUÁRIO: " + err);
            const statusNumber = 400;
            const satusmessage = {
                status: statusNumber,
                error: "ERRO AO ATUALIZAR USUÁRIO: " + err
            }
            return res.status(statusNumber).json(satusmessage);
        }
    },
    /* async findUsers(req, res) {
        try {
            const user = await User.find();
            console.log("USUARIOS PROCURADOS COM SUCESSO");
            return res.json(user);
        } catch (err) {
            console.error("ERRO AO PROCURAR USUÁRIOS: " + err);
        } 
    }, */
    /* async destroy(req, res) {
        try {
            User.findOneAndRemove({email: req.body.email});
            console.log("USUÁRIO REMOVIDO COM SUCESSO");
            return res.send("USUÁRIO REMOVIDO COM SUCESSO");
        } catch(err) {
            console.error("ERRO AO REMOVER USUÁRIO: " + err);
            return res.status(400).send("ERRO AO REMOVER USUÁRIO: " + err);
        }
    } */
}
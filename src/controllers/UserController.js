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
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, salt);

            const arrRequest = req.body;
            const newUser = {
                username: arrRequest.username,
                email: arrRequest.email,
                password: hashPassword,
            };
            await User.create(newUser);
            const arrResponse = {
                username: arrRequest.username,
                email: arrRequest.email,
            };
            console.log("USUARIO CRIADO COM SUCESSO");
            return res.json(arrResponse);
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
                const accesstoken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1000s'});
                console.log(accesstoken);
                console.log("USUARIO LOGADO COM SUCESSO");
                const accesstokenResponse = {
                    username: user.username,
                    email: user.email,
                    urlImg: user.urlImg,
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
            if(user.urlImg !== "") {
                fs.unlinkSync(`public/uploads/${user.urlImg.split("/")[4]}`);
            }
            const userUpdate = await User.findOneAndUpdate({email: req.user.email}, {urlImg: pathImg}, {new: true, useFindAndModify: false});
            const arrResponse = {
                username: userUpdate.username,
                email: userUpdate.email,
                urlImg: userUpdate.urlImg
            };
            console.log("USUARIO ATUALIZADO COM SUCESSO");
            return res.json(arrResponse);
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
    async updateMovieDB(req, res) {
        try {
            const authenticatedUser = req.user;
            const user = await User.findOne({email: authenticatedUser.email});
            user.movieDB.push(Number(req.body.movieDB))
            const userUpdate = await User.findOneAndUpdate({email: req.user.email}, {movieDB: user.movieDB}, {new: true, useFindAndModify: false});
            const arrResponse = {
                username: userUpdate.username,
                email: userUpdate.email,
                movieDB: userUpdate.movieDB
            };
            console.log("MOVIEDB ATUALIZADO COM SUCESSO");
            return res.json(arrResponse);

        } catch(err) {
            console.error("ERRO AO ATUALIZAR MOVIEDB: " + err);
            const statusNumber = 400;
            const satusmessage = {
                status: statusNumber,
                error: "ERRO AO ATUALIZAR MOVIEDB: " + err
            }
            return res.status(statusNumber).json(satusmessage);
        }
    },
}
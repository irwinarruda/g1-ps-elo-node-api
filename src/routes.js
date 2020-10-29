const express = require("express");
const routes = express.Router();
const UserController = require("./controllers/UserController");
const multer = require("multer");
const multerConfig = require("./config/multer");
const upload = multer(multerConfig);

routes.get("/user", UserController.index);
routes.post("/user/register", upload.single("userImage"), UserController.createUser);
routes.post("/user/login", UserController.getUser);

module.exports = routes;
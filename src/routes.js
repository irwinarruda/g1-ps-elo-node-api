const express = require("express");
const routes = express.Router();
const UserController = require("./controllers/UserController");
const multer = require("multer");
const multerConfig = require("./config/multer");
const upload = multer(multerConfig);
const verifyUser = require("./config/authjwt");

//routes.get("/user", UserController.findUsers);
routes.post("/user/register", upload.single("userImage"), UserController.createUser);
routes.post("/user/login", UserController.getUser);
routes.put("/user/update", verifyUser, upload.single("userImage"), UserController.updateUser);

module.exports = routes;
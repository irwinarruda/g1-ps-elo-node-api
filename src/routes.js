const express = require("express");
const routes = express.Router();
const UserController = require("./controllers/UserController");

routes.get("/user", UserController.index);
routes.post("/user/register", UserController.createUser);
routes.post("/user/login", UserController.getUser);

module.exports = routes;
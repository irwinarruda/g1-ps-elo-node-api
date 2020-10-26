const express = require("express");
const routes = express.Router();
const UserController = require("./controllers/UserController");

routes.get("/user", UserController.index);
routes.post("/user/new", UserController.createUser);
routes.post("/user/check", UserController.getUser);

module.exports = routes;
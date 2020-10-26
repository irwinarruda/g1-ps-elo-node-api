const express = require("express");
const routes = express.Router();
const UserController = require("./controllers/UserController");

routes.get("/user", UserController.index);
routes.post("/user/new", UserController.createUser);

module.exports = routes;
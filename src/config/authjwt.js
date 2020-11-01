const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token === null) {
        res.sendStatus(400)//.send("TOKEN NÃO ENCONTRADO");
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {
            res.status(400).send("TOKEN INVÁLIDO");
        }
        req.user = user;
        console.log("reqUser " + req.user.email);
        next();
    }); 
}
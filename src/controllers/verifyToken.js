const jwt = require("jsonwebtoken");

module.exports = function(req, res, next){
    const verification = req.token;
    if(!verification) return res.status(401).send("acess denied");

    try {
        const verified = jwt.verify(verification, process.env.TOKEN_SECRET);
        req.user = verified; 
    } catch (err){
        res.status(400).send("invalid token");
    }
}
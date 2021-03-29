const jwt = require("jsonwebtoken");
const config = require("../config/config");
const usersTest = require("../config/usersTest");


function verifyToken(req, res, next) {
    let token = "";
    try {
        token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(403).send({
                message: "No token provided!"
            });
        }
    } catch (error) {
        return res.status(403).send({ message: "No token provided!" });
    }


    jwt.verify(token, config.auth.secret, (err, decoded) => {

        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
        next();
    });
};

function isAdmin(req, res, next) {
    if (usersTest.users.find(u => u.id === req.userId).roles === "admin") {
        next();
        return;
    }
    res.status(403).send({
        message: "Require Admin Role!"
    });
    return;

};

function isModerator(req, res, next) {
    if (usersTest.users.find(u => u.id === req.userId).roles === "user" || usersTest.users.find(u => u.id === req.userId).roles === "admin") {
        next();
        return;
    }
    res.status(403).send({
        message: "Require Admin Role!"
    });
    return;
};


const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isModerator: isModerator,
};
module.exports = authJwt;
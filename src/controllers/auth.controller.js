const config = require("../config/config");
const usersTest = require("../config/usersTest");
var jwt = require("jsonwebtoken");


async function isValid(username) {
    return usersTest.users.find(u => u.username === username)

}
exports.signin = (req, res) => {
    isValid(req.body.username).

    then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = req.body.password === user.password;

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            var token = jwt.sign({ id: user.id, username: user.username }, config.auth.secret, {
                expiresIn: config.auth.expiresIn // 24 hours
            });

            res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                roles: user.roles,
                accessToken: token
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};
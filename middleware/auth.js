const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.header('Authentication')
    if (!token) {
        return res.status(401).send("Unauthenticated")
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user;
        next();
    } catch (error) {
        console.log(error.name, "--", error.message)
    }
}
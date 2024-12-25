
const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/UnauthorizedError");

const auth = async  (req, res, next) => {
    // can save token in cookie or headers
    const authHeader = req.headers["authorization"];
    const authCookie = req.cookies['accessToken'];

    const token = authCookie || (authHeader && authHeader.startsWith("Bearer ")) ? authHeader.split(" ")[1] : null;

    if (!token) {
        throw new UnauthorizedError("Access denied. Missing token");
    }

    const decoded = await jwt.verify(token, process.env['SECRET_KEY_ACCESS_TOKEN'] );
    if(!decoded)
        throw  new UnauthorizedError("Access denied. Invalid token");
    req.userId = decoded.id;
    next();
}

module.exports = auth;
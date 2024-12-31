const jwt = require("jsonwebtoken")

const generateAccessToken  = async (userId) =>{
    return await jwt.sign({id: userId}, process.env['SECRET_KEY_ACCESS_TOKEN'], {
        expiresIn: "15m"
    });
}

module.exports = generateAccessToken;

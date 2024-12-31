const jwt = require('jsonwebtoken')
const UserModel = require('../models/User.model')
const generateRefreshToken = async (userId) => {
    const token = await jwt.sign({
        id: userId,
    }, process.env['SECRET_KEY_REFRESH_TOKEN'], {expiresIn: "15d"});

    const user = await UserModel.updateOne({_id: userId}, {
        refreshToken: token
    });
    return token;
}

module.exports = generateRefreshToken;
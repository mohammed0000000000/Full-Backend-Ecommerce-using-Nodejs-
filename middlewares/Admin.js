
const UserModel = require("../models/User.model")
const UnauthorizedError = require("../errors/UnauthorizedError");
const admin = async (req, res, next) => {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if(user.role !== 'ADMIN'){
        throw new UnauthorizedError("Permission denied");
    }
    next();
}

module.exports = admin;
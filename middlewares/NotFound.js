const {StatusCodes} = require("http-status-codes");

const NotFound = (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({
        message: "This Page does not exist"
    });
}
module.exports = NotFound;
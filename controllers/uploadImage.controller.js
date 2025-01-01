import BadRequestError from "../errors/BadRequestError";
import {StatusCodes} from "http-status-codes";
import uploadImageClodinary from "../utils/uploadImageClodinary";
import CustomApiError from "../errors/CustomApiError";

const uploadImageController = async (req, res) => {
    const file = req.file;
    if (!file) {
        throw new BadRequestError("No image uploaded.");
    }
    let uploadImage;
    try {
        uploadImage = await uploadImageClodinary(file)
    } catch (e) {
        throw new CustomApiError("Failed to upload image");
    }
    return res.status(StatusCodes.OK).json({
        message: "Image uploaded successfully",
        data: uploadImage
    });
}

module.exports = {uploadImageController}
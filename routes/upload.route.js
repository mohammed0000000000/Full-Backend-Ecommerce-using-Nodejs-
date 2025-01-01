const { Router }  =  require('express');
const auth =  require("../middlewares/auth")
const {uploadImageController} =  require('../controllers/uploadImage.controller');
const upload =  require("../middlewares/multer")

const uploadRouter = Router()

uploadRouter.post("/upload",auth,upload.single("image"),uploadImageController)

module.exports = uploadRouter

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name : process.env.CLODINARY_CLOUD_NAME,
    api_key : process.env.CLODINARY_API_KEY,
    api_secret : process.env.CLODINARY_API_SECRET_KEY
})

const uploadImageClodinary = async (image) => {
    try{
        const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());
        const uploadImage = await new Promise((resolve,reject)=>{
            cloudinary.uploader.upload_stream({ folder : "binkeyit"},(error,uploadResult)=>{
                return resolve(uploadResult)
            }).end(buffer)
        })

        return uploadImage
    }
    catch(error){
        console.error("Error uploading image to cloudinary", error)
        return error;
    }

}
module.exports = uploadImageClodinary;
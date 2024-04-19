
import multer from "multer";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables

cloudinary.v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


const storage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     cb(null, "uploads/");
    // },
    // filename: (req, file, cb) => {
    //     cb(null, Date.now()+ " " + file.originalname);
    // },

});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1 // 1MB file size limit
    }
});

const uploadImage = (req, res, next) => {
    upload.single('image')(req, res, async error => {
        try {
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                req.cloudinaryImageUrl = result.secure_url;
            }
            next();
        } catch (error) {
            return next(error);
        }
    });
};

export default uploadImage;









// const upload = multer({ storage: storage });

// export default upload

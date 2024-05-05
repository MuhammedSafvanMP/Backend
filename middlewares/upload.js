
import multer from "multer";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables
import sharp from "sharp"; 

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
        fileSize: 1024 * 1024 * 4 // 4MB file size limit
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

// const uploadImage = (req, res, next) => {
//     upload.single('image')(req, res, async error => {
//         try {
//             if (error) {
//                 console.error("Multer Error:", error);
//                 return next(error);
//             }
//             if (!req.file) {
//                 console.error("No file uploaded");
//                 return res.status(400).json({ error: "No file uploaded" });
//             }

//             // Process the image using Sharp for compression
//             const buffer = await sharp(req.file.buffer)
//                 .resize({ fit: 'inside', width: 800 }) 
//                 .jpeg({ quality: 80 }) 
//                 .png({quality: 80 }) 
//                 .toBuffer(); 

//             // Upload the compressed image to Cloudinary
//             const result = await cloudinary.uploader.upload(buffer, { resource_type: 'image' });
            
//             req.cloudinaryImageUrl = result.secure_url;
//             console.log("Image uploaded to Cloudinary:", req.cloudinaryImageUrl);
//             next();
//         } catch (error) {
//             console.error("Error:", error);
//             return next(error);
//         }
//     });
// };




export default uploadImage;









// const upload = multer({ storage: storage });

// export default upload

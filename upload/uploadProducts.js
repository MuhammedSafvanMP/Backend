import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "img/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+ " " + file.originalname);
    },
});

const uploadProducts = multer({ storage: storage });

export default uploadProducts

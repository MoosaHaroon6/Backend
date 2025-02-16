import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

/* Disk Storage */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'public', 'images', 'uploads')); 
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, (error, name) => {
            if (error) cb(error);
            const fn = name.toString("hex") + path.extname(file.originalname);
            cb(null, fn);
        });
    }
});

const upload = multer({ storage: storage });

export default upload;

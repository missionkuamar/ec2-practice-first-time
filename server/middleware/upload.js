// server/middleware/upload.js
import multer from 'multer';
import { storage } from '../config/cloudinary.js';

console.log('Multer storage configured:', storage ? 'Yes' : 'No');

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;

    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error("Only jpeg, jpg, png, webp files allowed"));
    }
  },
});

// ❌ REMOVE THIS (WRONG CODE THAT CAUSES ERROR)
// upload.single('image')(req, res, (err) => {...})

export default upload;

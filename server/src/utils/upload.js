// middleware/upload.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'dobby-ads',
    resource_type: 'auto', // safer than "image"
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    public_id: `${Date.now()}-${file.originalname.split('.')[0]}`, // unique name
  }),
});

export const upload = multer({ storage });

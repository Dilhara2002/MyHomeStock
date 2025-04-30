import multer from 'multer';
import sharp from 'sharp';

const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
      return cb(new Error('Please upload an image file'));
    }
    cb(null, true);
  }
});

const processImage = async (req, res, next) => {
  if (!req.file) return next();
  
  try {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 300, height: 300 })
      .png()
      .toBuffer();

    req.file.buffer = buffer;
    req.file.mimetype = 'image/png';
    next();
  } catch (error) {
    next(error);
  }
};

export { upload, processImage };
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, admin } = require('../middleware/authMiddleware');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Allowed file mimetypes
const ALLOWED_MIMETYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/flac',
  'audio/ogg',
  'audio/aac',
  'audio/mp4',
  'audio/x-m4a',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

// Multer config (memory storage with fileFilter)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max file size
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIMETYPES.includes(file.mimetype) || file.mimetype.startsWith('audio/') || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio (MP3, WAV, FLAC) and image (JPG, PNG, WebP) files are allowed.'));
    }
  }
});

// Middleware helper for upload single with error catching
const handleUpload = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum allowed size is 50MB.' });
      }
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

// @desc    Upload file to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, handleUpload, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Determine resource type and format based on mimetype
  const uploadOptions = {
    folder: 'playback'
  };

  if (req.file.mimetype.startsWith('audio/')) {
    uploadOptions.resource_type = 'video';
    uploadOptions.format = 'mp3';
  } else if (req.file.mimetype.startsWith('image/')) {
    uploadOptions.resource_type = 'image';
  } else {
    uploadOptions.resource_type = 'auto';
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    uploadOptions,
    (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ message: 'Error uploading to cloud storage', error: error.message });
      }
      res.json({
        message: 'File uploaded successfully',
        url: result.secure_url,
        public_id: result.public_id
      });
    }
  );

  // End the stream with the file buffer
  uploadStream.end(req.file.buffer);
});

module.exports = router;

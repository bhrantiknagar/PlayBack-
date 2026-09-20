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

// Multer config (memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max file size
  }
});

// @desc    Upload file to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Determine resource type based on mimetype
  // Mime types starting with 'audio' should be treated as video by Cloudinary for correct processing.
  let resourceType = 'auto';
  if (req.file.mimetype.startsWith('audio/')) {
    resourceType = 'video';
  } else if (req.file.mimetype.startsWith('image/')) {
    resourceType = 'image';
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      resource_type: resourceType,
      folder: 'playback'
    },
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

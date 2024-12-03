const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Gallery = require('../models/Gallery');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/gallery';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, 'gallery-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Get all gallery images
router.get('/', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ uploadDate: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching gallery images' });
  }
});

// Upload new image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const newImage = new Gallery({
      image: '/uploads/gallery/' + req.file.filename,
      caption: req.body.caption || ''
    });

    const savedImage = await newImage.save();
    res.status(201).json(savedImage);
  } catch (error) {
    res.status(500).json({ error: 'Error uploading image' });
  }
});

// Update image caption
router.patch('/:id', async (req, res) => {
  try {
    const { caption } = req.body;
    
    // Validate caption
    if (caption === undefined) {
      return res.status(400).json({ error: 'Caption is required' });
    }

    // Find and update the image
    const updatedImage = await Gallery.findByIdAndUpdate(
      req.params.id,
      { caption },
      { new: true, runValidators: true }
    );
    
    if (!updatedImage) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    // Return the complete updated image object
    res.json(updatedImage);
  } catch (error) {
    console.error('Error updating caption:', error);
    res.status(500).json({ error: 'Error updating image caption' });
  }
});

// Delete image
router.delete('/:id', async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '..', image.image);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting image' });
  }
});

module.exports = router;

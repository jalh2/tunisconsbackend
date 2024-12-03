const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const aboutController = require('../controllers/aboutController');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: './uploads/about/',
  filename: function(req, file, cb) {
    cb(null, 'about-image' + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Public route - get about info
router.get('/', aboutController.getAboutContent);

// Update about info
router.put('/', aboutController.updateAboutContent);
router.post('/image', upload.single('image'), aboutController.updateImage);

module.exports = router;

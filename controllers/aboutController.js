const About = require('../models/About');

// Get about page content
const getAboutContent = async (req, res) => {
  try {
    const aboutContent = await About.getAboutContent();
    res.status(200).json(aboutContent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update about page content
const updateAboutContent = async (req, res) => {
  try {
    const updatedContent = await About.updateAboutContent(req.body);
    res.status(200).json(updatedContent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update about page image
const updateImage = async (req, res) => {
  try {
    if (!req.file) {
      throw Error('No image file provided');
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const alt = req.body.alt || 'About page image';
    
    const updatedContent = await About.updateImage(imageUrl, alt);
    res.status(200).json(updatedContent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAboutContent,
  updateAboutContent,
  updateImage
};

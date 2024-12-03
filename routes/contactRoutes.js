const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Get contact information
router.get('/', async (req, res) => {
  try {
    const contact = await Contact.findOne().sort({ updatedAt: -1 });
    res.json(contact || {});
  } catch (error) {
    res.status(500).json({ error: 'Error fetching contact information' });
  }
});

// Update contact information
router.post('/', async (req, res) => {
  try {
    const { location, phoneNumbers, email } = req.body;

    // Validate required fields
    if (!location || !phoneNumbers || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create or update contact info
    const contact = await Contact.findOneAndUpdate(
      {}, // empty filter to match any document
      {
        location,
        phoneNumbers,
        email,
        updatedAt: Date.now()
      },
      {
        new: true,
        upsert: true, // create if doesn't exist
        runValidators: true
      }
    );

    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Error updating contact information' });
  }
});

module.exports = router;

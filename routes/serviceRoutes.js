const express = require('express');
const router = express.Router();
const {
  getServices,
  addService,
  updateService,
  deleteService
} = require('../controllers/serviceController');

// Public route - get services
router.get('/', getServices);

// Admin routes for managing services
router.post('/', addService);

router.put('/:id', updateService);

router.delete('/:id', deleteService);

module.exports = router;

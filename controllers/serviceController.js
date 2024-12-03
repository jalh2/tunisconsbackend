const Service = require('../models/Service');

// Get all services
const getServices = async (req, res) => {
  try {
    const services = await Service.getAllServices();
    res.json(services);
  } catch (error) {
    console.error('Error in getServices:', error);
    res.status(500).json({ error: error.message || 'Error fetching services' });
  }
};

// Add a new service
const addService = async (req, res) => {
  try {
    console.log('Received service data:', req.body);
    
    if (!req.body.name || !req.body.description) {
      return res.status(400).json({ 
        error: 'Name and description are required' 
      });
    }

    const service = await Service.addService(req.body);
    console.log('Service created:', service);
    res.status(201).json(service);
  } catch (error) {
    console.error('Error in addService:', error);
    res.status(400).json({ error: error.message || 'Error adding service' });
  }
};

// Update a service
const updateService = async (req, res) => {
  try {
    console.log('Updating service:', req.params.id, 'with data:', req.body);
    
    if (!req.body.name || !req.body.description) {
      return res.status(400).json({ 
        error: 'Name and description are required' 
      });
    }

    const service = await Service.updateService(req.params.id, req.body);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    console.log('Service updated:', service);
    res.json(service);
  } catch (error) {
    console.error('Error in updateService:', error);
    res.status(400).json({ error: error.message || 'Error updating service' });
  }
};

// Delete a service
const deleteService = async (req, res) => {
  try {
    console.log('Deleting service:', req.params.id);
    const service = await Service.deleteService(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    console.log('Service deleted:', service);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error in deleteService:', error);
    res.status(400).json({ error: error.message || 'Error deleting service' });
  }
};

module.exports = {
  getServices,
  addService,
  updateService,
  deleteService
};

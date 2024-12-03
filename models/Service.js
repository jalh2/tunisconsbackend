const mongoose = require('mongoose');
const { getIconForService } = require('../utils/iconMapper');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    default: 'faWrench'  // Default icon if none is assigned
  }
}, {
  timestamps: true
});

// Pre-save middleware to automatically assign icon
serviceSchema.pre('save', function(next) {
  if (!this.icon || this.isModified('name')) {
    this.icon = getIconForService(this.name);
  }
  next();
});

// Pre-update middleware to automatically assign icon when name changes
serviceSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.name) {
    update.icon = getIconForService(update.name);
  }
  next();
});

// Static method to get all services
serviceSchema.statics.getAllServices = async function() {
  return await this.find({});
};

// Static method to add a new service
serviceSchema.statics.addService = async function(serviceData) {
  try {
    const service = new this(serviceData);
    return await service.save();
  } catch (error) {
    console.error('Error in addService static method:', error);
    throw error;
  }
};

// Static method to update a service
serviceSchema.statics.updateService = async function(id, serviceData) {
  try {
    return await this.findByIdAndUpdate(id, serviceData, { 
      new: true,
      runValidators: true 
    });
  } catch (error) {
    console.error('Error in updateService static method:', error);
    throw error;
  }
};

// Static method to delete a service
serviceSchema.statics.deleteService = async function(id) {
  try {
    return await this.findByIdAndDelete(id);
  } catch (error) {
    console.error('Error in deleteService static method:', error);
    throw error;
  }
};

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;

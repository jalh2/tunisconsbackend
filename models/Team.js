const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Schema = mongoose.Schema;

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^$|^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email address or leave it empty'],
    default: ''
  },
  bio: {
    type: String,
    trim: true,
    default: ''
  },
  image: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true,
  strict: true // Enable strict mode
});

// Pre-save middleware to clean data
teamSchema.pre('save', function(next) {
  // Ensure default values for optional fields
  this.phone = this.phone || '';
  this.email = this.email || '';
  this.bio = this.bio || '';
  this.image = this.image || '';
  next();
});

// Static method to get all team members
teamSchema.statics.getAllTeamMembers = async function() {
  try {
    console.log('Fetching all team members...');
    const members = await this.find().sort({ createdAt: -1 });
    console.log(`Found ${members.length} team members`);
    return members;
  } catch (error) {
    console.error('Error in getAllTeamMembers:', error);
    throw Error('Error fetching team members');
  }
};

// Static method to add a new team member
teamSchema.statics.addTeamMember = async function(memberData) {
  try {
    console.log('Adding new team member:', memberData);
    
    // Create new member instance
    const member = new this(memberData);
    
    // Validate the document
    const validationError = member.validateSync();
    if (validationError) {
      console.error('Validation error:', validationError);
      throw validationError;
    }
    
    // Save the document
    const savedMember = await member.save();
    console.log('Team member saved successfully:', savedMember);
    return savedMember;
  } catch (error) {
    console.error('Error in addTeamMember:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw Error(messages.join(', '));
    }
    throw error;
  }
};

// Static method to update a team member
teamSchema.statics.updateTeamMember = async function(id, updates) {
  try {
    console.log('Updating team member:', id, updates);
    
    const member = await this.findByIdAndUpdate(
      id,
      { $set: updates },
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    );

    if (!member) {
      throw Error('Team member not found');
    }

    console.log('Team member updated successfully:', member);
    return member;
  } catch (error) {
    console.error('Error in updateTeamMember:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw Error(messages.join(', '));
    }
    throw error;
  }
};

// Static method to delete a team member
teamSchema.statics.deleteTeamMember = async function(id) {
  try {
    console.log('Deleting team member:', id);
    
    const member = await this.findById(id);
    if (!member) {
      throw Error('Team member not found');
    }

    // Delete the member's image if it exists
    if (member.image) {
      const imagePath = path.join(__dirname, '..', member.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await member.deleteOne();
    console.log('Team member deleted successfully');
    return member;
  } catch (error) {
    console.error('Error in deleteTeamMember:', error);
    throw Error('Error deleting team member');
  }
};

// Static method to update team member's image
teamSchema.statics.updateMemberImage = async function(id, imagePath) {
  try {
    console.log('Updating team member image:', id, imagePath);
    
    const member = await this.findById(id);
    if (!member) {
      throw Error('Team member not found');
    }

    // Delete old image if it exists
    if (member.image) {
      const oldImagePath = path.join(__dirname, '..', member.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    member.image = imagePath;
    await member.save();
    console.log('Team member image updated successfully');
    return member;
  } catch (error) {
    console.error('Error in updateMemberImage:', error);
    throw Error('Error updating member image');
  }
};

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;

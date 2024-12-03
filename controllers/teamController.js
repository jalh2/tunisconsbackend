const Team = require('../models/Team');
const fs = require('fs');
const path = require('path');

// Get all team members
const getTeamMembers = async (req, res) => {
  try {
    const members = await Team.getAllTeamMembers();
    res.json(members);
  } catch (error) {
    console.error('Error in getTeamMembers:', error);
    res.status(400).json({ error: error.message });
  }
};

// Add a new team member
const addTeamMember = async (req, res) => {
  try {
    // Validate required fields
    const { name, position } = req.body;
    if (!name || !position) {
      return res.status(400).json({ 
        error: 'Name and position are required',
        details: {
          name: !name ? 'Name is required' : null,
          position: !position ? 'Position is required' : null
        }
      });
    }

    // Add image path if file was uploaded
    const memberData = { ...req.body };
    if (req.file) {
      memberData.image = `/uploads/team/${req.file.filename}`;
    }

    const member = await Team.addTeamMember(memberData);
    res.status(201).json(member);
  } catch (error) {
    console.error('Error in addTeamMember:', error);
    res.status(400).json({ error: error.message });
  }
};

// Update a team member
const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate required fields
    const { name, position } = req.body;
    if (!name || !position) {
      return res.status(400).json({ 
        error: 'Name and position are required',
        details: {
          name: !name ? 'Name is required' : null,
          position: !position ? 'Position is required' : null
        }
      });
    }

    // Add image path if file was uploaded
    const memberData = { ...req.body };
    if (req.file) {
      memberData.image = `/uploads/team/${req.file.filename}`;
    }

    const member = await Team.updateTeamMember(id, memberData);
    res.json(member);
  } catch (error) {
    console.error('Error in updateTeamMember:', error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a team member
const deleteTeamMember = async (req, res) => {
  try {
    const member = await Team.deleteTeamMember(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    // Delete the member's image if it exists
    if (member.image) {
      const imagePath = path.join(__dirname, '..', member.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: 'Team member deleted successfully', member });
  } catch (error) {
    console.error('Error in deleteTeamMember:', error);
    res.status(400).json({ error: error.message });
  }
};

// Upload team member image
const uploadMemberImage = async (req, res) => {
  try {
    if (!req.file) {
      throw Error('No image file provided');
    }

    const member = await Team.findById(req.params.id);
    if (!member) {
      // Delete the uploaded file if member doesn't exist
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Team member not found' });
    }

    // Delete old image if it exists
    if (member.image) {
      const oldImagePath = path.join(__dirname, '..', member.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update member with new image path
    const imagePath = '/uploads/' + req.file.filename;
    const updatedMember = await Team.updateMemberImage(req.params.id, imagePath);
    res.json(updatedMember);
  } catch (error) {
    console.error('Error in uploadMemberImage:', error);
    // Delete the uploaded file if there's an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  uploadMemberImage
};

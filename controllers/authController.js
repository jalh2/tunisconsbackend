const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

// Login admin
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.login(username, password);
    const token = createToken(admin._id);
    res.status(200).json({ username, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Signup admin
const signupAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.signup(username, password);
    const token = createToken(admin._id);
    res.status(200).json({ username, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete all admin accounts
const deleteAllAdmins = async (req, res) => {
  try {
    await Admin.deleteMany({});
    res.status(200).json({ message: 'All admin accounts deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginAdmin, signupAdmin, deleteAllAdmins };

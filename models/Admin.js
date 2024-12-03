const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Static signup method
adminSchema.statics.signup = async function(username, password) {
  // Validation
  if (!username || !password) {
    throw Error('All fields must be filled');
  }

  // Check if username exists
  const exists = await this.findOne({ username });
  if (exists) {
    throw Error('Username already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const admin = await this.create({ username, password: hash });
  return admin;
};

// Static login method
adminSchema.statics.login = async function(username, password) {
  // Validation
  if (!username || !password) {
    throw Error('All fields must be filled');
  }

  const admin = await this.findOne({ username });
  if (!admin) {
    throw Error('Incorrect username');
  }

  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    throw Error('Incorrect password');
  }

  return admin;
};

module.exports = mongoose.model('Admin', adminSchema);

const mongoose = require('mongoose');
const crypto = require('crypto');
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
  },
  salt: {
    type: String,
    required: true
  }
});

// Utility functions for password hashing
function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

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

  const salt = generateSalt();
  const hash = hashPassword(password, salt);

  const admin = await this.create({ 
    username, 
    password: hash,
    salt: salt 
  });
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

  const hash = hashPassword(password, admin.salt);
  if (hash !== admin.password) {
    throw Error('Incorrect password');
  }

  return admin;
};

module.exports = mongoose.model('Admin', adminSchema);

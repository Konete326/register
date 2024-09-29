// models/User.js
const mongoose = require('mongoose');

// Define the schema for the user collection
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true // Ensure username is unique
  },
  password: {
    type: String,
    required: true
  }
});

// Create a model from the schema
const User = mongoose.model('User', UserSchema);
module.exports = User;

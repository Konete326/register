const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Import the User model
const path = require('path');
require('dotenv').config(); // To use environment variables

const app = express(); 
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.set('views', path.join(__dirname, 'views')); // Set views directory

// Connect to MongoDB (Updated for MongoDB Atlas)
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));

// Route to display registration form
app.get('/register', (req, res) => {
  res.render('register');
});

// Route to register a new user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Hash the password before saving to the database
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create and save a new user
  const newUser = new User({
    username,
    password: hashedPassword
  });

  try {
    await newUser.save();
    res.send('User registered successfully!');
  } catch (err) {
    res.status(400).send('Error registering user');
  }
});

// Route to display login form
app.get('/login', (req, res) => {
  res.render('login');
});

// Route to login user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = await User.findOne({ username: username });
  if (!user) return res.status(400).send('Invalid username or password');

  // Compare the provided password with the stored hashed password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid username or password');

  res.send('Login successful');
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

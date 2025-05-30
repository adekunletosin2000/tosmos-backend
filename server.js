require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Contact = require('./models/Contact'); // ✅ Corrected path

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please fill all required fields.' });
    }

    const contactEntry = new Contact({ name, email, message });
    await contactEntry.save();

    return res.status(201).json({ message: 'Message received successfully.' });
  } catch (error) {
    console.error('Error in /api/contact:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Root route to verify server is running
app.get('/', (req, res) => {
  res.send('Tosmos Backend API is running');
});

// Listen on the port Heroku assigns or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

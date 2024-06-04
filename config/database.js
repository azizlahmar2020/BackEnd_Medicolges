  // config/database.js
  const mongoose = require('mongoose');

  const connectDB = async () => {
    try {
      await mongoose.connect('mongodb+srv://lahmarmohamedaziz:75941306@cluster0.v3x7igc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
      console.log('MongoDB Connected');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1); // Exit process with failure
    }
  };

  module.exports = connectDB;

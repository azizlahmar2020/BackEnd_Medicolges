// models/projects.js
const mongoose = require('mongoose');
const User = require('./user'); // Adjust the path as needed

const projectSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  responsable: {
    type: String,
    required: true,
  },
  domaine: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now, // Set the default value to the current date
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  likes: {
    type: Number,
    default: 0, // Initial number of likes
  },
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    comment: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],


});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;

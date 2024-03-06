// models/projects.js
const mongoose = require('mongoose');

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
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
});

// Add a static method to the schema to add a member to the project
projectSchema.statics.addMember = async function(projectId, userId) {
  try {
    // Find the project by ID
    const project = await this.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    // Check if the user is already a member of the project
    if (project.members.includes(userId)) {
      throw new Error('User is already a member of the project');
    }
    
    // Add the user ID to the project's members array
    project.members.push(userId);

    // Save the updated project
    await project.save();

    return project;
  } catch (error) {
    throw error;
  }
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
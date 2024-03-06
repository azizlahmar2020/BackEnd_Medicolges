// controllers/projectController.js
const Project = require('../models/projects');



exports.createProjectt = async (req, res) => {
  try {
    // Get the data from the request body
    const { nom, desc, responsable, domaine } = req.body;

    // Create a new project with the data
    const newProject = await Project.create({
      nom: nom,
      desc: desc,
      responsable: responsable,
      domaine: domaine,
    });

    // Respond with the created project
    res.status(201).json({ project: newProject });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.createProject = async (req, res) => {
  try {
    // Get the data from the request body
    const { nom, desc, responsable, domaine } = req.body;

    // Create a new project with the data
    const newProject = await Project.create({
      nom: nom,
      desc: desc,
      responsable: responsable,
      domaine: domaine,
    });

    // Respond with the created project
    res.status(201).json({ project: newProject });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) throw new Error('Project not found');
    res.json(project);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) throw new Error('Project not found');

    // Update project fields
    if (req.body.nom) project.nom = req.body.nom;
    if (req.body.desc) project.desc = req.body.desc;
    if (req.body.responsable) project.responsable = req.body.responsable;
    if (req.body.domaine) project.domaine = req.body.domaine;
    if (req.body.file) project.file = req.body.file;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) throw new Error('Project not found');
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const upload = require('../config/multerConfig'); // Adjust the path based on your project structure

// Create a new project
exports.createProject = upload.single('file'), async (req, res) => {
  try {
    console.log(req.body); // Log the request body to see if data is received
    console.log(req.file); // Log the file object to see if the file is received

    const { nom, desc, responsable, domaine } = req.body;
    // Use req.file.buffer to access the file data
    const file = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    // Use the 'file' object in your MongoDB save logic
    // Example: const newProject = new Project({ nom, desc, responsable, domaine, file });
    // Rest of your code
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// controllers/projectController.js
const Project = require('../models/projects');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.createProjectt = async (req, res) => {
  try {
    // Get the data from the request body
    const { nom, desc, responsable, domaine,members } = req.body;

    // Check if token exists in the request headers or cookies
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader ? authorizationHeader.split(" ")[1] : req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const secretKey = "sarrarayen"; // Replace with your actual secret key

    // Verify the token using the secret key
    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const userId = decoded.userId; // Extract the user ID from the decoded token payload

      console.log('User ID:', userId); // Log the user ID

      // Create a new project with the data and user ID
      const newProject = await Project.create({
        nom: nom,
        desc: desc,
        responsable: responsable,
        domaine: domaine,
        userId: userId,
        members: members,
        // Associate the user ID with the project
      });

      // Respond with the created project
      res.status(201).json({ project: newProject });
    });
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
exports.getAllProjectsOfUser = async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader ? authorizationHeader.split(" ")[1] : req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const secretKey = "sarrarayen"; // Replace with your actual secret key

    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const userId = decoded.userId; // Extract the user ID from the decoded token payload

      // Find projects associated with the user ID
      const projects = await Project.find({ userId: userId });

      res.json(projects);
    });
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
exports.addMember = async (req, res) => {
  const { projectId, memberId } = req.params; // Extract projectId and memberId from URL parameters

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.members.includes(memberId)) {
      return res.status(400).json({ error: 'User is already a member of the project' });
    }

    project.members.push(memberId);
    await project.save();

    return res.status(200).json({ message: 'Member added successfully', project });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
// Add like to a project
exports.likeProject = async (req, res) => {
  const { projectId } = req.params; // Extract projectId from URL parameters

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Increment the number of likes for the project
    project.likes += 1;

    // Save the updated project with the incremented likes count
    await project.save();

    return res.status(200).json({ message: 'Project liked successfully', project });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Add comment to a project
// Add comment to a project
exports.addComment = async (req, res) => {
  const { projectId } = req.params;
  const { comment } = req.body;

  // Check if token exists in the request headers or cookies
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader ? authorizationHeader.split(" ")[1] : req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

    const secretKey = "sarrarayen"; // Replace with your actual secret key

  // Verify the token using the secret key
  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const userId = decoded.userId; // Extract the user ID from the decoded token payload

    try {
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
       // Push an object with user information and comment fields into the comments array
    project.comments.push({ 
      userId, 
      user: { 
        name: user.name, 
        lastname: user.lastname, 
        profileImage: user.profileImage 
      }, 
      comment 
    });

      const updatedProject = await project.save();

      res.status(200).json({ message: 'Comment added successfully', project: updatedProject });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
};
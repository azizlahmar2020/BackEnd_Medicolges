// routes/projectRoutes.js

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Get all projects
router.get('/showProjects', projectController.getAllProjects);

// Get a project by ID
router.get('/getProject/:id', projectController.getProjectById);

// Update a project
router.put('/updateProject/:id', projectController.updateProject);

// Delete a project
router.delete('/deleteProject/:id', projectController.deleteProject);
router.post('/createProject', projectController.createProject);
router.post('/createProjectt', projectController.createProjectt);


module.exports = router;
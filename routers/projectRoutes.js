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

router.get('/showProjectsOfUser', projectController.getAllProjectsOfUser);

router.post('/addMember/:projectId/:memberId', projectController.addMember);

// Like a project
router.post('/likeProject/:projectId', projectController.likeProject);

// Route to add comment to a project
router.post('/addComment/:projectId', projectController.addComment);

module.exports = router;
const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.get('/showUsers', userController.showUsers);
router.get('/getUser/:id', userController.getUserById);
router.put('/updateUser/:id', userController.updateUser);
router.delete('/deleteUser/:id', userController.deleteUser);
router.put('/updateUserRole/:id', userController.updateUserRole);
router.get('/getUserByEmail/:email', userController.getUserByEmail); // New route for getUserByEmail

module.exports = router;

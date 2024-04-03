const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.get('/showUsers', userController.showUsers);
router.get('/getUser/:id', userController.getUserById);
router.delete('/deleteUser/:id', userController.deleteUser);
router.put('/updateUserRole/:id', userController.updateUserRole);
router.get('/getUserByEmail/:email', userController.getUserByEmail); // New route for getUserByEmail
router.get('/getUserFullName/:id', userController.getUserNameById);
router.get('/count', userController.countUsers);


module.exports = router;

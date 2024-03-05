const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const userController=require('../controllers/UserController')



router.get('/showUsers',userController.showUsers);


router.get('/getUser/:id',userController.getUserById);

router.put('/updateUser/:id',userController.updateUser);

router.delete('/deleteUser/:id', userController.deleteUser);


// Route pour mettre à jour le rôle d'un utilisateur
router.put('/updateUserRole/:id',userController.updateUserRole);


 
module.exports = router;

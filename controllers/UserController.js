const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');


exports.showUsers= async(req, res) => {
    UserModel.find({}, 'name lastname email gender birthdate role profileImage') // Specify fields to include
        .then(users => res.json(users))
        .catch(err => res.status(500).json(err));
};


exports.getUserById = async(req, res) => {
    const id = req.params.id;
    UserModel.findById(id)
        .then(user => res.json(user))
        .catch(err => res.json(err));
};

exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { name, lastname, email, gender, birthdate } = req.body;

    try {
        let profileImage = req.body.profileImage;

        // Check if a new profile image is uploaded
        if (req.file) {
            profileImage = req.file.filename; // Use the filename of the uploaded image
        }

        // Update the user with the new details including the profile image
        const updatedUser = await UserModel.findByIdAndUpdate(userId,
            { name, lastname, email, gender, birthdate, profileImage },
            { new: true }); // Use { new: true } to return the updated document

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



exports.deleteUser= async (req, res) => {
    const userId = req.params.id;

    try {
        // Supprimer l'utilisateur en fonction de son ID
        const deletedUser = await UserModel.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Route pour mettre à jour le rôle d'un utilisateur
exports.updateUserRole= async (req, res) => {
    const userId = req.params.id;
    const newRole = "coordinator"; // New role to assign to the user
  
    try {
      // Find the user by their ID and update their role
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { role: newRole },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // You can optionally exclude sending the updated user in the response and simply send a success message
      res.json({ message: "User role updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  


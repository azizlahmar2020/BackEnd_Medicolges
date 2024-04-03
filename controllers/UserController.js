const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const upload = require('../config/multerConfig'); // Import the upload object

const multer = require('multer');
const jwt = require('jsonwebtoken');


exports.showUsers = async (req, res) => {
  try {
      // Check if token exists in the request headers
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          return res.status(401).json({ error: "Unauthorized" });
      }

      // Extract the token from the authorization header
      const token = authorizationHeader.split(" ")[1];

      // Verify the token using the secret key
      const secretKey = "sarrarayen"; // Replace with your actual secret key
      const decoded = jwt.verify(token, secretKey);

      // Extract the user ID from the decoded token
      const userId = decoded.userId;

      // Fetch users from the database
      const users = await UserModel.find({}, 'name lastname email gender birthdate role profileImage');

      // Respond with the users and session ID
      res.json({ users: users, sessionId: userId });
  } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
          return res.status(401).json({ error: "Invalid token" });
      }
      res.status(400).json({ message: error.message });
  }
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
      // Check if a new profile image is uploaded
      const profileImage = req.file ? req.file.filename : null;

      // Update the user with the new details including the profile image
      const updateObject = {
          name,
          lastname,
          email,
          gender,
          birthdate,
      };

      if (profileImage) {
          updateObject.profileImage = profileImage;
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
          updateObject,
          { new: true }
      ); // Use { new: true } to return the updated document

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

  
  exports.getUserByEmail = async (req, res) => {
    const { email } = req.params;
  
    try {
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.getMembersByProject = async (req, res) => {
    const { projectId } = req.params;
  
    try {
      const project = await Project.findById(projectId).populate('members', 'name'); // Assuming 'name' is the field you want to retrieve from the 'User' model
  
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      res.status(200).json({ members: project.members });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.getUserNameById = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await UserModel.findById(id);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Concaténer le nom et le prénom pour former une seule chaîne
        const fullName = `${user.name} ${user.lastname}`;

        // Retourner la chaîne contenant le nom complet de l'utilisateur
        res.json({ fullName });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
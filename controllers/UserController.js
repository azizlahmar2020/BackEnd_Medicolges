const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');

const jwt = require('jsonwebtoken');




exports.showUsers = async (req, res) => {
  try {
      // Vérifiez si le token existe dans les en-têtes de la requête
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          return res.status(401).json({ error: "Unauthorized" });
      }

      // Extrait le token de l'en-tête d'autorisation
      const token = authorizationHeader.split(" ")[1];

      // Vérifie le token à l'aide de la clé secrète
      const secretKey = "sarrarayen"; // Remplacez par votre véritable clé secrète
      const decoded = jwt.verify(token, secretKey);

      // Extrait l'ID de l'utilisateur du token décodé
      const userId = decoded.userId;

      // Recherchez les utilisateurs dans la base de données, excluant les utilisateurs avec le rôle 'admin'
      const users = await UserModel.find({ role: { $ne: 'admin' } }, 'name lastname email gender birthdate role profileImage');

      // Répond avec les utilisateurs et l'ID de session
      res.json({ users: users, sessionId: userId });
  } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
          return res.status(401).json({ error: "Invalid token" });
      }
      res.status(500).json({ message: error.message });
  }
};


exports.countUsers = async (req, res) => {
  try {
    // Count the total number of users in the database
    const totalUsersCount = await UserModel.countDocuments();

    // Respond with the total number of users
    res.json({ totalUsers: totalUsersCount });
  } catch (error) {
    // Handle errors
    console.error("Error counting users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserById = async(req, res) => {
    const id = req.params.id;
    UserModel.findById(id)
        .then(user => res.json(user))
        .catch(err => res.json(err));
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
  exports.getUserImageById = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Récupérer l'image de profil de l'utilisateur
        const profileImage = user.profileImage;
        // Si l'image de profil existe, vous pouvez la retourner
        if (profileImage) {
            // Retourner l'URL de l'image de profil
            res.json({ profileImage });
        } else {
            // Si l'utilisateur n'a pas d'image de profil, retournez un message indiquant que l'image n'a pas été trouvée
            res.status(404).json({ error: "Profile image not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
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
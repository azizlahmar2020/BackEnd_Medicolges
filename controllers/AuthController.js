const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer');

const verifyUserAndGetSession = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
      return res.json("token is missing");
  } else {
      jwt.verify(token, "sarrarayen", (err, decoded) => {
          if (err) {
              return res.json("error with token");
          } else {
              req.user = decoded; // Set decoded user information to request object
              next();
          }
      });
  }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.json("No record existed");
        }
        const passwordCorrect = await bcrypt.compare(password, user.password);
        if (passwordCorrect) {
            const secretKey = "sarrarayen"; 
            const expiration = '1h'; 
            jwt.sign(
                { userId: user._id, email: user.email },
                secretKey,
                { expiresIn: expiration },
                (err, token) => {
                  if (err) {
                    return res.status(500).json({ error: "Failed to generate token" });
                  }
                  const profilePageUrl = "/myprofile"; // Replace with the actual profile page URL
                  return res.json({ token, profilePageUrl });
                }
              );
        } else {
            return res.json("wrong password");
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};



exports.register= async (req, res) => {
    const { name, lastname, email, password, gender, birthdate } = req.body;
    const role = req.params.role;

    try {
        // Check if the email already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email already exists" });
        }

        // If the email does not exist, hash the password and create the user
        const hashedPassword = await bcrypt.hash(password, 10);
        // Get the filename of the uploaded profile image
        const profileImage = req.file ? req.file.filename : null;
        
        const newUser = await UserModel.create({ 
            name, 
            lastname, 
            email, 
            password: hashedPassword, 
            gender, 
            birthdate, 
            role, 
            profileImage // Store the filename in the database
        });        
        res.json("Success");
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.myprofile = (req, res) => {
    console.log('Request headers:', req.headers); // Log request headers
  
    // Check if token exists in the request headers or cookies
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader ? authorizationHeader.split(" ")[1] : req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    const secretKey = "sarrarayen"; // Replace with your actual secret key
  
    // Verify the token using the secret key
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }
  
      const userId = decoded.userId; // Extract the user ID from the decoded token payload
  
      // Continue with retrieving user profile using the user ID
      UserModel.findById(userId)
        .then(user => {
          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }
          res.json(user);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
        });
    });
  };

router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.json({ status: "Logged out" });
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json("token is missing");
    } else {
        jwt.verify(token, "sarrarayen", (err, decoded) => {
            if (err) {
                return res.json("error with token");
            } else {
                req.user = decoded; // Set decoded user information to request object
                next();
            }
        });
    }
};

exports.getIdMyProfile = (req, res) => {
    // Maintenant, vous pouvez accéder à l'objet de session utilisateur en utilisant req.userSession
    const userSession = req.userSession;

    // Répondez avec l'objet de session utilisateur
    res.json({ userSession });
};




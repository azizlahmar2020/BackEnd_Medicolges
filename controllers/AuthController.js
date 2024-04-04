const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const nodemailer = require('nodemailer');


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await UserModel.findOne({ email: email });
      if (!user) {
          return res.status(404).json("No record existed");
      }
      const passwordCorrect = await bcrypt.compare(password, user.password);
      if (passwordCorrect) {
          const secretKey = "sarrarayen"; // Assurez-vous que votre clé secrète est sécurisée et idéalement stockée dans des variables d'environnement.
          const expiration = '2h'; 
          jwt.sign(
              { userId: user._id, email: user.email, role: user.role }, // Inclure le rôle ici
              secretKey,
              { expiresIn: expiration },
              (err, token) => {
                if (err) {
                  return res.status(500).json({ error: "Failed to generate token" });
                }
                // Incluez le rôle de l'utilisateur dans la réponse, en plus du token.
                return res.json({ token, role: user.role }); // Supprimez profilePageUrl si vous n'en avez pas besoin ou ajustez selon vos besoins
              }
            );
      } else {
          return res.status(401).json("Wrong password");
      }
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.editProfile = async (req, res) => {
  const { name, lastname, email, gender, birthdate } = req.body; // Assuming these are the fields you want to allow to update
  const userId = req.params.userId; // Assuming you pass the user's ID as a URL parameter

  try {
      // Find the user by ID
      const user = await UserModel.findById(userId);
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      // Update the user's profile with the new details
      user.name = name || user.name;
      user.lastname = lastname || user.lastname;
      user.email = email || user.email;
      user.gender = gender || user.gender;
      user.birthdate = birthdate || user.birthdate;

      // Check if a new profile image was uploaded
      if (req.file) {
          const profileImage = req.file.filename; // Get the filename of the uploaded image
          user.profileImage = profileImage; // Update the profile image
      }

      await user.save(); // Save the updated user details

      res.json("Profile updated successfully");
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
  
      console.log('User ID:', userId); // Log the user ID
  
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


exports.getIdMyProfile = (req, res) => {
    // Assurez-vous que req.userSession contient l'ID de session
    const userSession = req.userSession;
  
    // Vérifiez si l'ID de session existe
    if (userSession && userSession.sessionId) {
      // Répondez avec l'objet de session utilisateur
      res.json({ userSession });
    } else {
      // S'il n'y a pas d'ID de session, répondez avec un code d'erreur approprié
      res.status(400).json({ error: "Session ID not found" });
    }
  };
  

 // Function to generate a unique token
const generateResetToken = (userId) => {
  return jwt.sign({ userId }, 'sarrarayen', { expiresIn: '1h' }); // Customize the expiration time as needed
};

// Function to send a verification email
const sendVerificationEmail = async (email, resetToken) => {
  const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
          user: 'sarra03122000@gmail.com',
          pass: 'zooe zcao hvur qzwv',
      },
  });

  const resetLink = `http://127.0.0.1:5173/reset-password?token=${resetToken}`; // Customize the reset link URL

  const mailOptions = {
    from: 'sarra03122000@gmail.com',
    to: email,
    subject: 'Password Reset',
    html: `<p>Dear MediColGes User,</p>
        <p>We received a request to reset your password. Click the link below to reset your password:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>If you didn't request to reset your password, you can ignore this email.</p>
        <p>MediColGes Team</p>
    `
};
  try {
      await transporter.sendMail(mailOptions);
      console.log('E-mail sent');
  } catch (error) {
      console.log('E-mail sending failed');
      throw new Error('E-mail sending failed');
  }
};

// Controller function to handle forgot password request
exports.reset = async (req, res) => {
  try {
      const { email } = req.body;
      const resetToken = generateResetToken(email);
      await sendVerificationEmail(email, resetToken);
      res.status(200).json({ message: 'Le code est envoyé! Vérifiez votre boîte mail svp!' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// Controller function to handle password reset
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  jwt.verify(token, 'sarrarayen', async (err, decoded) => {
      if (err) {
          return res.status(400).json({ message: 'Invalid or expired token' });
      } else {
          try {
              const userEmail = decoded.userId; // Assuming userId is actually the email
              const hashedPassword = await bcrypt.hash(password, 10);
              const user = await UserModel.findOne({ email: userEmail }); // Find user by email
              console.log(user)
              if (!user) {
                  return res.status(404).json({ message: 'User not found' });
              }
              user.password = hashedPassword;
              await user.save();
              res.status(200).json({ message: 'Password updated successfully' });
          } catch (error) {
              res.status(500).json({ message: 'Failed to update password', error: error.message });
          }
      }
  });
};
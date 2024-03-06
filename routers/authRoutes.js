const express = require('express');
const router = express.Router();
const multer = require('multer');
const authController = require('../controllers/AuthController');
const jwt = require('jsonwebtoken');

// Middleware for authenticating the token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the token and extract the payload
    const decoded = jwt.verify(token, 'sarrarayen');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Create a storage object with the desired configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/profiles'); // Specify the destination folder where the profile images will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Generate a unique filename for the uploaded file
  }
});

const upload = multer({ storage: storage });

router.post('/login', authController.login);

router.post('/register/:role', upload.single('profileImage'), authController.register);

// Protected route for fetching the user profile
router.get('/myprofile', authenticateToken, authController.myprofile);

module.exports = router;
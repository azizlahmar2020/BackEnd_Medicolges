const multer = require('multer');

const storage = multer.memoryStorage(); // Use memory storage for simplicity

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

module.exports = upload;
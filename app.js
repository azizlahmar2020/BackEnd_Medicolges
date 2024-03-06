const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const InstitutionRoutes = require('./routers/InstitutionRoutes');
const CategoryRoutes = require('./routers/CategoryRoutes');
const SubcategoryRoutes = require('./routers/SubcategoryRoutes');
const connectDB = require('./config/database');
const app = express();

app.use(express.json());
// Activer CORS
app.use(cors({
  origin: 'http://localhost:3001'
}));

// Connect to MongoDB database
connectDB().then(() => {
  // Use Institution routes after establishing connection to the database
  app.use('/', InstitutionRoutes);
  
  // Use Category routes after establishing connection to the database
  app.use('/', CategoryRoutes);

  // Use Subcategory routes after establishing connection to the database
  app.use('/', SubcategoryRoutes);



  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}).catch((err) => {
  console.error("Error connecting to MongoDB :", err);
});

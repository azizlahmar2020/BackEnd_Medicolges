const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const UserRoutes = require('./routes/userRoutes');
const AuthRoutes = require('./routes/authRoutes');
const FormRoutes = require('./routes/formRoutes');
const projectRoutes = require('./routes/projectRoutes');

const connectDB = require('./config/database');

const app = express();

app.use(express.json());
// Activer CORS
app.use('/profiles', express.static('public/profiles'));

app.use(express.json());
const allowedOrigins = ['http://127.0.0.1:5173'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
// Connect to MongoDB database
connectDB().then(() => {
 app.use('/auth',AuthRoutes);
 app.use('/users',UserRoutes);
 app.use('/form',FormRoutes);
 app.use('/projects', projectRoutes);



  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}).catch((err) => {
  console.error("Error connecting to MongoDB :", err);
});

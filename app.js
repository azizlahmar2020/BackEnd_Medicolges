const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const ChatRouter = require("./routers/Chat");
const UserRoutes = require('./routers/userRoutes');
const AuthRoutes = require('./routers/authRoutes');
const InstitutionRoutes = require('./routers/InstitutionRoutes');
const CategoryRoutes = require('./routers/CategoryRoutes');
const SubcategoryRoutes = require('./routers/SubcategoryRoutes');
const projectRoutes = require('./routers/projectRoutes');
const formRoutes = require('./routers/form.route');
const  Rdv  = require("./routers/RDVRoutes");

const jwt = require('jsonwebtoken');

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket'], // Assurez-vous que WebSocket est activé
});
app.use(cors({
    origin: "",
    methods: ["GET", "POST","PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true
}));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Gestion de la connexion socket.io
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});
// Routes
app.use("/rdv",Rdv); // Utilisez ici la route pour le calendrier

app.use("/Chat", ChatRouter(io)); // Passer io au routeur
app.use('/auth',AuthRoutes);
 app.use('/users',UserRoutes);
 app.use('/projects', projectRoutes);
  app.use('/profiles', express.static('public/profiles'));
  app.use('/', InstitutionRoutes);
  app.use("/rdv",Rdv); // Utilisez ici la route pour le calendrier

  // Use Category routes after establishing connection to the database
  app.use('/', CategoryRoutes);

  // Use Subcategory routes after establishing connection to the database
  app.use('/', SubcategoryRoutes);
  app.use('/', formRoutes);


// Connexion à la base de données mongoose
mongoose.connect("mongodb+srv://lahmarmohamedaziz:75941306@cluster0.v3x7igc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


app.get('/api/verify-token', (req, res) => {
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
        res.json({ userId: userId }); // Send the user ID in the response
    });
});
// Démarrage du serveur
const PORT = 3001;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

});

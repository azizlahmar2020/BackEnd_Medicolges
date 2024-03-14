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
app.use("/Chat", ChatRouter(io)); // Passer io au routeur
app.use('/auth',AuthRoutes);
 app.use('/users',UserRoutes);
 app.use('/projects', projectRoutes);
  app.use('/profiles', express.static('public/profiles'));
  app.use('/', InstitutionRoutes);
  
  // Use Category routes after establishing connection to the database
  app.use('/', CategoryRoutes);

  // Use Subcategory routes after establishing connection to the database
  app.use('/', SubcategoryRoutes);
  app.use('/', formRoutes);


// Connexion à la base de données mongoose
mongoose.connect("mongodb://127.0.0.1:27017/MediColges", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Démarrage du serveur
const PORT = 3001;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

});

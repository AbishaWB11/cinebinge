const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");

const app = express();

// CORS Configuration
const corsOptions = {
    origin: function(origin, callback) {
        const allowedOrigins = [
            "https://cinebinge-ff8y.onrender.com",
            "https://cinebinge1.vercel.app",
            "http://localhost:5173",
            "http://localhost:3000"
        ];
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Explicit OPTIONS handler for preflight
app.options("*", cors(corsOptions));
app.use(express.json());

// DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Welcome to CineBinge API");
});

app.listen(process.env.PORT || 10000, () => {
    console.log("Server running");
});
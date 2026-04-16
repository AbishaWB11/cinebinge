const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");

const app = express();
app.use(cors());
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

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
const express = require("express");
const router = express.Router();

const Watchlist = require("../models/Watchlist");
const protect = require("../middleware/authMiddleware");

// ADD movie
router.post("/", protect, async (req, res) => {
    const { movieId, title, poster } = req.body;

    const movie = await Watchlist.create({
        userId: req.user.id,
        movieId,
        title,
        poster,
    });

    res.json(movie);
});

// GET watchlist
router.get("/", protect, async (req, res) => {
    const movies = await Watchlist.find({ userId: req.user.id });
    res.json(movies);
});

// DELETE movie
router.delete("/:id", protect, async (req, res) => {
    await Watchlist.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

module.exports = router;
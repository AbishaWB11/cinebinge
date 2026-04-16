const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    movieId: String,
    title: String,
    poster: String,
});

module.exports = mongoose.model("Watchlist", watchlistSchema);


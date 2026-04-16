import { useState } from "react";
import "./index.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Watchlist from "./components/Watchlist";
import { getAuthToken } from "./utils/auth";
import Login from "./components/Login";
import Signup from "./components/Signup"; //
import { Bookmark, LogOut } from "lucide-react";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [page, setPage] = useState("login");
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };
  const goHome = () => {
    setIsWatchlistOpen(false); // close sidebar if open
    setMood("");
    setGenre("");
    setTime("");
  };

  const [mood, setMood] = useState("");
  const [time, setTime] = useState("");
  const [genre, setGenre] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [watchlistVersion, setWatchlistVersion] = useState(0);
  const [watchlistIds, setWatchlistIds] = useState([]);

  const moods = ["happy", "sad", "romantic", "horror", "chill"];

  const genres = {
    action: 28,
    comedy: 35,
    drama: 18,
    horror: 27,
    romance: 10749,
    thriller: 53,
  };

  const timeMap = {
    short: 90,
    medium: 120,
    long: 180,
  };

  const addToWatchlist = async (movie) => {
    try {
      const token = getAuthToken();

      if (!token) {
        console.error("No auth token");
        return;
      }

      // ✅ STEP 1: GET existing watchlist
      const checkRes = await fetch("http://localhost:5000/api/watchlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const existing = await checkRes.json();

      // ❌ STEP 2: STOP if already exists
      if (existing.some((item) => item.movieId == movie.id)) {
        console.log("Already added");
        return;
      }

      // ✅ STEP 3: ADD movie
      const res = await fetch("http://localhost:5000/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieId: movie.id,
          title: movie.title,
          poster: movie.poster_path,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add");
      }

      // ✅ refresh UI
      setWatchlistVersion((prev) => prev + 1);

    } catch (err) {
      console.error(err);
    }
  };

  const pickMovies = async () => {
    try {
      setLoading(true);

      let query = `https://api.themoviedb.org/3/discover/movie?api_key=4575a8d68fc2a21ba880fa45792583ea`;

      if (genre) query += `&with_genres=${genres[genre]}`;
      if (time) query += `&with_runtime.lte=${timeMap[time]}`;

      const res = await fetch(query);
      const data = await res.json();

      const shuffled = data.results.sort(() => 0.5 - Math.random());
      setResult(shuffled.slice(0, 6));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔐 AUTH FLOW
  if (!isLoggedIn) {
    if (page === "signup") {
      return <Signup goToLogin={() => setPage("login")} />;
    }

    return (
      <Login
        setIsLoggedIn={setIsLoggedIn}
        goToSignup={() => setPage("signup")}
      />
    );
  }

  // 🎬 MAIN APP
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050510] via-[#0a0a1f] to-[#1a1a40] text-white">

      <Header
        openWatchlist={() => setIsWatchlistOpen(true)}
        isOpen={isWatchlistOpen}
        onLogout={handleLogout}
        goHome={goHome}
      />

      <Hero
        apiKey="4575a8d68fc2a21ba880fa45792583ea"
        onPick={pickMovies}
      />

      <Watchlist
        isOpen={isWatchlistOpen}
        close={() => setIsWatchlistOpen(false)}
        refreshKey={watchlistVersion}
      />

      <div className="p-4 mt-20">

        {/* MOOD */}
        <div className="mb-4">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`m-1 px-3 py-1 rounded-lg transition
            ${mood === m
                  ? "bg-gradient-to-r from-blue-600 to-purple-700"
                  : "bg-white/10 hover:bg-white/20"
                }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* GENRE */}
        <div className="mb-4">
          {Object.keys(genres).map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`m-1 px-3 py-1 rounded-lg transition
            ${genre === g
                  ? "bg-gradient-to-r from-blue-600 to-purple-700"
                  : "bg-white/10 hover:bg-white/20"
                }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* TIME */}
        <div className="mb-4">
          {Object.keys(timeMap).map((t) => (
            <button
              key={t}
              onClick={() => setTime(t)}
              className={`m-1 px-3 py-1 rounded-lg transition
            ${time === t
                  ? "bg-gradient-to-r from-blue-600 to-purple-700"
                  : "bg-white/10 hover:bg-white/20"
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={pickMovies}
          className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-2 rounded-lg hover:scale-105 transition"
        >
          Pick Movies
        </button>

        {loading && <p className="mt-3">Loading...</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-cols-3 gap-6 mt-6">
          {result.map((movie) => (
            <div
              key={movie.id}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-lg transition hover:scale-105 hover:-translate-y-1 hover:shadow-purple-500/20 flex flex-col"     >
              <img
                className="w-full h-56 object-cover rounded-lg mb-3"
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              />

              <p className="text-sm font-semibold mb-1">{movie.title}</p>

              <p className="text-xs text-gray-300 line-clamp-2 mb-2">
                {movie.overview}
              </p>

              <button
                onClick={() => addToWatchlist(movie)}
                className="w-full mt-2 py-1 rounded-lg mt-auto bg-gradient-to-r from-blue-600 to-purple-700 hover:scale-105 transition"
              >
                + Watchlist
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;
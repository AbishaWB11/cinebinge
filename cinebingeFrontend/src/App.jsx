import { useEffect, useState } from "react";
import "./index.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Watchlist from "./components/Watchlist";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { getAuthToken } from "./utils/auth";

const BASE_URL = "https://cinebinge-jc5s.onrender.com";
const TMDB_API_KEY = "4575a8d68fc2a21ba880fa45792583ea";

const moods = [
  "happy",
  "sad",
  "romantic",
  "horror",
  "chill",
  "excited",
  "motivational",
  "thrilling",
  "emotional",
  "mysterious",
  "adventurous",
  "feel-good",
];

const genres = {
  action: 28,
  comedy: 35,
  drama: 18,
  horror: 27,
  romance: 10749,
  thriller: 53,
  sciFi: 878,
  animation: 16,
  fantasy: 14,
  crime: 80,
  documentary: 99,
  family: 10751,
  mystery: 9648,
};

const timeMap = {
  short: 90,
  medium: 120,
  long: 180,
};

const moodGenreMap = {
  happy: [35, 10751, 16],
  sad: [18],
  romantic: [10749, 18],
  horror: [27, 53],
  chill: [35, 10751, 99],
  excited: [28, 12],
  motivational: [18, 99],
  thrilling: [53, 80, 9648],
  emotional: [18, 10749],
  mysterious: [9648, 53],
  adventurous: [12, 14, 28],
  "feel-good": [35, 10751, 10749],
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getAuthToken()));
  const [page, setPage] = useState("login");

  const [mood, setMood] = useState("");
  const [time, setTime] = useState("");
  const [genre, setGenre] = useState("");

  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [watchlistVersion, setWatchlistVersion] = useState(0);
  const [watchlistIds, setWatchlistIds] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setPage("login");
    setIsWatchlistOpen(false);
    setWatchlistIds([]);
    setResult([]);
    setError("");
  };

  const goHome = () => {
    setIsWatchlistOpen(false);
    setMood("");
    setGenre("");
    setTime("");
    setError("");
  };

  useEffect(() => {
    const fetchIds = async () => {
      const token = getAuthToken();

      if (!token) {
        setWatchlistIds([]);
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/api/watchlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          handleLogout();
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to load watchlist");
        }

        const data = await res.json();
        const items = Array.isArray(data) ? data : [];

        setWatchlistIds(
          items
            .map((movie) => Number(movie.movieId))
            .filter((id) => Number.isFinite(id))
        );
      } catch (err) {
        console.error(err);
      }
    };

    if (isLoggedIn) {
      fetchIds();
    } else {
      setWatchlistIds([]);
    }
  }, [isLoggedIn, watchlistVersion]);

  const addToWatchlist = async (movie) => {
    const token = getAuthToken();

    if (!token) {
      handleLogout();
      return;
    }

    const movieId = Number(movie.id);

    if (watchlistIds.includes(movieId)) {
      return;
    }

    setError("");
    setWatchlistIds((prev) => [...prev, movieId]);

    try {
      const res = await fetch(`${BASE_URL}/api/watchlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieId,
          title: movie.title,
          poster: movie.poster_path,
        }),
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to add movie to watchlist");
      }

      setWatchlistVersion((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      setWatchlistIds((prev) => prev.filter((id) => id !== movieId));
      setError("Couldn't add this movie to your watchlist. Please try again.");
    }
  };

  const pickMovies = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        api_key: TMDB_API_KEY,
        sort_by: "popularity.desc",
        include_adult: "false",
        language: "en-US",
      });

      const selectedGenres = new Set();

      if (genre && genres[genre]) {
        selectedGenres.add(String(genres[genre]));
      }

      if (mood && moodGenreMap[mood]) {
        moodGenreMap[mood].forEach((genreId) => {
          selectedGenres.add(String(genreId));
        });
      }

      if (selectedGenres.size > 0) {
        params.set("with_genres", Array.from(selectedGenres).join("|"));
      }

      if (time && timeMap[time]) {
        params.set("with_runtime.lte", String(timeMap[time]));
      }

      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?${params.toString()}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await res.json();
      const movies = Array.isArray(data.results) ? data.results : [];
      const filteredMovies = movies.filter(
        (movie) => movie.poster_path && movie.title && movie.overview
      );
      const shuffled = [...filteredMovies].sort(() => Math.random() - 0.5);

      setResult(shuffled.slice(0, 6));

      if (filteredMovies.length === 0) {
        setError("No movies matched that combination. Try different filters.");
      }
    } catch (err) {
      console.error(err);
      setResult([]);
      setError("Couldn't load movie recommendations right now.");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050510] via-[#0a0a1f] to-[#1a1a40] text-white">
      <Header
        openWatchlist={() => setIsWatchlistOpen(true)}
        isOpen={isWatchlistOpen}
        onLogout={handleLogout}
        goHome={goHome}
      />

      <Hero apiKey={TMDB_API_KEY} onPick={pickMovies} />

      <Watchlist
        isOpen={isWatchlistOpen}
        close={() => setIsWatchlistOpen(false)}
        refreshKey={watchlistVersion}
      />

      <div className="mt-20 p-4">
        <div className="mb-4">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setMood((prev) => (prev === m ? "" : m))}
              className={`m-1 rounded-lg px-3 py-1 ${
                mood === m
                  ? "bg-gradient-to-r from-blue-600 to-purple-700"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="mb-4">
          {Object.keys(genres).map((g) => (
            <button
              key={g}
              onClick={() => setGenre((prev) => (prev === g ? "" : g))}
              className={`m-1 rounded-lg px-3 py-1 ${
                genre === g
                  ? "bg-gradient-to-r from-blue-600 to-purple-700"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="mb-4">
          {Object.keys(timeMap).map((t) => (
            <button
              key={t}
              onClick={() => setTime((prev) => (prev === t ? "" : t))}
              className={`m-1 rounded-lg px-3 py-1 ${
                time === t
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
          className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-2 transition hover:scale-105"
        >
          Pick Movies
        </button>

        {loading && <p className="mt-3">Loading...</p>}
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {result.map((movie) => {
            const isAdded = watchlistIds.includes(Number(movie.id));

            return (
              <div key={movie.id} className="rounded-xl bg-white/10 p-3">
                <img
                  className="mb-3 h-56 w-full rounded-lg object-cover"
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                />

                <p className="mb-1 text-sm font-semibold">{movie.title}</p>

                <p className="mb-2 line-clamp-2 text-xs text-gray-300">
                  {movie.overview}
                </p>

                <button
                  onClick={() => addToWatchlist(movie)}
                  disabled={isAdded}
                  className={`mt-2 w-full rounded-lg py-1 transition ${
                    isAdded
                      ? "cursor-not-allowed bg-green-500"
                      : "bg-gradient-to-r from-blue-600 to-purple-700"
                  }`}
                >
                  {isAdded ? "✔ Added" : "+ Watchlist"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;

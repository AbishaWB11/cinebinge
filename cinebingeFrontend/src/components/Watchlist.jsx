import { useEffect, useState } from "react";
import { getAuthToken } from "../utils/auth";

const BASE_URL = "https://cinebinge-jc5s.onrender.com";

function Watchlist({ isOpen, close, refreshKey }) {
    const [watchlist, setWatchlist] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // 🔹 Fetch Watchlist
    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                setLoading(true);
                setError("");

                const token = getAuthToken();

                if (!token) {
                    setWatchlist([]);
                    setError("Login token not found.");
                    return;
                }

                const res = await fetch(`${BASE_URL}/api/watchlist`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json().catch(() => []);

                if (!res.ok) {
                    throw new Error(data.message || "Failed to load watchlist");
                }

                setWatchlist(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setWatchlist([]);
                setError(err.message || "Failed to load watchlist.");
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) fetchWatchlist();
    }, [isOpen, refreshKey]);

    // 🔹 Remove Movie
    const removeMovie = async (id) => {
        try {
            setError("");

            const token = getAuthToken();

            if (!token) {
                setError("Login token not found.");
                return;
            }

            const res = await fetch(`${BASE_URL}/api/watchlist/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data.message || "Failed to remove movie");
            }

            // ✅ Update UI instantly
            setWatchlist((prev) => prev.filter((m) => m._id !== id));

        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to remove movie.");
        }
    };

    return (
        <>
            {isOpen && (
                <div onClick={close} className="fixed inset-0 bg-black/60" />
            )}

            <div
                className={`fixed right-0 top-0 w-[340px] h-full bg-white/10 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Watchlist</h2>
                    <button
                        onClick={close}
                        className="text-white/60 hover:text-white text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    {loading && <p className="text-sm text-gray-300">Loading...</p>}

                    {error && (
                        <p className="mb-3 text-sm text-red-400">{error}</p>
                    )}

                    {!loading && watchlist.length === 0 && (
                        <p>No movies yet</p>
                    )}

                    {watchlist.map((movie) => (
                        <div
                            key={movie._id}
                            className="flex gap-3 mb-4 bg-white/10 p-2 rounded-lg"
                        >
                            <img
                                className="w-12 h-16 object-cover"
                                src={`https://image.tmdb.org/t/p/w200${movie.poster}`}
                                alt={movie.title}
                            />

                            <div className="flex-1">
                                <p className="text-xs">{movie.title}</p>

                                <button
                                    onClick={() => removeMovie(movie._id)}
                                    className="text-red-400 text-xs mt-1 hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Watchlist;
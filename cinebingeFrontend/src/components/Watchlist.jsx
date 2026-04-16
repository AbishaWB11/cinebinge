import { useEffect, useState } from "react";
import { getAuthToken } from "../utils/auth";
const BASE_URL = "https://cinebinge-jc5s.onrender.com";

function Watchlist({ isOpen, close, refreshKey }) {
    const [watchlist, setWatchlist] = useState([]);
    const [error, setError] = useState("");

    // fetch watchlist
    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const token = getAuthToken();

                if (!token) {
                    setWatchlist([]);
                    setError("Login token not found.");
                    return;
                }

                const res = await fetch("${BASE_URL}/api/watchlist", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json().catch(() => []);

                if (!res.ok) {
                    throw new Error(data.message || "Failed to load watchlist");
                }

                setWatchlist(Array.isArray(data) ? data : []);
                setError("");
            } catch (err) {
                console.error(err);
                setWatchlist([]);
                setError(err.message || "Failed to load watchlist.");
            }
        };

        if (isOpen) fetchWatchlist();
    }, [isOpen, refreshKey]);

    // remove movie
    const removeMovie = async (id) => {
        try {
            const token = getAuthToken();

            if (!token) {
                setError("Login token not found.");
                return;
            }

            const res = await fetch(`http://localhost:5000/api/watchlist/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Failed to remove movie");
            }

            setWatchlist((prev) => prev.filter((m) => m._id !== id));
            setError("");
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
                className={`fixed right-0 top-0 w-[340px] h-full bg-white/10 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Watchlist</h2>

                    <button
                        onClick={close}
                        className="text-white/60 hover:text-white text-xl"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-4">
                    {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

                    {watchlist.length === 0 && <p>No movies yet</p>}

                    {watchlist.map((movie) => (
                        <div key={movie._id} className="flex gap-3 mb-4 bg-white/10 p-2 rounded-lg">
                            <img
                                className="w-12 h-16 object-cover"
                                src={`https://image.tmdb.org/t/p/w200${movie.poster}`}
                            />
                            <div className="flex-1">
                                <p className="text-xs">{movie.title}</p>
                                <button
                                    onClick={() => removeMovie(movie._id)}
                                    className="text-red-400 text-xs"
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

import { useEffect, useState } from "react";

function Hero({ apiKey, onPick }) {
    const [movie, setMovie] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [videoKey, setVideoKey] = useState(null);

    useEffect(() => {
        const fetchHeroMovie = async () => {
            const res = await fetch(
                `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
            );
            const data = await res.json();

            const random =
                data.results[Math.floor(Math.random() * data.results.length)];

            setMovie(random);

            // prefetch trailer (faster)
            const vidRes = await fetch(
                `https://api.themoviedb.org/3/movie/${random.id}/videos?api_key=${apiKey}`
            );
            const vidData = await vidRes.json();

            const trailerVideo = vidData.results.find(
                (v) => v.type === "Trailer" && v.site === "YouTube"
            );

            if (trailerVideo) setVideoKey(trailerVideo.key);
        };

        fetchHeroMovie();
    }, [apiKey]);

    if (!movie) return null;

    return (
        <>
            <div
                className="relative h-[75vh] bg-cover bg-center flex items-end px-6 md:px-12 pb-12"
                style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                <div className="relative z-10 max-w-xl">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        {movie.title}
                    </h2>

                    <p className="text-gray-300 mb-6 line-clamp-3">
                        {movie.overview}
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={onPick}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-700 rounded"
                        >
                            Pick For Me
                        </button>

                        <button
                            onClick={() => setTrailer(true)}
                            className="px-6 py-2 bg-black/40 rounded"
                        >
                            ▶ Watch Trailer
                        </button>
                    </div>
                </div>
            </div>

            {/* Trailer Modal */}
            {trailer && videoKey && (
                <div className="fixed inset-0 bg-black/80 z-[999] flex justify-center items-center">
                    <div className="relative w-[90%] md:w-[700px]">
                        <button
                            onClick={() => setTrailer(false)}
                            className="absolute -top-8 right-0 text-white text-xl"
                        >
                            ✕
                        </button>

                        <iframe
                            className="w-full h-[400px]"
                            src={`https://www.youtube.com/embed/${videoKey}`}
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default Hero;